import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Pencil, Search, Trash2, UserRound } from "lucide-react";

const getTokenFromSession = (session) => {
  const token =
    session?.token ||
    session?.accessToken ||
    session?.authToken ||
    (typeof window !== "undefined"
      ? window.localStorage.getItem("subnivo_token")
      : null);

  return token || "";
};

const decodeJwtPayload = (token) => {
  if (!token || typeof window === "undefined") return null;

  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "=",
    );

    return JSON.parse(window.atob(padded));
  } catch {
    return null;
  }
};

const UsersPage = () => {
  const router = useRouter();
  const session = useSelector((state) => state.auth.userAndToken);
  const storedToken = getTokenFromSession(session);
  const [users, setUsers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    status: "active",
  });
  const [saving, setSaving] = useState(false);

  const loadUsers = useCallback(async () => {
    if (!storedToken) {
      router.replace("/auth/sign-in");
      return;
    }

    try {
      const userResponse = await fetch("/api/users/me", {
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        const currentUser = userData?.user || userData;

        if (currentUser?.role !== "admin") {
          router.replace("/dashboard");
          return;
        }
      } else {
        const jwtPayload = decodeJwtPayload(storedToken);
        if (jwtPayload?.role !== "admin") {
          router.replace("/dashboard");
          return;
        }
      }

      const [usersResponse, subscriptionsResponse] = await Promise.all([
        fetch("/api/users", {
          headers: { Authorization: `Bearer ${storedToken}` },
        }),
        fetch("/api/subscriptions", {
          headers: { Authorization: `Bearer ${storedToken}` },
        }),
      ]);

      if (!usersResponse.ok) {
        throw new Error("Failed to load users");
      }

      if (!subscriptionsResponse.ok) {
        throw new Error("Failed to load subscriptions");
      }

      const usersData = await usersResponse.json();
      const subscriptionsData = await subscriptionsResponse.json();
      setUsers(Array.isArray(usersData) ? usersData : []);
      setSubscriptions(
        Array.isArray(subscriptionsData) ? subscriptionsData : [],
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [router, storedToken]);

  useEffect(() => {
    if (!storedToken) {
      router.replace("/auth/sign-in");
      return;
    }

    loadUsers();
  }, [storedToken, router, loadUsers]);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    const customerUsers = [...users].filter((user) => user?.role !== "admin");

    const enrichedUsers = customerUsers.map((user) => {
      const userSubscription = [...subscriptions]
        .filter(
          (subscription) =>
            String(subscription?.user_id?._id || subscription?.user_id) ===
            String(user?._id),
        )
        .sort(
          (a, b) =>
            new Date(b?.createdAt || b?.startDate || 0) -
            new Date(a?.createdAt || a?.startDate || 0),
        )[0];

      return {
        ...user,
        subscriptionStatus: userSubscription?.status || "no subscription",
        planName:
          userSubscription?.plan_id?.name ||
          userSubscription?.planName ||
          "No plan",
      };
    });

    if (!term) {
      return enrichedUsers.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
    }

    return enrichedUsers
      .filter((user) => {
        const username = (user?.username || "").toLowerCase();
        const email = (user?.email || "").toLowerCase();
        const plan = (user?.planName || "").toLowerCase();

        return (
          username.includes(term) || email.includes(term) || plan.includes(term)
        );
      })
      .sort((a, b) => {
        const aName = (a?.username || "").toLowerCase();
        const bName = (b?.username || "").toLowerCase();
        const aEmail = (a?.email || "").toLowerCase();
        const bEmail = (b?.email || "").toLowerCase();

        const aStarts =
          aName.startsWith(term) ||
          aEmail.startsWith(term) ||
          (a?.planName || "").toLowerCase().startsWith(term);
        const bStarts =
          bName.startsWith(term) ||
          bEmail.startsWith(term) ||
          (b?.planName || "").toLowerCase().startsWith(term);

        if (aStarts !== bStarts) {
          return aStarts ? -1 : 1;
        }

        if (aName !== bName) {
          return aName.localeCompare(bName);
        }

        return aEmail.localeCompare(bEmail);
      });
  }, [searchTerm, users, subscriptions]);

  const handleDelete = async (userId) => {
    if (!userId) return;

    const confirmed = window.confirm("Delete this user?");
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers((current) => current.filter((user) => user._id !== userId));
    } catch (error) {
      console.error(error);
      alert("User could not be deleted.");
    }
  };

  const handleEditOpen = (user) => {
    setEditingUser(user);
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
      status: user?.status || "active",
    });
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;

    setSaving(true);

    try {
      const response = await fetch(`/api/users/${editingUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Update failed");
      }

      const updated = await response.json();
      const incomingUser = updated?.updatedUser || updated;

      setUsers((current) =>
        current.map((user) =>
          user._id === editingUser._id ? { ...user, ...incomingUser } : user,
        ),
      );
      setEditingUser(null);
    } catch (error) {
      console.error(error);
      alert("User could not be updated.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07101f] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-sky-300/80">
              Management
            </p>
            <h1 className="mt-2 text-2xl font-semibold">Users</h1>
          </div>
          <Link
            href="/dashboard/adminDashboard"
            className="inline-flex items-center justify-center rounded-md border border-white/10 bg-[#0f1d33] px-3 py-2 text-xs font-medium text-slate-200 transition hover:bg-[#162844]"
          >
            Back to dashboard
          </Link>
        </div>

        <div className="rounded-xl border border-white/8 bg-[#0c1a2d] p-4 shadow-[0_18px_40px_rgba(2,6,23,0.35)]">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#101f36] px-3 py-2 text-sm text-slate-300">
              <UserRound size={15} className="text-sky-300" />
              <span>Total Users</span>
              <span className="rounded bg-sky-500/15 px-2 py-0.5 text-xs font-semibold text-sky-300">
                {users.filter((user) => user?.role !== "admin").length}
              </span>
            </div>

            <div className="relative w-full max-w-md">
              <Search
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by name or email"
                className="w-full rounded-md border border-white/10 bg-[#111f35] py-2.5 pl-9 pr-3 text-xs text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none"
              />
            </div>
          </div>

          {loading ? (
            <div className="rounded border border-white/8 bg-[#0d1b2b] p-6 text-sm text-slate-400">
              Loading users...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="rounded border border-dashed border-white/10 bg-[#0d1b2b] p-8 text-center text-sm text-slate-400">
              No users match your search.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-[11px] uppercase tracking-[0.12em] text-slate-400">
                    <th className="pb-3 pr-4 font-medium">Name</th>
                    <th className="pb-3 pr-4 font-medium">Email</th>
                    <th className="pb-3 pr-4 font-medium">Subscription</th>
                    <th className="pb-3 pr-4 font-medium">Plan</th>
                    <th className="pb-3 pr-4 font-medium">Status</th>
                    <th className="pb-3 pr-4 font-medium">Joined</th>
                    <th className="pb-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-white/5 text-[12px] text-slate-200 last:border-b-0"
                    >
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/15 text-[10px] font-semibold text-sky-300">
                            {(user?.username || "U").charAt(0).toUpperCase()}
                          </span>
                          <span>{user?.username || "Unknown"}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-slate-300">
                        {user?.email || "-"}
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`rounded-full px-2 py-1 text-[10px] font-medium ${
                            user?.subscriptionStatus === "active"
                              ? "bg-emerald-500/15 text-emerald-300"
                              : user?.subscriptionStatus === "pending"
                                ? "bg-amber-500/15 text-amber-300"
                                : "bg-slate-500/15 text-slate-300"
                          }`}
                        >
                          {user?.subscriptionStatus || "no subscription"}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-slate-300">
                        {user?.planName || "No plan"}
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`rounded-full px-2 py-1 text-[10px] font-medium ${
                            user?.status === "active"
                              ? "bg-emerald-500/15 text-emerald-300"
                              : "bg-amber-500/15 text-amber-300"
                          }`}
                        >
                          {user?.status || "active"}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-slate-400">
                        {user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )
                          : "-"}
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditOpen(user)}
                            className="inline-flex items-center gap-1 rounded border border-sky-400/30 bg-sky-500/10 px-2 py-1.5 text-[10px] font-medium text-sky-300 transition hover:bg-sky-500/20"
                          >
                            <Pencil size={11} />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(user._id)}
                            className="inline-flex items-center gap-1 rounded border border-rose-400/30 bg-rose-500/10 px-2 py-1.5 text-[10px] font-medium text-rose-300 transition hover:bg-rose-500/20"
                          >
                            <Trash2 size={11} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#0d1a2d] p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Edit user</h2>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="text-sm text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-[11px] text-slate-400">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      username: event.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-white/10 bg-[#101f36] px-3 py-2 text-sm text-white outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] text-slate-400">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-white/10 bg-[#101f36] px-3 py-2 text-sm text-white outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] text-slate-400">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      status: event.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-white/10 bg-[#101f36] px-3 py-2 text-sm text-white outline-none focus:border-sky-400"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="rounded-md border border-white/10 px-3 py-2 text-sm text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSaveUser}
                  className="rounded-md bg-sky-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
