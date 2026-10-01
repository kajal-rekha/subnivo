import { CalendarDays, CheckCircle2, Package } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }).format(new Date(value))
    : "-";

const formatAmount = (amount) =>
  typeof amount === "number"
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
    : "-";

const UserDashboard = () => {
  const session = useSelector((state) => state.auth.userAndToken);
  const [subscription, setSubscription] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const username = session?.user?.username || "User";
  const plan = subscription?.plan_id;
  const daysRemaining = subscription?.endDate
    ? Math.max(
        0,
        Math.ceil((new Date(subscription.endDate) - new Date()) / 86400000),
      )
    : null;

  useEffect(() => {
    const loadDashboard = async () => {
      if (!session?.token) {
        setIsLoading(false);
        return;
      }

      try {
        const headers = { Authorization: `Bearer ${session.token}` };
        const [subscriptionResponse, transactionsResponse] = await Promise.all([
          fetch("/api/subscriptions/me", { headers }),
          fetch("/api/transactions", { headers }),
        ]);
        const subscriptionData = await subscriptionResponse.json();
        const transactionsData = await transactionsResponse.json();

        if (!subscriptionResponse.ok && subscriptionResponse.status !== 404) {
          throw new Error(
            subscriptionData.error || "Unable to load subscription",
          );
        }
        if (!transactionsResponse.ok) {
          throw new Error(
            transactionsData.message || "Unable to load payments",
          );
        }

        setSubscription(
          subscriptionResponse.status === 404 ? null : subscriptionData,
        );
        setTransactions(
          Array.isArray(transactionsData) ? transactionsData : [],
        );
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, [session?.token]);

  return (
    <DashboardLayout subscriptionId={subscription?._id} activeItem="dashboard">
      {isLoading && (
        <p className="py-10 text-center text-sm text-slate-400">
          Loading your dashboard...
        </p>
      )}
      {error && (
        <p className="mt-5 rounded border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-200">
          {error}
        </p>
      )}

      {!isLoading && !error && (
        <>
          <section className="mt-4 grid gap-3 xl:grid-cols-[1.6fr_1fr]">
            <div className="rounded-md border border-white/8 bg-[#0d2139] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-300">
                    <Package size={14} />
                  </span>
                  <div>
                    <p className="text-[11px] text-slate-400">
                      Current Subscription{" "}
                      <span className="ml-1 rounded-full bg-emerald-400/15 px-1.5 py-0.5 text-[10px] text-emerald-300">
                        {subscription?.status || "Inactive"}
                      </span>
                    </p>
                    <h2 className="mt-1 text-lg font-semibold">
                      {plan?.name || "No active subscription"}
                    </h2>
                    <p className="text-xs text-slate-400">
                      {plan
                        ? `${formatAmount(plan.price)} / ${plan.durationUnit}`
                        : "Choose a plan to get started"}
                    </p>
                  </div>
                </div>
                {subscription ? (
                  <Link
                    href={`/subscriptions/${subscription._id}`}
                    className="rounded bg-blue-600 px-3 py-2 text-[11px] font-medium hover:bg-blue-500"
                  >
                    Manage Subscription
                  </Link>
                ) : (
                  <Link
                    href="/plans"
                    className="rounded bg-blue-600 px-3 py-2 text-[11px] font-medium hover:bg-blue-500"
                  >
                    Get Subscription
                  </Link>
                )}
              </div>
              {subscription && (
                <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/8 pt-3 text-[11px] sm:grid-cols-4">
                  <div>
                    <p className="text-slate-500">Started</p>
                    <p className="mt-1">{formatDate(subscription.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Ends</p>
                    <p className="mt-1">{formatDate(subscription.endDate)}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Days left</p>
                    <p className="mt-1">{daysRemaining ?? "-"}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Auto renew</p>
                    <p className="mt-1">
                      {subscription.autoRenew ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="relative overflow-hidden rounded-md border border-blue-400/20 bg-linear-to-br from-blue-700/60 to-indigo-900/70 p-4">
              <p className="text-xs font-semibold">
                Your subscription
                <br />
                is {subscription?.status || "inactive"}
              </p>
              <p className="mt-2 max-w-[180px] text-[11px] leading-5 text-blue-100/70">
                {plan
                  ? `${plan.name} plan is currently active for your account.`
                  : "Explore plans and choose the right one for you."}
              </p>
              <Package
                className="absolute bottom-3 right-5 text-blue-300/50"
                size={42}
              />
            </div>
          </section>

          <section className="mt-3 grid gap-3 xl:grid-cols-[1.15fr_1fr_0.82fr]">
            <div
              id="recent-payments"
              className="rounded-md border border-white/8 bg-[#0d2139] p-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-[13px] font-semibold">Recent Payments</h2>
                <Link href="/plans" className="text-[11px] text-blue-300">
                  View all
                </Link>
              </div>
              {transactions.length === 0 ? (
                <p className="mt-6 text-[11px] text-slate-400">
                  No payment history available.
                </p>
              ) : (
                <div className="mt-3 space-y-2">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div
                      key={transaction._id}
                      className="grid grid-cols-[1fr_0.7fr_0.6fr_0.5fr] items-center border-t border-white/6 pt-2 text-[10px]"
                    >
                      <span className="truncate">
                        {transaction.tran_id || transaction._id}
                      </span>
                      <span className="text-slate-500">
                        {formatDate(transaction.date || transaction.createdAt)}
                      </span>
                      <span>{formatAmount(transaction.amount)}</span>
                      <span className="text-emerald-300">
                        {transaction.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="rounded-md border border-white/8 bg-[#0d2139] p-4">
              <h2 className="text-[13px] font-semibold">Plan Features</h2>
              {plan?.features?.length ? (
                <div className="mt-3 space-y-2">
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2 text-[11px] text-slate-300"
                    >
                      <CheckCircle2 size={12} className="text-blue-400" />
                      {feature}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-6 text-[11px] text-slate-400">
                  No plan features available.
                </p>
              )}
            </div>
            <div className="rounded-md border border-white/8 bg-[#0d2139] p-4">
              <h2 className="text-[13px] font-semibold">Usage Overview</h2>
              {subscription ? (
                <div className="mt-4 space-y-3 text-[11px]">
                  <div className="flex items-center gap-2">
                    <CalendarDays size={13} className="text-blue-400" />
                    <span className="text-slate-400">Subscription period</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{
                        width: `${daysRemaining === null ? 0 : Math.min(100, Math.max(0, (daysRemaining / Math.max(1, plan?.duration || daysRemaining)) * 100))}%`,
                      }}
                    />
                  </div>
                  <p className="text-slate-500">
                    {daysRemaining ?? "-"} days remaining
                  </p>
                </div>
              ) : (
                <p className="mt-6 text-[11px] text-slate-400">
                  Usage will appear after subscribing.
                </p>
              )}
            </div>
          </section>
        </>
      )}
    </DashboardLayout>
  );
};

export default UserDashboard;
