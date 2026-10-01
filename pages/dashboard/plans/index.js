import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Pencil, Search, Trash2, Wallet } from "lucide-react";

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

const PlansPage = () => {
  const router = useRouter();
  const session = useSelector((state) => state.auth.userAndToken);
  const storedToken = getTokenFromSession(session);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration: "",
    durationUnit: "month",
    features: "",
  });
  const [saving, setSaving] = useState(false);

  const loadPlans = useCallback(async () => {
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

      const response = await fetch("/api/plans");
      if (!response.ok) {
        throw new Error("Failed to load plans");
      }

      const data = await response.json();
      setPlans(Array.isArray(data) ? data : []);
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

    loadPlans();
  }, [storedToken, router, loadPlans]);

  const filteredPlans = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return [...plans].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
    }

    return [...plans]
      .filter((plan) => {
        const name = (plan?.name || "").toLowerCase();
        const features = (plan?.features || []).join(" ").toLowerCase();

        return name.includes(term) || features.includes(term);
      })
      .sort((a, b) => {
        const aName = (a?.name || "").toLowerCase();
        const bName = (b?.name || "").toLowerCase();

        if (aName.startsWith(term) !== bName.startsWith(term)) {
          return aName.startsWith(term) ? -1 : 1;
        }

        return aName.localeCompare(bName);
      });
  }, [plans, searchTerm]);

  const handleDelete = async (planId) => {
    if (!planId) return;

    const confirmed = window.confirm("Delete this plan?");
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/plans/${planId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result?.error || "Failed to delete plan");
      }

      setPlans((current) => current.filter((plan) => plan._id !== planId));
    } catch (error) {
      console.error(error);
      alert(error.message || "Plan could not be deleted.");
    }
  };

  const handleEditOpen = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan?.name || "",
      price: plan?.price || "",
      duration: plan?.duration || "",
      durationUnit: plan?.durationUnit || "month",
      features: (plan?.features || []).join("\n"),
    });
  };

  const handleSavePlan = async () => {
    if (!editingPlan) return;

    setSaving(true);

    try {
      const response = await fetch(`/api/plans/${editingPlan._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          duration: Number(formData.duration),
          features: formData.features
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean),
        }),
      });

      if (!response.ok) {
        throw new Error("Update failed");
      }

      const updated = await response.json();
      const incomingPlan = updated?.updatedPlan || updated;

      setPlans((current) =>
        current.map((plan) =>
          plan._id === editingPlan._id ? { ...plan, ...incomingPlan } : plan,
        ),
      );
      setEditingPlan(null);
    } catch (error) {
      console.error(error);
      alert("Plan could not be updated.");
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
            <h1 className="mt-2 text-2xl font-semibold">Plans</h1>
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
              <Wallet size={15} className="text-sky-300" />
              <span>Total Plans</span>
              <span className="rounded bg-sky-500/15 px-2 py-0.5 text-xs font-semibold text-sky-300">
                {plans.length}
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
                placeholder="Search by plan name or feature"
                className="w-full rounded-md border border-white/10 bg-[#111f35] py-2.5 pl-9 pr-3 text-xs text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none"
              />
            </div>
          </div>

          {loading ? (
            <div className="rounded border border-white/8 bg-[#0d1b2b] p-6 text-sm text-slate-400">
              Loading plans...
            </div>
          ) : filteredPlans.length === 0 ? (
            <div className="rounded border border-dashed border-white/10 bg-[#0d1b2b] p-8 text-center text-sm text-slate-400">
              No plans match your search.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-[11px] uppercase tracking-[0.12em] text-slate-400">
                    <th className="pb-3 pr-4 font-medium">Plan</th>
                    <th className="pb-3 pr-4 font-medium">Price</th>
                    <th className="pb-3 pr-4 font-medium">Duration</th>
                    <th className="pb-3 pr-4 font-medium">Features</th>
                    <th className="pb-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlans.map((plan) => (
                    <tr
                      key={plan._id}
                      className="border-b border-white/5 text-[12px] text-slate-200 last:border-b-0"
                    >
                      <td className="py-3 pr-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-white">
                            {plan?.name || "Unknown"}
                          </span>
                          <span className="text-slate-400">
                            {plan?.durationUnit || "month"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-slate-300">
                        {formatCurrency(plan?.price || 0)}
                      </td>
                      <td className="py-3 pr-4 text-slate-300">
                        {plan?.duration || 0} {plan?.durationUnit || "month"}
                      </td>
                      <td className="py-3 pr-4 text-slate-300">
                        <div className="flex max-w-md flex-wrap gap-1">
                          {(plan?.features || [])
                            .slice(0, 3)
                            .map((feature, index) => (
                              <span
                                key={`${plan._id}-${feature}-${index}`}
                                className="rounded-full border border-sky-400/20 bg-sky-500/10 px-2 py-1 text-[10px] text-sky-200"
                              >
                                {feature}
                              </span>
                            ))}
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditOpen(plan)}
                            className="inline-flex items-center gap-1 rounded border border-sky-400/30 bg-sky-500/10 px-2 py-1.5 text-[10px] font-medium text-sky-300 transition hover:bg-sky-500/20"
                          >
                            <Pencil size={11} />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(plan._id)}
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

      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
          <div className="w-full max-w-lg rounded-xl border border-white/10 bg-[#0d1a2d] p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Edit plan</h2>
              <button
                type="button"
                onClick={() => setEditingPlan(null)}
                className="text-sm text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.12em] text-slate-400">
                  Plan name
                </label>
                <input
                  value={formData.name}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-white/10 bg-[#111f35] px-3 py-2 text-sm text-white outline-none focus:border-sky-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs uppercase tracking-[0.12em] text-slate-400">
                    Price
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        price: event.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-white/10 bg-[#111f35] px-3 py-2 text-sm text-white outline-none focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs uppercase tracking-[0.12em] text-slate-400">
                    Duration
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        duration: event.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-white/10 bg-[#111f35] px-3 py-2 text-sm text-white outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.12em] text-slate-400">
                  Duration unit
                </label>
                <select
                  value={formData.durationUnit}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      durationUnit: event.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-white/10 bg-[#111f35] px-3 py-2 text-sm text-white outline-none focus:border-sky-400"
                >
                  <option value="day">Day</option>
                  <option value="month">Month</option>
                  <option value="year">Year</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.12em] text-slate-400">
                  Features (one per line)
                </label>
                <textarea
                  rows={5}
                  value={formData.features}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      features: event.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-white/10 bg-[#111f35] px-3 py-2 text-sm text-white outline-none focus:border-sky-400"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  className="rounded-md border border-white/10 bg-[#101f36] px-4 py-2 text-sm text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePlan}
                  disabled={saving}
                  className="rounded-md bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-400 disabled:opacity-60"
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

export default PlansPage;
