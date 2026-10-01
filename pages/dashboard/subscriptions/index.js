import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Package, Search, Trash2 } from "lucide-react";

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

const formatCurrency = (amount) =>
  Number(amount || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(value))
    : "-";

const SubscriptionsPage = () => {
  const router = useRouter();
  const session = useSelector((state) => state.auth.userAndToken);
  const storedToken = getTokenFromSession(session);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadSubscriptions = useCallback(async () => {
    if (!storedToken) {
      router.replace("/auth/sign-in");
      return;
    }

    try {
      const meResponse = await fetch("/api/users/me", {
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      if (meResponse.ok) {
        const userData = await meResponse.json();
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

      const response = await fetch("/api/subscriptions", {
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      if (!response.ok) {
        throw new Error("Failed to load subscriptions");
      }

      const data = await response.json();
      setSubscriptions(Array.isArray(data) ? data : []);
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

    loadSubscriptions();
  }, [storedToken, router, loadSubscriptions]);

  const activeSubscriptions = useMemo(
    () =>
      subscriptions.filter(
        (subscription) =>
          subscription?.status === "active" &&
          Boolean(subscription?.plan_id?.name),
      ),
    [subscriptions],
  );

  const filteredSubscriptions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return [...activeSubscriptions].sort(
        (a, b) =>
          new Date(b.createdAt || b.startDate) -
          new Date(a.createdAt || a.startDate),
      );
    }

    return [...activeSubscriptions]
      .filter((item) => {
        const userName = (item?.user_id?.username || "").toLowerCase();
        const email = (item?.user_id?.email || "").toLowerCase();
        const planName = (item?.plan_id?.name || "").toLowerCase();

        return (
          userName.includes(term) ||
          email.includes(term) ||
          planName.includes(term)
        );
      })
      .sort((a, b) => {
        const aUser = (a?.user_id?.username || "").toLowerCase();
        const bUser = (b?.user_id?.username || "").toLowerCase();
        const aPlan = (a?.plan_id?.name || "").toLowerCase();
        const bPlan = (b?.plan_id?.name || "").toLowerCase();

        if (aUser.startsWith(term) !== bUser.startsWith(term)) {
          return aUser.startsWith(term) ? -1 : 1;
        }

        if (aPlan.startsWith(term) !== bPlan.startsWith(term)) {
          return aPlan.startsWith(term) ? -1 : 1;
        }

        return aUser.localeCompare(bUser) || aPlan.localeCompare(bPlan);
      });
  }, [activeSubscriptions, searchTerm]);

  const handleCancel = async (subscriptionId) => {
    if (!subscriptionId) return;

    const confirmed = window.confirm("Cancel this subscription?");
    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/subscriptions/${subscriptionId}?action=cancel`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${storedToken}` },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to cancel subscription");
      }

      setSubscriptions((current) =>
        current.map((subscription) =>
          subscription._id === subscriptionId
            ? { ...subscription, status: "canceled" }
            : subscription,
        ),
      );
    } catch (error) {
      console.error(error);
      alert("Subscription could not be canceled.");
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
            <h1 className="mt-2 text-2xl font-semibold">Subscriptions</h1>
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
              <Package size={15} className="text-sky-300" />
              <span>Active Subscriptions</span>
              <span className="rounded bg-sky-500/15 px-2 py-0.5 text-xs font-semibold text-sky-300">
                {activeSubscriptions.length}
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
                placeholder="Search by user or plan"
                className="w-full rounded-md border border-white/10 bg-[#111f35] py-2.5 pl-9 pr-3 text-xs text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none"
              />
            </div>
          </div>

          {loading ? (
            <div className="rounded border border-white/8 bg-[#0d1b2b] p-6 text-sm text-slate-400">
              Loading subscriptions...
            </div>
          ) : filteredSubscriptions.length === 0 ? (
            <div className="rounded border border-dashed border-white/10 bg-[#0d1b2b] p-8 text-center text-sm text-slate-400">
              No subscriptions match your search.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-[11px] uppercase tracking-[0.12em] text-slate-400">
                    <th className="pb-3 pr-4 font-medium">User</th>
                    <th className="pb-3 pr-4 font-medium">Plan</th>
                    <th className="pb-3 pr-4 font-medium">Status</th>
                    <th className="pb-3 pr-4 font-medium">Amount</th>
                    <th className="pb-3 pr-4 font-medium">Start</th>
                    <th className="pb-3 pr-4 font-medium">End</th>
                    <th className="pb-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscriptions.map((subscription) => {
                    const hasPlan = Boolean(subscription?.plan_id?.name);
                    const displayStatus = hasPlan
                      ? subscription?.status || "pending"
                      : "no plan";

                    return (
                      <tr
                        key={subscription._id}
                        className="border-b border-white/5 text-[12px] text-slate-200 last:border-b-0"
                      >
                        <td className="py-3 pr-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-white">
                              {subscription?.user_id?.username || "Unknown"}
                            </span>
                            <span className="text-slate-400">
                              {subscription?.user_id?.email || "-"}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-slate-300">
                          {subscription?.plan_id?.name || "No plan"}
                        </td>
                        <td className="py-3 pr-4">
                          <span
                            className={`rounded-full px-2 py-1 text-[10px] font-medium ${
                              displayStatus === "active"
                                ? "bg-emerald-500/15 text-emerald-300"
                                : displayStatus === "pending"
                                  ? "bg-amber-500/15 text-amber-300"
                                  : displayStatus === "canceled"
                                    ? "bg-rose-500/15 text-rose-300"
                                    : "bg-slate-500/15 text-slate-300"
                            }`}
                          >
                            {displayStatus}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-slate-300">
                          {formatCurrency(
                            subscription?.amount ??
                              subscription?.plan_id?.price ??
                              0,
                          )}
                        </td>
                        <td className="py-3 pr-4 text-slate-400">
                          {formatDate(subscription?.startDate)}
                        </td>
                        <td className="py-3 pr-4 text-slate-400">
                          {formatDate(subscription?.endDate)}
                        </td>
                        <td className="py-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleCancel(subscription._id)}
                            className="inline-flex items-center gap-1 rounded border border-rose-400/30 bg-rose-500/10 px-2 py-1.5 text-[10px] font-medium text-rose-300 transition hover:bg-rose-500/20"
                          >
                            <Trash2 size={11} />
                            Cancel
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsPage;
