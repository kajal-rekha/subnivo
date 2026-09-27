import {
  Bell,
  CreditCard,
  ChevronDown,
  CircleDollarSign,
  Gauge,
  LayoutGrid,
  MoreHorizontal,
  Package,
  Search,
  Settings,
  Users,
  Sparkles,
  Wallet,
} from "lucide-react";
import UserDashboard from "@/components/UserDashboard";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutGrid, active: true },
  { label: "Users", icon: Users },
  { label: "Subscriptions", icon: Package },
  { label: "Payments", icon: CreditCard },
  { label: "Plans", icon: Wallet },
  { label: "Reports", icon: Gauge },
  { label: "Settings", icon: Settings },
];

const statCards = [
  {
    label: "Total Users",
    value: "4,892",
    change: "+12.5%",
    helper: "Since last month",
    icon: Users,
    color: "bg-sky-400/15 text-sky-300",
  },
  {
    label: "Active Subscriptions",
    value: "3,648",
    change: "+10.2%",
    helper: "Since last month",
    icon: CreditCard,
    color: "bg-violet-400/15 text-violet-300",
  },
  {
    label: "Total Revenue",
    value: "$24,892",
    change: "+18.4%",
    helper: "Since last month",
    icon: CircleDollarSign,
    color: "bg-emerald-400/15 text-emerald-300",
  },
  {
    label: "Total Plans",
    value: "3",
    change: "",
    helper: "Basic · Pro · Premium",
    icon: Package,
    color: "bg-indigo-400/15 text-indigo-300",
  },
];

const revenueData = [26, 38, 34, 49, 43, 66, 54, 71, 61, 79, 72, 96];
const chartPoints = revenueData
  .map((value, index) => `${18 + index * 43},${132 - value}`)
  .join(" ");

const recentUsers = [
  {
    name: "Arafat Hasan",
    email: "arafat@gmail.com",
    date: "Sep 18, 2025",
    status: "Active",
    color: "bg-sky-500",
  },
  {
    name: "Sadia Islam",
    email: "sadia@gmail.com",
    date: "Sep 16, 2025",
    status: "Active",
    color: "bg-pink-500",
  },
  {
    name: "Tanvir Hasan",
    email: "tanvir@gmail.com",
    date: "Sep 15, 2025",
    status: "Active",
    color: "bg-amber-500",
  },
  {
    name: "Nusrat Jahan",
    email: "nusrat@gmail.com",
    date: "Sep 14, 2025",
    status: "Active",
    color: "bg-emerald-500",
  },
];

const recentPayments = [
  { name: "Premium Plan", date: "Sep 16, 2025", amount: "$29.00" },
  { name: "Pro Plan", date: "Sep 15, 2025", amount: "$19.00" },
  { name: "Basic Plan", date: "Sep 14, 2025", amount: "$9.00" },
  { name: "Pro Plan", date: "Sep 12, 2025", amount: "$19.00" },
];

const countries = [
  { name: "Bangladesh", users: "1,892", share: "38%", color: "bg-emerald-400" },
  { name: "United States", users: "1,124", share: "23%", color: "bg-sky-400" },
  { name: "Canada", users: "682", share: "14%", color: "bg-rose-400" },
  { name: "United Kingdom", users: "438", share: "9%", color: "bg-violet-400" },
];

const Dashboard = ({ allowAdmin = false }) => {
  const router = useRouter();
  const session = useSelector((state) => state.auth.userAndToken);
  const username = session?.user?.username || session?.username || "Admin";
  const isAdmin = session?.user?.role === "admin";

  if (isAdmin && !allowAdmin) {
    router.replace("/dashboard/adminDashboard");
    return null;
  }

  if (!isAdmin) {
    return <UserDashboard />;
  }

  return (
    <div className="min-h-screen bg-[#07101f] text-white">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="w-full shrink-0 border-b border-white/8 bg-[#081426] px-5 py-5 lg:w-[230px] lg:border-b-0 lg:border-r lg:px-4">
          <div className="flex items-center gap-3 px-2 pb-8">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-sky-400 to-indigo-500 text-sm font-bold shadow-lg shadow-sky-500/20">
              S
            </div>
            <span className="text-lg font-bold tracking-tight">SUBNIVO</span>
          </div>

          <nav className="grid grid-cols-2 gap-1 lg:block lg:space-y-1">
            {sidebarItems.map(({ label, icon: Icon, active }) => (
              <button
                key={label}
                type="button"
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-xs transition ${active ? "bg-[#1260d6] text-white shadow-lg shadow-blue-950/30" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
              >
                <Icon size={15} />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-10 hidden rounded-lg border border-white/8 bg-white/3 p-3 lg:block">
            <div className="mb-2 flex items-center justify-between text-xs text-slate-300">
              <span>Need help?</span>
              <MoreHorizontal size={14} />
            </div>
            <p className="text-[10px] text-slate-500">
              Contact support anytime
            </p>
          </div>
        </aside>

        <main className="min-w-0 flex-1 bg-[#0b172b] px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
          <header className="flex flex-col gap-5 border-b border-white/8 pb-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h1 className="mt-1 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                Admin Dashboard
              </h1>
              <p className="text-[11px] text-slate-400">
                Overview of your platform performance and activity
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden h-9 w-56 items-center gap-2 rounded-md border border-white/10 bg-[#101f36] px-3 text-[10px] text-slate-500 md:flex">
                <Search size={14} />
                <span>Search users, plans or transactions...</span>
              </div>
              <button
                type="button"
                aria-label="Notifications"
                className="relative flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-[#101f36] text-slate-300"
              >
                <Bell size={15} />
                <span className="absolute right-2 top-1 h-1.5 w-1.5 rounded-full bg-rose-400" />
              </button>
              <div className="flex items-center gap-2 border-l border-white/10 pl-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-sky-400 to-violet-500 text-[10px] font-bold">
                  {username.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block">
                  <p className="text-[10px] font-medium text-white">
                    {username}
                  </p>
                  <p className="text-[9px] text-slate-500">Administrator</p>
                </div>
                <ChevronDown size={13} className="text-slate-500" />
              </div>
            </div>
          </header>

          <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map(
              ({ label, value, change, helper, icon: Icon, color }) => (
                <div
                  key={label}
                  className="rounded-lg border border-white/8 bg-[#0e1d33] p-4 shadow-[0_12px_30px_rgba(2,8,23,0.18)]"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400">{label}</p>
                      <p className="mt-2 text-2xl font-semibold tracking-tight">
                        {value}
                      </p>
                    </div>
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${color}`}
                    >
                      <Icon size={15} />
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-[9px]">
                    <span className="text-emerald-400">{change}</span>
                    <span className="text-slate-500">{helper}</span>
                  </div>
                </div>
              ),
            )}
          </section>

          <section className="mt-4 grid gap-4 xl:grid-cols-[1.55fr_0.9fr_0.9fr]">
            <div className="rounded-lg border border-white/8 bg-[#0e1d33] p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold">Revenue Overview</h2>
                  <p className="mt-1 text-[9px] text-slate-500">Last 7 days</p>
                </div>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded border border-white/10 px-2 py-1 text-[9px] text-slate-300"
                >
                  7 days <ChevronDown size={11} />
                </button>
              </div>
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 flex flex-col justify-between text-[8px] text-slate-600">
                  {["$4,000", "$3,000", "$2,000", "$1,000", "$0"].map(
                    (value) => (
                      <div key={value} className="flex items-center gap-2">
                        <span className="w-8">{value}</span>
                        <span className="h-px flex-1 bg-white/6" />
                      </div>
                    ),
                  )}
                </div>
                <svg
                  viewBox="0 0 490 150"
                  className="absolute bottom-3 left-10 right-0 h-[calc(100%-25px)] w-[calc(100%-40px)]"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="revenueFill"
                      x1="0"
                      x2="0"
                      y1="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#32a8ff" stopOpacity=".35" />
                      <stop offset="100%" stopColor="#32a8ff" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d={`M 18 132 ${chartPoints} L 491 132 L 18 132 Z`}
                    fill="url(#revenueFill)"
                  />
                  <polyline
                    points={chartPoints}
                    fill="none"
                    stroke="#45b5ff"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="absolute bottom-0 left-10 right-0 flex justify-between text-[8px] text-slate-600">
                  {[
                    "Sep 10",
                    "Sep 11",
                    "Sep 12",
                    "Sep 13",
                    "Sep 14",
                    "Sep 15",
                    "Sep 16",
                  ].map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-white/8 bg-[#0e1d33] p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold">Recent Users</h2>
                <button type="button" className="text-[9px] text-sky-400">
                  View all →
                </button>
              </div>
              <div className="space-y-3">
                {recentUsers.map(({ name, email, date, status, color }) => (
                  <div key={email} className="flex items-center gap-2">
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold ${color}`}
                    >
                      {name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[10px] font-medium text-white">
                        {name}
                      </p>
                      <p className="truncate text-[8px] text-slate-500">
                        {email}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] text-slate-500">{date}</p>
                      <span className="text-[8px] text-emerald-400">
                        {status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-white/8 bg-[#0e1d33] p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold">Recent Payments</h2>
                <button type="button" className="text-[9px] text-sky-400">
                  View all →
                </button>
              </div>
              <div className="space-y-3">
                {recentPayments.map(({ name, date, amount }) => (
                  <div
                    key={`${name}-${date}`}
                    className="flex items-center gap-2"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-emerald-400/15 text-emerald-300">
                      <CreditCard size={13} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[10px] font-medium">{name}</p>
                      <p className="text-[8px] text-slate-500">{date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-medium">{amount}</p>
                      <span className="text-[8px] text-emerald-400">Paid</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1fr_1.35fr]">
            <div className="rounded-lg border border-white/8 bg-[#0e1d33] p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">Plan Distribution</h2>
                <MoreHorizontal size={14} className="text-slate-500" />
              </div>
              <div className="mt-5 flex items-center gap-5">
                <div className="relative h-24 w-24 shrink-0 rounded-full bg-[conic-gradient(#3b82f6_0_62%,#8b5cf6_62%_85%,#22c55e_85%_100%)]">
                  <div className="absolute inset-3 flex flex-col items-center justify-center rounded-full bg-[#0e1d33]">
                    <span className="text-sm font-semibold">4,892</span>
                    <span className="text-[7px] text-slate-500">
                      Total Users
                    </span>
                  </div>
                </div>
                <div className="space-y-2 text-[9px] text-slate-400">
                  <p>
                    <i className="mr-2 inline-block h-2 w-2 rounded-full bg-blue-400" />
                    Premium <span className="ml-3 text-white">62%</span>
                  </p>
                  <p>
                    <i className="mr-2 inline-block h-2 w-2 rounded-full bg-violet-400" />
                    Pro <span className="ml-7 text-white">23%</span>
                  </p>
                  <p>
                    <i className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-400" />
                    Basic <span className="ml-5 text-white">15%</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-white/8 bg-[#0e1d33] p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold">Top Countries</h2>
                <button type="button" className="text-[9px] text-sky-400">
                  View all →
                </button>
              </div>
              <div className="space-y-3">
                {countries.map(({ name, users, share, color }) => (
                  <div
                    key={name}
                    className="flex items-center gap-2 text-[9px]"
                  >
                    <span className={`h-2 w-2 rounded-full ${color}`} />
                    <span className="flex-1 text-slate-300">{name}</span>
                    <span className="text-slate-400">{users}</span>
                    <span className="w-7 text-right text-slate-500">
                      {share}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-lg border border-blue-500/15 bg-linear-to-br from-[#102d60] to-[#12224a] p-5">
              <div className="relative z-10 max-w-[65%]">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-400/20 text-blue-300">
                  <Sparkles size={16} />
                </span>
                <h2 className="mt-3 text-sm font-semibold">
                  Manage Plans & Features
                </h2>
                <p className="mt-1 text-[9px] leading-relaxed text-slate-400">
                  Create, edit or remove plans and manage your subscription
                  offerings with ease.
                </p>
                <button
                  type="button"
                  className="mt-4 rounded bg-blue-500 px-3 py-1.5 text-[9px] font-semibold text-white"
                >
                  Go to Plans →
                </button>
              </div>
              <div className="absolute -right-4 top-8 rotate-[-14deg] rounded-lg border border-white/20 bg-blue-400/30 p-4 shadow-2xl shadow-blue-500/30">
                <CreditCard size={42} className="text-blue-200" />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
