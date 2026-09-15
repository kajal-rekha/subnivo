import PlanCard from "@/components/PlanCard";
import Loading from "@/components/ui/Loading";
import { useEffect, useState } from "react";

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [subscription, setsubscription] = useState([]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/plans");
      if (!res.ok) {
        throw new Error(`Failed to fetch plans (${res.status})`);
      }
      const data = await res.json();

      const order = ["Free", "Basic", "Standard", "Pro"];
      const sortedPlans = data.sort(
        (a, b) => order.indexOf(a.name) - order.indexOf(b.name),
      );

      setPlans(sortedPlans);
      console.log("plans fetched:", sortedPlans);
    } catch (err) {
      console.error("Error fetching plans:", err);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchPlans();
  }, []);

  // const colors = {
  //     Free: "border-gray-100  bg-gray-500 text-black",
  //     Basic: "border-blue-500 bg-blue-900 text-black",
  //     Standard: "border-green-900 bg-green-500 text-black",
  //     Pro: "border-white bg-purple-500 text-black",
  // };

  // const fetchSubscription = async () => {
  //     try {
  //         const res = await fetch("/api/subscriptions");
  //         if (!res) {
  //             throw new Error("Failed to fetch plans");
  //         }
  //         const data = await res.json();
  //         setsubscription(data);
  //         console.log("subscription fetched:", data);
  //     } catch (err) {
  //         console.error("Error fetching plans:", err);
  //     }
  // };
  // useEffect(() => {
  //     fetchSubscription();
  // }, []);

  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="wrapper">
        <div className="mb-12 flex flex-col items-center justify-center gap-1">
          <span className=" text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8aa3ff]">
            Pricing
          </span>
          <h2 className="text-2xl font-black leading-tight tracking-[-0.04em] text-white sm:text-3xl md:text-[2.5rem]">
            Choose the Right Plan for You
          </h2>
          <p className="mx-auto mt-4  text-sm leading-6 text-slate-300 md:text-base">
            Choose the perfect plan for your goals—start small or scale with
            confidence.
          </p>
        </div>

        {loading ? (
          <Loading />
        ) : plans.length === 0 ? (
          <p className="mt-2 text-center text-lg text-light/80">
            No plans found!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-8  ">
            {plans.map((plan) => (
              <PlanCard key={plan._id} plan={plan} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Plans;
