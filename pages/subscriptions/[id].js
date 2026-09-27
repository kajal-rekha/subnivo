"use client";

import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import DashboardLayout from "@/components/DashboardLayout";
import {
  ArrowRight,
  CalendarDays,
  Check,
  CreditCard,
  Crown,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const SubscriptionDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const session = useSelector((state) => state.auth.userAndToken);

  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!session || !id) return;

    const fetchSubscription = async () => {
      try {
        const res = await fetch(`/api/subscriptions/${id}`, {
          headers: {
            Authorization: `Bearer ${session.token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const err = await res.json();
          setError(err.error || "Failed to fetch subscription");
        } else {
          const data = await res.json();
          setSubscription(data);
        }
      } catch (err) {
        setError("Server error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [session, id]);

  if (loading)
    return (
      <DashboardLayout activeItem="subscription" subscriptionId={id}>
        <div className="py-10">
          <Loading />
        </div>
      </DashboardLayout>
    );
  if (error)
    return (
      <DashboardLayout activeItem="subscription" subscriptionId={id}>
        <div className="py-10 text-red">
          <Error />
        </div>
      </DashboardLayout>
    );
  if (!subscription)
    return (
      <DashboardLayout activeItem="subscription" subscriptionId={id}>
        <p className="py-10">No subscription found</p>
      </DashboardLayout>
    );

  const plan = subscription.plan_id || {};
  const startDate = subscription.startDate
    ? new Date(subscription.startDate)
    : null;
  const endDate = subscription.endDate ? new Date(subscription.endDate) : null;
  const isActive = subscription.status?.toLowerCase() === "active";
  const daysRemaining = endDate
    ? Math.max(0, Math.ceil((endDate.getTime() - Date.now()) / 86400000))
    : null;
  const dateFormatter = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const formatDate = (date) =>
    date ? dateFormatter.format(date) : "Not available";
  const duration =
    `${plan.duration || "-"} ${plan.durationUnit || ""}${plan.duration === 1 ? "" : "s"}`.trim();
  const elapsedRatio =
    startDate && endDate && endDate > startDate
      ? Math.min(
          100,
          Math.max(
            0,
            ((Date.now() - startDate.getTime()) /
              (endDate.getTime() - startDate.getTime())) *
              100,
          ),
        )
      : 0;

  return (
    <DashboardLayout
      activeItem="subscription"
      subscriptionId={subscription._id}
    >
      <div className="mx-auto max-w-5xl py-4 text-white">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              My Subscription
            </h1>
            <p className="mt-2 text-sm text-slate-400 sm:text-base">
              Manage your current subscription and plan details.
            </p>
          </div>
          <span
            className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${isActive ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-300" : "border-amber-200/20 bg-amber-200/10 text-amber-200"}`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-300" : "bg-amber-200"}`}
            />
            {subscription.status || "Unknown"}
          </span>
        </div>

        <section className="overflow-hidden rounded-xl border border-white/10 bg-[#111d31] shadow-[0_24px_70px_rgba(0,0,0,0.24)]">
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-lg border border-amber-200/20 bg-amber-200/10 text-amber-200">
                  <Crown size={22} strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                    Your plan
                  </p>
                  <h2 className="mt-1 text-xl font-semibold uppercase tracking-wide">
                    {plan.name || "Subscription"}
                  </h2>
                </div>
              </div>
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${isActive ? "bg-emerald-300/10 text-emerald-300" : "bg-white/8 text-slate-300"}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-300" : "bg-slate-400"}`}
                />
                {subscription.status || "Unknown"}
              </span>
            </div>

            <p className="mt-7 text-3xl font-semibold tracking-tight">
              {plan.price ?? "-"}
              <span className="ml-2 text-base font-medium text-slate-400">
                BDT <span className="text-slate-600">/</span>{" "}
                {plan.durationUnit || "period"}
              </span>
            </p>
            <p className="mt-2 text-sm text-slate-400">
              {isActive
                ? "Your subscription is currently active."
                : `Your subscription is ${subscription.status || "not active"}.`}
            </p>

            <div className="mt-8 grid gap-5 border-t border-white/10 pt-6 sm:grid-cols-3">
              <div>
                <p className="text-xs text-slate-500">Started</p>
                <p className="mt-1 text-sm font-medium text-slate-200">
                  {formatDate(startDate)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Ends</p>
                <p className="mt-1 text-sm font-medium text-slate-200">
                  {formatDate(endDate)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Days remaining</p>
                <p className="mt-1 text-sm font-medium text-slate-200">
                  {daysRemaining === null
                    ? "-"
                    : `${daysRemaining} ${daysRemaining === 1 ? "day" : "days"}`}
                </p>
              </div>
            </div>

            <div className="mt-7 flex justify-start sm:justify-end">
              <Link
                href="/plans"
                className="group inline-flex items-center gap-2 rounded-md bg-[#bde7d5] px-4 py-2.5 text-sm font-semibold text-[#13271f] transition-colors hover:bg-[#d2f3e4]"
              >
                View Plans{" "}
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <section>
            <h2 className="mb-3 text-base font-semibold">Plan Benefits</h2>
            <div className="min-h-44 rounded-xl border border-white/10 bg-[#111d31] p-5 sm:p-6">
              {plan.features?.length ? (
                <ul className="space-y-4">
                  {plan.features.map((feature, index) => (
                    <li
                      key={`${feature}-${index}`}
                      className="flex items-start gap-3 text-sm text-slate-300"
                    >
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-300/10 text-emerald-300">
                        <Check size={13} strokeWidth={2.5} />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-400">
                  No plan benefits available.
                </p>
              )}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold">Subscription Info</h2>
            <div className="rounded-xl border border-white/10 bg-[#111d31] p-5 sm:p-6">
              <div className="space-y-5">
                <div className="flex gap-3">
                  <CreditCard
                    size={17}
                    className="mt-0.5 shrink-0 text-[#bde7d5]"
                  />
                  <div>
                    <p className="text-xs text-slate-500">Plan</p>
                    <p className="mt-1 text-sm font-medium">
                      {plan.name || "Not available"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CreditCard
                    size={17}
                    className="mt-0.5 shrink-0 text-[#bde7d5]"
                  />
                  <div>
                    <p className="text-xs text-slate-500">Price</p>
                    <p className="mt-1 text-sm font-medium">
                      {plan.price ?? "-"} BDT / {plan.durationUnit || "period"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CalendarDays
                    size={17}
                    className="mt-0.5 shrink-0 text-[#bde7d5]"
                  />
                  <div>
                    <p className="text-xs text-slate-500">Duration</p>
                    <p className="mt-1 text-sm font-medium">{duration}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-8">
          <h2 className="mb-3 text-base font-semibold">
            Subscription Timeline
          </h2>
          <div className="rounded-xl border border-white/10 bg-[#111d31] p-5 sm:p-6">
            <div className="relative px-1 py-2">
              <div className="h-2px bg-white/10" />
              <div
                className="absolute left-0 top-2 h-px bg-[#bde7d5] transition-[width]"
                style={{ width: `${elapsedRatio}%` }}
              />
              <span className="absolute left-0 top-0 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-[#bde7d5] bg-[#111d31]" />
              <span className="absolute right-0 top-0 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-white/30 bg-[#111d31]" />
            </div>
            <div className="mt-4 flex justify-between gap-4">
              <div>
                <p className="text-xs text-slate-500">Started</p>
                <p className="mt-1 text-sm font-medium text-slate-200">
                  {formatDate(startDate)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Ends</p>
                <p className="mt-1 text-sm font-medium text-slate-200">
                  {formatDate(endDate)}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionDetailsPage;
