import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const PlanCard = ({ plan }) => {
  const [loading, setLoading] = useState(false);

  const session = useSelector((state) => state.auth.userAndToken);

  console.log("session:", session);

  const router = useRouter();

  const handleSubscribe = async () => {
    const token = session?.token;

    if (!token) {
      toast.error("You must be logged in to proceed to checkout.");

      setTimeout(() => {
        router.push("/auth/sign-in?redirect=/plans");
      }, 500);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          planId: plan._id,
          planName: plan.name,
          price: plan.price,
          userId: session?.user?._id,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Payment initialization failed");
      }
    } catch (error) {
      console.error("Subscription error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
    group relative overflow-hidden
    rounded-2xl
    border border-light/10
    bg-secondary/60
    p-6
    backdrop-blur-sm
    transition-all duration-300
    hover:-translate-y-1
    hover:border-blue/50
    hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)]
  "
    >
      {/*================ Subtle glow =============*/}
      <div
        className="
      pointer-events-none absolute -right-16 -top-16
      h-32 w-32 rounded-full
      bg-blue/10 blur-3xl
      opacity-0 transition-opacity duration-300
      group-hover:opacity-100
    "
      />

      <div className="relative flex h-full flex-col">
        {/*============= Plan Header ================*/}
        <div className="border-b border-light/10 pb-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold tracking-tight text-light">
              {plan.name}
            </h3>

            {/*============= Optional badge ================*/}
            {plan.name === "Pro" && (
              <span className="rounded-full bg-[#8aa3ff]/10 px-2.5 py-1 text-[10px] font-semibold text-[#8aa3ff]">
                POPULAR
              </span>
            )}
          </div>

          {/*============= Price ================*/}
          <div className="mt-4 flex items-end gap-1">
            <span className="text-4xl font-bold tracking-tight text-light">
              ${plan.price}
            </span>

            <span className="mb-1 text-sm text-light/50">
              / {plan.duration} {plan.durationUnit}
            </span>
          </div>

          <p className="mt-2 text-sm text-light/50">
            Everything you need to manage your subscription.
          </p>
        </div>

        {/*============= Features ================*/}
        <div className="flex-1 py-6">
          <p className="mb-4 text-sm font-medium text-light">What's included</p>

          <ul className="space-y-3">
            {plan.features.map((feature, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm leading-5 text-light/70"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue/10">
                  <Check className="h-3 w-3 text-blue" />
                </span>

                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/*============= CTA ================*/}
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="
        w-full rounded-lg
        bg-blue px-4 py-2.5
        text-sm font-semibold
        text-secondary
        transition-all duration-300
        hover:bg-blue/90
        hover:shadow-[0_8px_25px_rgba(80,120,255,0.2)]
        disabled:cursor-not-allowed
        disabled:opacity-60
      "
        >
          {loading ? "Processing..." : "Subscribe Plan"}
        </button>
      </div>
    </div>
  );
};

export default PlanCard;
