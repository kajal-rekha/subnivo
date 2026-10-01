import {
  BadgeCheck,
  Bell,
  CalendarDays,
  CreditCard,
  LayoutGrid,
  LifeBuoy,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutGrid, active: true },
  { label: "Subscriptions", icon: CreditCard },
  { label: "Payments", icon: Wallet },
  { label: "Support", icon: LifeBuoy },
];

const plans = [
  { name: "Basic", price: "$9" },
  { name: "Pro", price: "$19" },
  { name: "Premium", price: "$29", current: true },
];

const recentPayments = [
  { date: "Sep 04, 2026", plan: "Premium", amount: "$29" },
  { date: "Aug 04, 2026", plan: "Pro", amount: "$19" },
];

const DashboardPreview = () => (
  <div className="relative mx-auto w-full max-w-[650px]">
    <div className="pointer-events-none absolute -left-10 top-14 h-40 w-40 rounded-full bg-blue/10 blur-[70px]" />
    <div className="pointer-events-none absolute -right-10 bottom-10 h-44 w-44 rounded-full bg-indigo-500/10 blur-[80px]" />

    <div className="absolute -right-2 top-8 z-20 hidden rounded-2xl border border-emerald-400/20 bg-[#101c35]/95 px-4 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-md sm:block lg:-right-8">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400/10">
          <BadgeCheck className="h-4 w-4 text-emerald-400" />
        </div>
        <div>
          <p className="text-xs font-semibold text-white">Payment Successful</p>
          <p className="mt-0.5 text-[10px] text-slate-400">
            Premium plan activated
          </p>
        </div>
      </div>
    </div>

    <div className="relative rounded-[28px] border border-[#263a61] bg-[linear-gradient(145deg,#101a31,#080f1e)] p-2 shadow-[0_35px_100px_rgba(0,0,0,0.55)] sm:p-3">
      <div className="mb-3 flex items-center justify-between rounded-[20px] border border-[#24375b] bg-[#101d36] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue text-dark shadow-[0_0_20px_rgba(125,153,255,0.18)]">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-blue">
              SUBNIVO
            </p>
            <p className="mt-0.5 text-[11px] text-slate-300">
              Good morning! 👋
            </p>
          </div>
        </div>
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#283b60] bg-[#0c1730] text-slate-300">
          <Bell className="h-3.5 w-3.5" />
        </span>
      </div>

      <div className="grid gap-3 lg:grid-cols-[165px_1fr]">
        <aside className="rounded-[20px] border border-[#24375b] bg-[#0e1a32] p-2.5">
          <div className="mb-4 px-2 py-1">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Workspace
            </p>
          </div>
          <nav className="space-y-1.5">
            {navItems.map(({ label, icon: Icon, active }) => (
              <div
                key={label}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs ${
                  active
                    ? "bg-blue/10 text-blue shadow-[inset_0_0_0_1px_rgba(125,153,255,0.1)]"
                    : "text-slate-400"
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span>{label}</span>
              </div>
            ))}
          </nav>
          <div className="mt-8 rounded-xl border border-[#203252] bg-[#0a152a] p-3">
            <p className="text-[9px] text-slate-500">Need help?</p>
            <p className="mt-1 text-[10px] font-medium text-slate-300">
              Contact support
            </p>
          </div>
        </aside>

        <main className="space-y-3">
          <div className="rounded-[20px] border border-[#24375b] bg-[#101d36] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-blue/10 px-2.5 py-1 text-[9px] font-semibold text-blue">
                    Premium
                  </span>
                  <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[9px] font-semibold text-emerald-400">
                    Active
                  </span>
                </div>
                <p className="mt-3 text-[9px] font-medium uppercase tracking-[0.18em] text-slate-500">
                  Current Plan
                </p>
                <div className="mt-1 flex items-end gap-2">
                  <span className="text-2xl font-bold text-white">$29</span>
                  <span className="pb-1 text-[10px] text-slate-500">
                    / month
                  </span>
                </div>
              </div>
              <span className="rounded-lg border border-[#2b4168] bg-[#12203c] px-3 py-2 text-[9px] font-medium text-slate-200">
                Manage
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-[#0b162c] p-3">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <CalendarDays className="h-3 w-3" />
                  <span className="text-[9px]">Next billing</span>
                </div>
                <p className="mt-1 text-[10px] font-semibold text-white">
                  Oct 04, 2026
                </p>
              </div>
              <div className="rounded-xl bg-[#0b162c] p-3">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <ShieldCheck className="h-3 w-3" />
                  <span className="text-[9px]">Status</span>
                </div>
                <p className="mt-1 text-[10px] font-semibold text-emerald-400">
                  Active
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[20px] border border-[#24375b] bg-[#101d36] p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">
                  Available Plans
                </p>
                <p className="mt-0.5 text-[9px] text-slate-500">
                  Upgrade or change your plan anytime
                </p>
              </div>
              <span className="text-[9px] font-medium text-blue">
                View all →
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-xl border p-3 text-center ${
                    plan.current
                      ? "border-blue/40 bg-blue/5"
                      : "border-[#24375b] bg-[#0b162c]"
                  }`}
                >
                  {plan.current && (
                    <span className="mb-1 block text-[7px] font-bold uppercase tracking-wider text-blue">
                      Current
                    </span>
                  )}
                  <p className="text-[9px] font-medium text-slate-400">
                    {plan.name}
                  </p>
                  <p className="mt-1 text-sm font-bold text-white">
                    {plan.price}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[20px] border border-[#24375b] bg-[#101d36] p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-white">
                Recent Payments
              </p>
              <span className="text-[9px] font-medium text-blue">
                View all →
              </span>
            </div>
            <div className="overflow-x-auto rounded-xl border border-[#203252]">
              <div className="grid min-w-[300px] grid-cols-[1.3fr_0.9fr_0.7fr_0.7fr] bg-[#0d1931] px-3 py-2.5 text-[8px] font-medium uppercase tracking-[0.12em] text-slate-500">
                <span>Date</span>
                <span>Plan</span>
                <span>Amount</span>
                <span>Status</span>
              </div>
              {recentPayments.map((payment) => (
                <div
                  key={payment.date}
                  className="grid min-w-[300px] grid-cols-[1.3fr_0.9fr_0.7fr_0.7fr] items-center border-t border-[#203252] bg-[#0a152a] px-3 py-2.5 text-[8px] text-slate-400"
                >
                  <span>{payment.date}</span>
                  <span className="text-slate-300">{payment.plan}</span>
                  <span className="font-medium text-white">
                    {payment.amount}
                  </span>
                  <span className="inline-flex w-fit rounded-full bg-emerald-400/10 px-1.5 py-1 font-medium text-emerald-400">
                    Paid
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>

    <div className="absolute -bottom-5 -left-4 z-20 hidden rounded-2xl border border-[#293d63] bg-[#101c35]/95 px-4 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-md sm:block lg:-left-8">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue/10">
          <CreditCard className="h-4 w-4 text-blue" />
        </div>
        <div>
          <p className="text-[10px] text-slate-400">Monthly spending</p>
          <p className="text-sm font-bold text-white">$78.00</p>
        </div>
      </div>
    </div>
  </div>
);

export default DashboardPreview;
