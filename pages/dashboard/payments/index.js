import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { CreditCard, Search } from "lucide-react";

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

const PaymentsPage = () => {
  const router = useRouter();
  const session = useSelector((state) => state.auth.userAndToken);
  const storedToken = getTokenFromSession(session);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadPayments = useCallback(async () => {
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

      const response = await fetch("/api/transactions", {
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      if (!response.ok) {
        throw new Error("Failed to load payments");
      }

      const data = await response.json();
      setTransactions(Array.isArray(data) ? data : []);
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

    loadPayments();
  }, [storedToken, router, loadPayments]);

  const filteredPayments = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return [...transactions].sort(
        (a, b) =>
          new Date(b.createdAt || b.date || 0) -
          new Date(a.createdAt || a.date || 0),
      );
    }

    return [...transactions]
      .filter((item) => {
        const userName = (
          item?.user_id?.username ||
          item?.user_id?.name ||
          ""
        ).toLowerCase();
        const email = (item?.user_id?.email || "").toLowerCase();
        const tranId = (item?.tran_id || "").toLowerCase();
        const status = (item?.status || "").toLowerCase();

        return (
          userName.includes(term) ||
          email.includes(term) ||
          tranId.includes(term) ||
          status.includes(term)
        );
      })
      .sort((a, b) => {
        const aName = (
          a?.user_id?.username ||
          a?.user_id?.name ||
          ""
        ).toLowerCase();
        const bName = (
          b?.user_id?.username ||
          b?.user_id?.name ||
          ""
        ).toLowerCase();

        if (aName.startsWith(term) !== bName.startsWith(term)) {
          return aName.startsWith(term) ? -1 : 1;
        }

        return aName.localeCompare(bName);
      });
  }, [searchTerm, transactions]);

  return (
    <div className="min-h-screen bg-[#07101f] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-sky-300/80">
              Management
            </p>
            <h1 className="mt-2 text-2xl font-semibold">Payments</h1>
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
              <CreditCard size={15} className="text-sky-300" />
              <span>Total Payments</span>
              <span className="rounded bg-sky-500/15 px-2 py-0.5 text-xs font-semibold text-sky-300">
                {transactions.length}
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
                placeholder="Search by user, email or payment ID"
                className="w-full rounded-md border border-white/10 bg-[#111f35] py-2.5 pl-9 pr-3 text-xs text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none"
              />
            </div>
          </div>

          {loading ? (
            <div className="rounded border border-white/8 bg-[#0d1b2b] p-6 text-sm text-slate-400">
              Loading payments...
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="rounded border border-dashed border-white/10 bg-[#0d1b2b] p-8 text-center text-sm text-slate-400">
              No payments match your search.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-[11px] uppercase tracking-[0.12em] text-slate-400">
                    <th className="pb-3 pr-4 font-medium">Customer</th>
                    <th className="pb-3 pr-4 font-medium">Payment ID</th>
                    <th className="pb-3 pr-4 font-medium">Status</th>
                    <th className="pb-3 pr-4 font-medium">Amount</th>
                    <th className="pb-3 pr-4 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr
                      key={payment._id}
                      className="border-b border-white/5 text-[12px] text-slate-200 last:border-b-0"
                    >
                      <td className="py-3 pr-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-white">
                            {payment?.user_id?.username ||
                              payment?.user_id?.name ||
                              "Unknown"}
                          </span>
                          <span className="text-slate-400">
                            {payment?.user_id?.email || "-"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-slate-300">
                        {payment?.tran_id || "-"}
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`rounded-full px-2 py-1 text-[10px] font-medium ${
                            payment?.status === "completed"
                              ? "bg-emerald-500/15 text-emerald-300"
                              : payment?.status === "pending"
                                ? "bg-amber-500/15 text-amber-300"
                                : payment?.status === "failed"
                                  ? "bg-rose-500/15 text-rose-300"
                                  : "bg-slate-500/15 text-slate-300"
                          }`}
                        >
                          {payment?.status || "pending"}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-slate-300">
                        {formatCurrency(payment?.amount || 0)}
                      </td>
                      <td className="py-3 pr-4 text-slate-400">
                        {formatDate(payment?.date || payment?.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
