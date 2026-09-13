import Link from "next/link";
import {
  ArrowRight,
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
  {
    label: "Dashboard",
    icon: LayoutGrid,
    active: true,
  },
  {
    label: "Subscriptions",
    icon: CreditCard,
    active: false,
  },
  {
    label: "Payments",
    icon: Wallet,
    active: false,
  },
  {
    label: "Support",
    icon: LifeBuoy,
    active: false,
  },
];

const plans = [
  {
    name: "Basic",
    price: "$9",
  },
  {
    name: "Pro",
    price: "$19",
  },
  {
    name: "Premium",
    price: "$29",
  },
];

const recentPayments = [
  {
    date: "Sep 04, 2026",
    plan: "Premium",
    amount: "$29",
  },
  {
    date: "Aug 04, 2026",
    plan: "Pro",
    amount: "$19",
  },
];

const Hero = () => {
  return (
    <section className="relative overflow-hidden pb-16 pt-12 md:pb-20 md:pt-16 lg:pb-24 lg:pt-20">
      {/* ================= Background Glow ================= */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-180px] top-[-120px] h-[400px] w-[400px] rounded-full bg-blue/10 blur-[120px]" />

        <div className="absolute right-[-150px] top-[100px] h-[420px] w-[420px] rounded-full bg-indigo-500/10 blur-[130px]" />

        <div className="absolute bottom-[-200px] left-1/2 h-[350px] w-[500px] -translate-x-1/2 rounded-full bg-blue/5 blur-[120px]" />
      </div>

      <div className="wrapper relative">
        <div className="grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
          {/* ============== LEFT CONTENT ================= */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue/20 bg-blue/10 px-3.5 py-2 text-[11px] font-medium text-blue shadow-[0_0_25px_rgba(125,153,255,0.08)]">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue text-[9px] font-bold text-dark">
                ✓
              </span>

              <span>Simple • Secure • Flexible</span>
            </div>

            {/* ============ Heading ================*/}
            <h1 className="max-w-[560px] text-[2.8rem] font-black leading-[0.95] tracking-[-0.065em] text-white sm:text-5xl md:text-6xl lg:text-[4.3rem]">
              Manage Your
              <span className="block">Subscriptions</span>
              <span className="mt-1 block bg-linear-to-r from-blue via-[#9eafff] to-indigo-400 bg-clip-text text-transparent">
                With Ease
              </span>
            </h1>

            {/*============= Description ================*/}
            <p className="mt-6 max-w-[540px] text-base leading-7 text-slate-300 md:text-lg md:leading-8">
              Built for modern subscription businesses, our platform helps you
              choose the right plan, manage payments, and keep your
              subscriptions organized — all in one place.
            </p>

            {/*============= CTA ================*/}
            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                href="/plans"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue px-6 py-3.5 text-sm font-semibold text-dark shadow-[0_12px_30px_rgba(125,153,255,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#9aafff] hover:shadow-[0_16px_38px_rgba(125,153,255,0.38)]"
              >
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/plans"
                className="inline-flex items-center justify-center rounded-xl border border-[#2a3b60] bg-[#0d1730]/70 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-blue/50 hover:bg-[#111f3c]"
              >
                View Plans
              </Link>
            </div>

            {/*============= Trust ================*/}
            <div className="mt-9 flex items-center gap-4">
              {/*============= Avatars ================*/}
              <div className="flex -space-x-2">
                {["A", "M", "R", "S"].map((person, index) => (
                  <div
                    key={person}
                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#080f20] text-[10px] font-bold ${
                      index === 0
                        ? "bg-[#dce4ff] text-[#101a38]"
                        : index === 1
                          ? "bg-[#aebdff] text-[#101a38]"
                          : index === 2
                            ? "bg-[#8094ed] text-white"
                            : "bg-[#5269c8] text-white"
                    }`}
                  >
                    {person}
                  </div>
                ))}
              </div>

              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-blue" />

                  <span className="text-sm font-semibold text-white">
                    Trusted by 1000+ users
                  </span>
                </div>

                <p className="mt-0.5 text-xs text-slate-400">
                  Built for modern subscription businesses
                </p>
              </div>
            </div>
          </div>

          {/* ================ RIGHT DASHBOARD PREVIEW ================== */}
          <div className="relative mx-auto w-full max-w-[650px]">
            {/*============= Background decorative circles ================*/}
            <div className="pointer-events-none absolute -left-10 top-14 h-40 w-40 rounded-full bg-blue/10 blur-[70px]" />

            <div className="pointer-events-none absolute -right-10 bottom-10 h-44 w-44 rounded-full bg-indigo-500/10 blur-[80px]" />

            {/*============= Floating Payment Card ================*/}
            <div className="absolute -right-2 top-8 z-20 hidden rounded-2xl border border-emerald-400/20 bg-[#101c35]/95 px-4 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-md sm:block lg:-right-8">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400/10">
                  <BadgeCheck className="h-4 w-4 text-emerald-400" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-white">
                    Payment Successful
                  </p>

                  <p className="mt-0.5 text-[10px] text-slate-400">
                    Premium plan activated
                  </p>
                </div>
              </div>
            </div>

            {/*========== Main Dashboard ==============*/}
            <div className="relative rounded-[28px] border border-[#263a61] bg-[linear-gradient(145deg,#101a31,#080f1e)] p-2 shadow-[0_35px_100px_rgba(0,0,0,0.55)] sm:p-3">
              {/* Dashboard Header */}
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

                <button className="flex h-8 w-8 items-center justify-center rounded-full border border-[#283b60] bg-[#0c1730] text-slate-300 transition hover:text-white">
                  <Bell className="h-3.5 w-3.5" />
                </button>
              </div>

              {/*============= Dashboard Body ================*/}
              <div className="grid gap-3 lg:grid-cols-[165px_1fr]">
                {/* Sidebar */}
                <aside className="rounded-[20px] border border-[#24375b] bg-[#0e1a32] p-2.5">
                  <div className="mb-4 px-2 py-1">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Workspace
                    </p>
                  </div>

                  <nav className="space-y-1.5">
                    {navItems.map(({ label, icon: Icon, active }) => (
                      <button
                        key={label}
                        className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs transition ${
                          active
                            ? "bg-blue/10 text-blue shadow-[inset_0_0_0_1px_rgba(125,153,255,0.1)]"
                            : "text-slate-400 hover:bg-[#14233f] hover:text-slate-200"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5 shrink-0" />

                        <span>{label}</span>
                      </button>
                    ))}
                  </nav>

                  {/*============= Sidebar Bottom ================*/}
                  <div className="mt-8 rounded-xl border border-[#203252] bg-[#0a152a] p-3">
                    <p className="text-[9px] text-slate-500">Need help?</p>

                    <p className="mt-1 text-[10px] font-medium text-slate-300">
                      Contact support
                    </p>
                  </div>
                </aside>

                {/*========== Main Dashboard Content ==============*/}
                <main className="space-y-3">
                  {/* Current Subscription */}
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
                          <span className="text-2xl font-bold text-white">
                            $29
                          </span>

                          <span className="pb-1 text-[10px] text-slate-500">
                            / month
                          </span>
                        </div>
                      </div>

                      <button className="rounded-lg border border-[#2b4168] bg-[#12203c] px-3 py-2 text-[9px] font-medium text-slate-200 transition hover:border-blue/50">
                        Manage
                      </button>
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

                  {/*============= Plans ================*/}
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

                      <button className="text-[9px] font-medium text-blue">
                        View all →
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {plans.map((plan, index) => (
                        <div
                          key={plan.name}
                          className={`rounded-xl border p-3 text-center ${
                            index === 2
                              ? "border-blue/40 bg-blue/5"
                              : "border-[#24375b] bg-[#0b162c]"
                          }`}
                        >
                          {index === 2 && (
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

                  {/*============= Recent Payments ================*/}
                  <div className="rounded-[20px] border border-[#24375b] bg-[#101d36] p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-white">
                        Recent Payments
                      </p>

                      <button className="text-[9px] font-medium text-blue">
                        View all →
                      </button>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-[#203252]">
                      {/*============= Table Header ================*/}
                      <div className="grid grid-cols-[1.3fr_0.9fr_0.7fr_0.6fr] bg-[#0d1931] px-3 py-2.5 text-[8px] font-medium uppercase tracking-[0.12em] text-slate-500">
                        <span>Date</span>
                        <span>Plan</span>
                        <span>Amount</span>
                        <span>Status</span>
                      </div>

                      {/*============= Rows============ */}
                      {recentPayments.map(({ date, plan, amount }) => (
                        <div
                          key={date}
                          className="grid grid-cols-[1.3fr_0.9fr_0.7fr_0.6fr] items-center border-t border-[#203252] bg-[#0a152a] px-3 py-2.5 text-[8px] text-slate-400"
                        >
                          <span>{date}</span>

                          <span className="text-slate-300">{plan}</span>

                          <span className="font-medium text-white">
                            {amount}
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

            {/*============= =Bottom Floating Card ================*/}
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
        </div>
      </div>
    </section>
  );
};

export default Hero;
