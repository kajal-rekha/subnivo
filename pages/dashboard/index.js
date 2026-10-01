import {
  ArrowUpRight,
  Bell,
  CreditCard,
  ChevronDown,
  CircleDollarSign,
  Gauge,
  House,
  LayoutGrid,
  MoreHorizontal,
  Package,
  Settings,
  Users,
  Sparkles,
  Wallet,
} from "lucide-react";
import UserDashboard from "@/components/UserDashboard";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const sidebarItems = [
  {
    label: "Dashboard",
    icon: LayoutGrid,
    active: true,
    href: "/dashboard/adminDashboard",
  },
  { label: "Users", icon: Users, href: "/dashboard/users" },
  { label: "Subscriptions", icon: Package, href: "/dashboard/subscriptions" },
  { label: "Payments", icon: CreditCard, href: "/dashboard/payments" },
  { label: "Plans", icon: Wallet, href: "/dashboard/plans" },
  { label: "Reports", icon: Gauge, href: "/dashboard/reports" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

const formatCurrency = (amount) =>
  Number(amount || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

const formatDisplayDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(value))
    : "-";

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

const Dashboard = ({ allowAdmin = false }) => {
  const router = useRouter();
  const session = useSelector((state) => state.auth.userAndToken);
  const storedToken = getTokenFromSession(session);
  const authToken = storedToken || session?.token || "";
  const [currentUser, setCurrentUser] = useState(session?.user || null);
  const [resolvedAdmin, setResolvedAdmin] = useState(
    session?.user?.role === "admin" ||
      (session && decodeJwtPayload(storedToken)?.role === "admin"),
  );
  const username = currentUser?.username || session?.username || "Admin";
  const isAdmin = resolvedAdmin || session?.user?.role === "admin";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationsSeenAt, setNotificationsSeenAt] = useState(0);
  const notificationRef = useRef(null);
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    totalPlans: 0,
    recentUsers: [],
    recentPayments: [],
    notifications: [],
    revenueSeries: [0, 0, 0, 0, 0, 0, 0],
    revenueSeriesByRange: {
      3: [0, 0, 0],
      7: [0, 0, 0, 0, 0, 0, 0],
      10: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      14: Array.from({ length: 14 }, () => 0),
    },
    planDistribution: [],
    countryStats: [],
  });
  const [selectedRange, setSelectedRange] = useState(7);
  const [isRangeMenuOpen, setIsRangeMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsSidebarOpen(window.matchMedia("(min-width: 1024px)").matches);
  }, []);

  useEffect(() => {
    const savedSeenAt = window.localStorage.getItem(
      "subnivo_admin_notifications_seen_at",
    );
    setNotificationsSeenAt(Number(savedSeenAt) || 0);
  }, []);

  useEffect(() => {
    if (!isNotificationOpen) return undefined;

    const closeOnOutsideClick = (event) => {
      if (!notificationRef.current?.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsNotificationOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isNotificationOpen]);

  useEffect(() => {
    const resolveCurrentUser = async () => {
      if (!storedToken) {
        setCurrentUser(null);
        setResolvedAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/users/me", {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        if (response.ok) {
          const data = await response.json();
          const user = data?.user || data;
          setCurrentUser(user);
          setResolvedAdmin(user?.role === "admin");
        } else {
          const jwtPayload = decodeJwtPayload(storedToken);
          const fallbackUser = jwtPayload
            ? { username: "Admin", role: jwtPayload.role }
            : null;
          setCurrentUser(fallbackUser);
          setResolvedAdmin(jwtPayload?.role === "admin");
        }
      } catch {
        const jwtPayload = decodeJwtPayload(storedToken);
        setCurrentUser(
          jwtPayload ? { username: "Admin", role: jwtPayload.role } : null,
        );
        setResolvedAdmin(jwtPayload?.role === "admin");
      }
    };

    resolveCurrentUser();
  }, [storedToken]);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!storedToken || !resolvedAdmin) {
        setIsLoading(false);
        return;
      }

      try {
        const [usersResponse, subscriptionsResponse, plansResponse] =
          await Promise.all([
            fetch("/api/users", {
              headers: { Authorization: `Bearer ${authToken}` },
            }),
            fetch("/api/subscriptions", {
              headers: { Authorization: `Bearer ${authToken}` },
            }),
            fetch("/api/plans"),
          ]);

        if (!usersResponse.ok) {
          throw new Error("Unable to load users");
        }
        if (!subscriptionsResponse.ok) {
          throw new Error("Unable to load subscriptions");
        }
        if (!plansResponse.ok) {
          throw new Error("Unable to load plans");
        }

        const users = await usersResponse.json();
        const subscriptions = await subscriptionsResponse.json();
        const plans = await plansResponse.json();

        const normalizedUsers = (Array.isArray(users) ? users : []).filter(
          (user) => user?.role !== "admin",
        );
        const normalizedSubscriptions = Array.isArray(subscriptions)
          ? subscriptions
          : [];
        const normalizedPlans = Array.isArray(plans) ? plans : [];
        const notifications = [
          ...normalizedUsers.slice(0, 8).map((user, index) => ({
            id: `user-${user?._id || user?.email || index}`,
            type: "user",
            title: "New customer joined",
            detail: user?.username || user?.email || "New customer",
            date: user?.createdAt,
            href: "/dashboard/users",
          })),
          ...normalizedSubscriptions
            .filter(
              (subscription) =>
                subscription?.status === "active" &&
                Boolean(subscription?.plan_id?.name),
            )
            .map((subscription, index) => ({
              id: `subscription-${subscription?._id || index}`,
              type: "subscription",
              title: "Subscription activated",
              detail: `${subscription?.user_id?.username || subscription?.user_id?.email || "A customer"} · ${subscription?.plan_id?.name}`,
              date: subscription?.createdAt || subscription?.startDate,
              href: "/dashboard/subscriptions",
            })),
        ]
          .filter((item) => item.date)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 8);

        const buildRevenueSeries = (days) => {
          const todaysDate = new Date();

          return Array.from({ length: days }, (_, index) => {
            const date = new Date(todaysDate);
            date.setDate(todaysDate.getDate() - (days - 1 - index));

            return normalizedSubscriptions.reduce((sum, subscription) => {
              const subscriptionDate = new Date(
                subscription?.createdAt ||
                  subscription?.startDate ||
                  Date.now(),
              );

              const isSameDay =
                subscriptionDate.getFullYear() === date.getFullYear() &&
                subscriptionDate.getMonth() === date.getMonth() &&
                subscriptionDate.getDate() === date.getDate();

              if (!isSameDay) {
                return sum;
              }

              const amount = Number(
                subscription?.amount ?? subscription?.plan_id?.price ?? 0,
              );

              return sum + (Number.isFinite(amount) ? amount : 0);
            }, 0);
          });
        };

        const revenueSeriesByRange = {
          3: buildRevenueSeries(3),
          7: buildRevenueSeries(7),
          10: buildRevenueSeries(10),
          14: buildRevenueSeries(14),
          30: buildRevenueSeries(30),
        };

        const totalRevenue = normalizedSubscriptions.reduce(
          (sum, subscription) => {
            const amount = Number(
              subscription?.amount ?? subscription?.plan_id?.price ?? 0,
            );
            return sum + (Number.isFinite(amount) ? amount : 0);
          },
          0,
        );

        const planDistribution = normalizedPlans.map((plan, index) => {
          const count = normalizedSubscriptions.filter((subscription) => {
            const planId =
              subscription?.plan_id?._id ?? subscription?.plan_id ?? "";
            return String(planId) === String(plan?._id);
          }).length;

          return {
            label: plan?.name || `Plan ${index + 1}`,
            count,
            color: ["bg-blue-400", "bg-violet-400", "bg-emerald-400"][
              index % 3
            ],
          };
        });

        const countryMap = {};
        normalizedUsers.forEach((user) => {
          const country = (user?.country || "Unknown").trim();
          if (!country || country === "Unknown") return;
          countryMap[country] = (countryMap[country] || 0) + 1;
        });

        const countryStats = Object.entries(countryMap)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 4)
          .map(([name, count], index) => ({
            name,
            users: count.toLocaleString(),
            share:
              normalizedUsers.length > 0
                ? `${Math.round((count / normalizedUsers.length) * 100)}%`
                : "0%",
            color: [
              "bg-emerald-400",
              "bg-sky-400",
              "bg-rose-400",
              "bg-violet-400",
            ][index % 4],
          }));

        const recentUsers = normalizedUsers.slice(0, 4).map((user, index) => ({
          name: user?.username || "User",
          email: user?.email || "No email",
          date: formatDisplayDate(user?.createdAt),
          status: user?.status || "Active",
          color: [
            "bg-sky-500",
            "bg-pink-500",
            "bg-amber-500",
            "bg-emerald-500",
          ][index % 4],
        }));

        const recentPayments = normalizedSubscriptions
          .slice(0, 4)
          .map((subscription, index) => ({
            name: subscription?.plan_id?.name || "Subscription",
            date: formatDisplayDate(
              subscription?.createdAt || subscription?.startDate,
            ),
            amount: formatCurrency(
              subscription?.amount ?? subscription?.plan_id?.price ?? 0,
            ),
            color: [
              "bg-emerald-400/15",
              "bg-sky-400/15",
              "bg-violet-400/15",
              "bg-indigo-400/15",
            ][index % 4],
          }));

        const safePlanDistribution = planDistribution.length
          ? planDistribution
          : [
              { label: "Basic", count: 0, color: "bg-emerald-400" },
              { label: "Pro", count: 0, color: "bg-violet-400" },
              { label: "Premium", count: 0, color: "bg-blue-400" },
            ];

        const totalDistribution = safePlanDistribution.reduce(
          (sum, item) => sum + item.count,
          0,
        );

        setDashboardData({
          totalUsers: normalizedUsers.length,
          activeSubscriptions: normalizedSubscriptions.filter(
            (subscription) =>
              subscription?.status === "active" &&
              Boolean(subscription?.plan_id?.name),
          ).length,
          totalRevenue,
          totalPlans: normalizedPlans.length,
          recentUsers,
          recentPayments,
          notifications,
          revenueSeries: revenueSeriesByRange[7],
          revenueSeriesByRange,
          planDistribution: safePlanDistribution.map((item, index) => ({
            ...item,
            share:
              totalDistribution > 0
                ? `${Math.round((item.count / totalDistribution) * 100)}%`
                : "0%",
            color:
              item.color ||
              ["bg-emerald-400", "bg-violet-400", "bg-blue-400"][index % 3],
          })),
          countryStats,
        });
      } catch (loadError) {
        setError(loadError.message || "Unable to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [resolvedAdmin, storedToken, authToken]);

  const revenueSeries =
    dashboardData.revenueSeriesByRange?.[selectedRange] ||
    dashboardData.revenueSeries ||
    Array.from({ length: selectedRange }, () => 0);
  const revenueMax = Math.max(...revenueSeries, 1);
  const xStep =
    revenueSeries.length > 1 ? (490 - 18) / (revenueSeries.length - 1) : 0;
  const chartPoints = revenueSeries
    .map(
      (value, index) =>
        `${18 + index * xStep},${132 - (value / revenueMax) * 90}`,
    )
    .join(" ");
  const revenueLabels = Array.from({ length: selectedRange }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (selectedRange - 1 - index));
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  });

  const statCards = [
    {
      label: "Total Users",
      value: dashboardData.totalUsers.toLocaleString(),
      change: dashboardData.totalUsers ? "Live" : "0%",
      helper: "From user database",
      icon: Users,
      color: "bg-sky-400/15 text-sky-300",
    },
    {
      label: "Active Subscriptions",
      value: dashboardData.activeSubscriptions.toLocaleString(),
      change: dashboardData.activeSubscriptions ? "Live" : "0%",
      helper: "Current active plans",
      icon: CreditCard,
      color: "bg-violet-400/15 text-violet-300",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(dashboardData.totalRevenue),
      change: dashboardData.totalRevenue ? "Live" : "0%",
      helper: "From subscriptions",
      icon: CircleDollarSign,
      color: "bg-emerald-400/15 text-emerald-300",
    },
    {
      label: "Total Plans",
      value: dashboardData.totalPlans.toString(),
      change: dashboardData.totalPlans ? "Live" : "0%",
      helper: dashboardData.totalPlans
        ? `${dashboardData.totalPlans} plan(s) available`
        : "No plans found",
      icon: Package,
      color: "bg-indigo-400/15 text-indigo-300",
    },
  ];

  const notifications = dashboardData.notifications || [];
  const unreadNotificationCount = notifications.filter(
    (item) => new Date(item.date).getTime() > notificationsSeenAt,
  ).length;
  const handleNotificationToggle = () => {
    const willOpen = !isNotificationOpen;
    setIsNotificationOpen(willOpen);

    if (!willOpen) return;

    const seenAt = Math.max(
      Date.now(),
      ...notifications.map((item) => new Date(item.date).getTime()),
    );
    setNotificationsSeenAt(seenAt);

    try {
      window.localStorage.setItem(
        "subnivo_admin_notifications_seen_at",
        String(seenAt),
      );
    } catch (storageError) {
      console.error(storageError);
    }
  };

  const planDistribution = dashboardData.planDistribution.length
    ? dashboardData.planDistribution
    : [
        { label: "Premium", share: "0%", color: "bg-blue-400", count: 0 },
        { label: "Pro", share: "0%", color: "bg-violet-400", count: 0 },
        { label: "Basic", share: "0%", color: "bg-emerald-400", count: 0 },
      ];

  if (isAdmin && !allowAdmin) {
    router.replace("/dashboard/adminDashboard");
    return null;
  }

  if (!isAdmin) {
    return <UserDashboard />;
  }

  return (
    <div className="min-h-screen bg-[#07101f] text-white">
      <div className="relative flex min-h-screen overflow-hidden">
        {isSidebarOpen && (
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          />
        )}
        <aside
          className={`absolute inset-y-0 left-0 z-30 flex w-[230px] shrink-0 flex-col border-r border-white/8 bg-[#081426] px-4 py-5 transition-transform duration-200 lg:relative lg:inset-auto lg:z-auto ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:hidden"}`}
        >
          <div className="px-2 pb-10">
            <button
              type="button"
              aria-label="Hide sidebar"
              aria-controls="admin-dashboard-sidebar"
              aria-expanded={isSidebarOpen}
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center gap-3 rounded text-left"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-sky-400 to-indigo-500 text-sm font-bold shadow-lg shadow-sky-500/20">
                S
              </span>
              <span className="text-lg font-bold tracking-tight">SUBNIVO</span>
            </button>
          </div>

          <nav id="admin-dashboard-sidebar" className="space-y-1">
            {sidebarItems.map(({ label, icon: Icon, active, href }) => {
              const isActive = active || router.asPath === href;
              const buttonClass = `flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-xs transition ${isActive ? "bg-[#1260d6] text-white shadow-lg shadow-blue-950/30" : "text-slate-400 hover:bg-white/5 hover:text-white"}`;

              return href ? (
                <Link key={label} href={href} className={buttonClass}>
                  <Icon size={15} />
                  <span>{label}</span>
                </Link>
              ) : (
                <button key={label} type="button" className={buttonClass}>
                  <Icon size={15} />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>

          <Link
            href="/support"
            className="mt-10 block rounded-lg border border-white/8 bg-white/3 p-3 transition hover:border-white/15 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            <div className="mb-2 flex items-center justify-between text-xs text-slate-300">
              <span>Need help?</span>
              <ArrowUpRight size={14} />
            </div>
            <p className="text-[10px] text-slate-500">
              Contact support anytime
            </p>
          </Link>
        </aside>

        <main className="min-w-0 flex-1 bg-[#0b172b] px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
          <header className="flex flex-col gap-5 border-b border-white/8 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              {!isSidebarOpen && (
                <button
                  type="button"
                  aria-label="Show sidebar"
                  aria-controls="admin-dashboard-sidebar"
                  aria-expanded={isSidebarOpen}
                  onClick={() => setIsSidebarOpen(true)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-sky-400 to-indigo-500 text-sm font-bold"
                >
                  S
                </button>
              )}
              <div
                className={`min-w-0 ${isSidebarOpen ? "" : "border-l border-white/10 pl-3"}`}
              >
                <h1 className="mt-1 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  Admin Dashboard
                </h1>
                <p className="text-[11px] text-slate-400">
                  Overview of your platform performance and activity
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3 self-end sm:ml-auto sm:self-auto">
              <div ref={notificationRef} className="relative">
                <button
                  type="button"
                  aria-label={`Notifications${unreadNotificationCount ? `, ${unreadNotificationCount} unread` : ""}`}
                  aria-expanded={isNotificationOpen}
                  aria-controls="admin-notifications"
                  onClick={handleNotificationToggle}
                  className="relative flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-[#101f36] text-slate-300 transition hover:bg-[#162844]"
                >
                  <Bell size={15} />
                  {unreadNotificationCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-semibold text-white">
                      {unreadNotificationCount > 9
                        ? "9+"
                        : unreadNotificationCount}
                    </span>
                  )}
                </button>
                {isNotificationOpen && (
                  <div
                    id="admin-notifications"
                    className="absolute right-0 z-50 mt-2 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-white/10 bg-[#0c1a2d] shadow-xl shadow-black/30"
                  >
                    <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
                      <h2 className="text-xs font-semibold text-white">
                        Recent activity
                      </h2>
                      <span className="text-[10px] text-slate-400">
                        {notifications.length} items
                      </span>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="px-4 py-6 text-center text-xs text-slate-400">
                          No recent activity yet.
                        </p>
                      ) : (
                        notifications.map((item) => {
                          const isUnread =
                            new Date(item.date).getTime() > notificationsSeenAt;

                          return (
                            <Link
                              key={item.id}
                              href={item.href}
                              onClick={() => setIsNotificationOpen(false)}
                              className="flex items-start gap-3 border-b border-white/5 px-4 py-3 transition last:border-b-0 hover:bg-white/5"
                            >
                              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-sky-500/10 text-sky-300">
                                {item.type === "user" ? (
                                  <Users size={13} />
                                ) : (
                                  <Package size={13} />
                                )}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="flex items-center gap-2 text-[11px] font-medium text-white">
                                  {item.title}
                                  {isUnread && (
                                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" />
                                  )}
                                </span>
                                <span className="mt-1 block truncate text-[10px] text-slate-400">
                                  {item.detail}
                                </span>
                                <span className="mt-1 block text-[9px] text-slate-500">
                                  {formatDisplayDate(item.date)}
                                </span>
                              </span>
                            </Link>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
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
              </div>
              <Link
                href="/"
                aria-label="Go to main site"
                title="Main site"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-[#101f36] text-slate-300 transition hover:bg-[#162844] hover:text-white"
              >
                <House size={15} />
              </Link>
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
                  <p className="mt-1 text-[9px] text-slate-500">
                    Last {selectedRange} days
                  </p>
                </div>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsRangeMenuOpen((value) => !value)}
                    className="flex items-center gap-2 rounded border border-white/10 px-2 py-1 text-[9px] text-slate-300"
                  >
                    {selectedRange} days <ChevronDown size={11} />
                  </button>
                  {isRangeMenuOpen && (
                    <div className="absolute right-0 z-20 mt-2 w-28 overflow-hidden rounded border border-white/10 bg-[#0d1a2d] shadow-lg">
                      {[3, 7, 10, 14, 30].map((days) => (
                        <button
                          key={days}
                          type="button"
                          onClick={() => {
                            setSelectedRange(days);
                            setIsRangeMenuOpen(false);
                          }}
                          className={`block w-full px-2 py-2 text-left text-[9px] transition ${
                            selectedRange === days
                              ? "bg-sky-500/20 text-sky-300"
                              : "text-slate-300 hover:bg-white/5"
                          }`}
                        >
                          {days} days
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="relative h-48 overflow-hidden rounded-md">
                <div className="absolute inset-0 flex flex-col justify-between text-[8px] text-slate-500">
                  {["$4,000", "$3,000", "$2,000", "$1,000", "$0"].map(
                    (value) => (
                      <div key={value} className="flex items-center gap-2">
                        <span className="w-10 font-medium">{value}</span>
                        <span className="h-px flex-1 bg-white/8" />
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
                      <stop
                        offset="0%"
                        stopColor="#60a5fa"
                        stopOpacity="0.42"
                      />
                      <stop
                        offset="100%"
                        stopColor="#60a5fa"
                        stopOpacity="0.02"
                      />
                    </linearGradient>
                    <filter
                      id="revenueGlow"
                      x="-20%"
                      y="-20%"
                      width="140%"
                      height="140%"
                    >
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <path
                    d={`M 18 132 ${chartPoints} L 491 132 L 18 132 Z`}
                    fill="url(#revenueFill)"
                  />
                  <polyline
                    points={chartPoints}
                    fill="none"
                    stroke="#60a5fa"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#revenueGlow)"
                  />
                  {revenueSeries.map((value, index) => {
                    const x =
                      18 +
                      index *
                        (revenueSeries.length > 1
                          ? (490 - 18) / (revenueSeries.length - 1)
                          : 0);
                    const y = 132 - (value / revenueMax) * 90;

                    return (
                      <g key={`${value}-${index}`}>
                        <circle
                          cx={x}
                          cy={y}
                          r="3.5"
                          fill="#dbeafe"
                          stroke="#60a5fa"
                          strokeWidth="2"
                        />
                      </g>
                    );
                  })}
                </svg>
                <div className="absolute bottom-0 left-10 right-0 flex justify-between text-[8px] text-slate-500">
                  {revenueLabels.map((day, index) => (
                    <span key={`${day}-${index}`} className="truncate">
                      {day}
                    </span>
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
                {dashboardData.recentUsers.map(
                  ({ name, email, date, status, color }) => (
                    <div
                      key={`${name}-${email}`}
                      className="flex items-center gap-2"
                    >
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold ${color}`}
                      >
                        {name.charAt(0).toUpperCase()}
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
                  ),
                )}
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
                {dashboardData.recentPayments.map(
                  ({ name, date, amount, color }) => (
                    <div
                      key={`${name}-${date}`}
                      className="flex items-center gap-2"
                    >
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded ${color} text-emerald-300`}
                      >
                        <CreditCard size={13} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[10px] font-medium">
                          {name}
                        </p>
                        <p className="text-[8px] text-slate-500">{date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-medium">{amount}</p>
                        <span className="text-[8px] text-emerald-400">
                          Paid
                        </span>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </section>

          <section className="mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-[0.9fr_1fr_1.35fr]">
            <div className="rounded-lg border border-white/8 bg-[#0e1d33] p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">Plan Distribution</h2>
                <MoreHorizontal size={14} className="text-slate-500" />
              </div>
              <div className="mt-5 flex items-center gap-5">
                <div className="relative h-24 w-24 shrink-0 rounded-full bg-[conic-gradient(#3b82f6_0_62%,#8b5cf6_62%_85%,#22c55e_85%_100%)]">
                  <div className="absolute inset-3 flex flex-col items-center justify-center rounded-full bg-[#0e1d33]">
                    <span className="text-sm font-semibold">
                      {dashboardData.totalUsers.toLocaleString()}
                    </span>
                    <span className="text-[7px] text-slate-500">
                      Total Users
                    </span>
                  </div>
                </div>
                <div className="space-y-2 text-[9px] text-slate-400">
                  {planDistribution.map(({ label, share, color }) => (
                    <p key={label}>
                      <i
                        className={`mr-2 inline-block h-2 w-2 rounded-full ${color}`}
                      />
                      {label} <span className="ml-3 text-white">{share}</span>
                    </p>
                  ))}
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
                {dashboardData.countryStats.length ? (
                  dashboardData.countryStats.map(
                    ({ name, users, share, color }) => (
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
                    ),
                  )
                ) : (
                  <p className="text-[9px] text-slate-400">
                    No country data available.
                  </p>
                )}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-lg border border-blue-500/15 bg-linear-to-br from-[#102d60] to-[#12224a] p-5 lg:col-span-2 xl:col-span-1">
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
                  onClick={() => router.push("/dashboard/plans")}
                  className="mt-4 rounded bg-blue-500 px-3 py-1.5 text-[9px] font-semibold text-white transition hover:bg-blue-400"
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
