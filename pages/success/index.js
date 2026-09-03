"use client";

import Loading from "@/components/ui/Loading";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const SuccessPage = () => {
  const [latestSub, setLatestSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const session = useSelector((state) => state.auth.userAndToken);

  useEffect(() => {
    if (!session || !session.token) {
      toast.error("You must be logged in to view this page!");
      setLoading(false);
      setError("Please sign in to view your subscription.");
      return;
    }

    let cancelled = false;

    const fetchUserSubscription = async () => {
      for (let attempt = 0; attempt < 10; attempt += 1) {
        try {
          const res = await fetch("/api/subscriptions", {
            headers: {
              Authorization: `Bearer ${session.token}`,
              "Content-Type": "application/json",
            },
          });

          if (!res.ok) throw new Error("Could not load subscriptions");

          const data = await res.json();
          const userSubs = Array.isArray(data)
            ? data.filter((sub) => sub.user_id?._id === session.user?._id)
            : [];
          const latest = userSubs.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          )[0];

          if (latest) {
            if (!cancelled) {
              setLatestSub(latest);
              setLoading(false);
            }
            return;
          }
        } catch (err) {
          console.error(err);
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      if (!cancelled) {
        setLoading(false);
        setError(
          "Payment was received, but the subscription is not ready yet.",
        );
      }
    };

    fetchUserSubscription();

    return () => {
      cancelled = true;
    };
  }, [session]);

  if (loading)
    return (
      <div className="pt-32">
        <Loading isLoading={loading} />
      </div>
    );

  if (error) return <div className="pt-32 text-center text-light">{error}</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary text-light px-4">
      <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-3xl font-semibold mb-2">Payment Successful</h2>

        <p>Plan Name: {latestSub?.plan_id?.name || "No plan found"}</p>

        <p className="text-light/70 ">PlanId: {latestSub?.plan_id?._id}</p>
        <Link
          href={`/subscriptions/${latestSub?._id}`}
          className="bg-blue text-secondary px-6 py-2 rounded-md hover:bg-blue/80 eq mt-2"
        >
          Go to your Subscription page
        </Link>
      </div>
    </div>
  );
};

export default SuccessPage;
