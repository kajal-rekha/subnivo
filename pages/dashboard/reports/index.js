import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Gauge, Search } from "lucide-react";

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

const ReportsPage = () => {
  const router = useRouter();
  const session = useSelector((state) => state.auth.userAndToken);
  const storedToken = getTokenFromSession(session);
  const [users, setUsers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadReports = useCallback(async () => {
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

      const [
        usersResponse,
        subscriptionsResponse,
        transactionsResponse,
        plansResponse,
      ] = await Promise.all([
        fetch("/api/users", {
          headers: { Authorization: `Bearer ${storedToken}` },
        }),
        fetch("/api/subscriptions", {
          headers: { Authorization: `Bearer ${storedToken}` },
        }),
        fetch("/api/transactions", {
          headers: { Authorization: `Bearer ${storedToken}` },
        }),
        fetch("/api/plans"),
      ]);

      if (
        !usersResponse.ok ||
        !subscriptionsResponse.ok ||
        !transactionsResponse.ok ||
        !plansResponse.ok
      ) {
        throw new Error("Failed to load reports");
      }

      const usersData = await usersResponse.json();
      const subscriptionsData = await subscriptionsResponse.json();
      const transactionsData = await transactionsResponse.json();
      const plansData = await plansResponse.json();

      setUsers(
        Array.isArray(usersData)
          ? usersData.filter((user) => user?.role !== "admin")
          : [],
      );
      setSubscriptions(
        Array.isArray(subscriptionsData) ? subscriptionsData : [],
      );
      setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
      setPlans(Array.isArray(plansData) ? plansData : []);
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

    loadReports();
  }, [storedToken, router, loadReports]);

  const overview = useMemo(() => {
    const customerCount = users.length;
    const subscriptionsWithPlans = subscriptions.filter((item) =>
      Boolean(item?.plan_id?.name),
    );
    const activeSubscriptions = subscriptionsWithPlans.filter(
      (item) => item?.status === "active",
    ).length;
    const totalRevenue = subscriptionsWithPlans.reduce((sum, item) => {
      const amount = Number(item?.amount ?? item?.plan_id?.price ?? 0);
      return sum + (Number.isFinite(amount) ? amount : 0);
    }, 0);
    const pendingPaymentCount = transactions.filter(
      (item) => item?.status === "pending",
    ).length;
    const avgPlanPrice = plans.length
      ? plans.reduce((sum, plan) => sum + Number(plan?.price || 0), 0) /
        plans.length
      : 0;

    return [
      { label: "Customers", value: customerCount },
      { label: "Active subs", value: activeSubscriptions },
      { label: "Revenue", value: formatCurrency(totalRevenue) },
      { label: "Pending payments", value: pendingPaymentCount },
      { label: "Avg. plan price", value: formatCurrency(avgPlanPrice) },
    ];
  }, [plans, subscriptions, transactions, users]);

  const planPerformance = useMemo(() => {
    return plans.map((plan) => {
      const planSubscriptions = subscriptions.filter(
        (item) =>
          Boolean(item?.plan_id?.name) &&
          String(item?.plan_id?._id || item?.plan_id) === String(plan?._id),
      );

      return {
        name: plan?.name || "Unknown",
        customers: planSubscriptions.filter((item) => item?.status === "active")
          .length,
        revenue: planSubscriptions.reduce((sum, item) => {
          const amount = Number(item?.amount ?? item?.plan_id?.price ?? 0);
          return sum + (Number.isFinite(amount) ? amount : 0);
        }, 0),
      };
    });
  }, [plans, subscriptions]);

  const filteredPlanPerformance = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return planPerformance;

    return planPerformance.filter((item) => {
      return item.name.toLowerCase().includes(term);
    });
  }, [planPerformance, searchTerm]);

  return (
    <div className="min-h-screen bg-[#07101f] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-sky-300/80">
              Analytics
            </p>
            <h1 className="mt-2 text-2xl font-semibold">Reports</h1>
          </div>
          <Link
            href="/dashboard/adminDashboard"
            className="inline-flex items-center justify-center rounded-md border border-white/10 bg-[#0f1d33] px-3 py-2 text-xs font-medium text-slate-200 transition hover:bg-[#162844]"
          >
            Back to dashboard
          </Link>
        </div>

        <div className="rounded-xl border border-white/8 bg-[#0c1a2d] p-4 shadow-[0_18px_40px_rgba(2,6,23,0.35)]">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#101f36] px-3 py-2 text-sm text-slate-300">
              <Gauge size={15} className="text-sky-300" />
              <span>Performance summary</span>
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
                placeholder="Search by plan name"
                className="w-full rounded-md border border-white/10 bg-[#111f35] py-2.5 pl-9 pr-3 text-xs text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none"
              />
            </div>
          </div>

          {loading ? (
            <div className="rounded border border-white/8 bg-[#0d1b2b] p-6 text-sm text-slate-400">
              Loading reports...
            </div>
          ) : (
            <>
              <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
                {overview.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-lg border border-white/10 bg-[#101f36] p-4"
                  >
                    <p className="text-[11px] uppercase tracking-[0.12em] text-slate-400">
                      {item.label}
                    </p>
                    <p className="mt-3 text-2xl font-semibold text-white">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-[11px] uppercase tracking-[0.12em] text-slate-400">
                      <th className="pb-3 pr-4 font-medium">Plan</th>
                      <th className="pb-3 pr-4 font-medium">Active subs</th>
                      <th className="pb-3 pr-4 font-medium">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlanPerformance.length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="py-4 text-center text-slate-400"
                        >
                          No report data found.
                        </td>
                      </tr>
                    ) : (
                      filteredPlanPerformance.map((item) => (
                        <tr
                          key={item.name}
                          className="border-b border-white/5 text-[12px] text-slate-200 last:border-b-0"
                        >
                          <td className="py-3 pr-4 font-medium text-white">
                            {item.name}
                          </td>
                          <td className="py-3 pr-4 text-slate-300">
                            {item.customers}
                          </td>
                          <td className="py-3 pr-4 text-slate-300">
                            {formatCurrency(item.revenue)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
