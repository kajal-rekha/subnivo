import {
  Bell,
  CreditCard,
  LayoutGrid,
  LifeBuoy,
  Package,
  Settings,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const DashboardLayout = ({
  children,
  subscriptionId,
  activeItem = "dashboard",
}) => {
  const session = useSelector((state) => state.auth.userAndToken);
  const username = session?.user?.username || "User";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const subscriptionHref = subscriptionId
    ? `/subscriptions/${subscriptionId}`
    : "/plans";

  useEffect(() => {
    setIsSidebarOpen(window.matchMedia("(min-width: 1024px)").matches);
  }, []);

  const sidebarItems = [
    {
      label: "Dashboard",
      icon: LayoutGrid,
      href: "/dashboard",
      key: "dashboard",
    },
    {
      label: "My Subscription",
      icon: Package,
      href: subscriptionHref,
      key: "subscription",
    },
    { label: "Payments", icon: CreditCard },
    { label: "Plans", icon: Wallet, href: "/plans" },
    { label: "Support", icon: LifeBuoy, href: "/support" },
    { label: "Settings", icon: Settings, href: "/settings", key: "settings" },
  ];

  return (
    <div className="min-h-screen bg-[#06101f] text-white">
      <div className="relative mx-auto flex min-h-screen max-w-[1440px] overflow-hidden border-x border-white/10 bg-[#08182c] shadow-2xl shadow-black/20">
        {isSidebarOpen && (
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          />
        )}
        <aside
          className={`absolute inset-y-0 left-0 z-30 flex w-[230px] flex-col border-r border-white/8 bg-[#071426] p-3 transition-transform duration-200 lg:relative lg:inset-auto lg:z-auto lg:w-[190px] lg:shrink-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:hidden"}`}
        >
          <div className="pb-7 pt-1">
            <button
              type="button"
              aria-label="Hide sidebar"
              aria-controls="dashboard-sidebar"
              aria-expanded={isSidebarOpen}
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center gap-2 rounded px-2 py-1 text-left transition hover:bg-white/5"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded bg-blue-500 text-[10px] font-bold">
                S
              </span>
              <span className="text-sm font-bold tracking-tight">SUBNIVO</span>
            </button>
          </div>
          <nav id="dashboard-sidebar" className="space-y-1">
            {sidebarItems.map(({ label, icon: Icon, href, key }) => {
              const isActive = key === activeItem;
              const className = `flex w-full items-center gap-2 rounded px-2 py-2 text-left text-xs transition ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30" : "text-slate-400 hover:bg-white/5 hover:text-white"}`;

              return (
                <div key={label}>
                  {href ? (
                    <Link
                      href={href}
                      aria-current={isActive ? "page" : undefined}
                      className={className}
                    >
                      <Icon size={12} /> {label}
                    </Link>
                  ) : (
                    <button type="button" className={className}>
                      <Icon size={12} /> {label}
                    </button>
                  )}
                </div>
              );
            })}
          </nav>
          <div className="mt-8 rounded border border-blue-400/20 bg-linear-to-br from-blue-700/50 to-indigo-800/40 p-3">
            <p className="text-xs font-semibold">Upgrade to Premium</p>
            <p className="mt-2 text-[11px] leading-5 text-blue-100/60">
              Unlock more features and exclusive benefits.
            </p>
            <Link
              href="/plans"
              className="mt-3 inline-flex rounded bg-blue-500 px-2 py-1.5 text-[11px] font-medium"
            >
              Upgrade now
            </Link>
          </div>
        </aside>

        <main className="min-w-0 flex-1 bg-[#091a30] p-3 sm:p-5">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 pb-4">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                aria-label={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
                aria-controls="dashboard-sidebar"
                aria-expanded={isSidebarOpen}
                onClick={() => setIsSidebarOpen((open) => !open)}
                className="flex shrink-0 items-center gap-2 rounded px-2 py-1 transition hover:bg-white/5"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded bg-blue-500 text-[10px] font-bold">
                  S
                </span>
                <span className="text-xs font-bold tracking-tight">
                  SUBNIVO
                </span>
              </button>
              <div className="min-w-0 border-l border-white/10 pl-3">
                <h1 className="text-base font-semibold sm:text-lg">
                  Welcome back, {username} 👋
                </h1>
                <p className="mt-1 text-xs text-slate-400">
                  Here&apos;s what&apos;s happening with your account.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Notifications"
                className="relative text-slate-400"
              >
                <Bell size={15} />
                <span className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-rose-400" />
              </button>
              <div className="flex items-center gap-2 border-l border-white/10 pl-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-[9px] font-bold">
                  {username.charAt(0).toUpperCase()}
                </div>
                <span className="hidden text-xs sm:block">{username}</span>
              </div>
            </div>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
