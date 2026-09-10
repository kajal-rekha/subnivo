import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  LayoutDashboard,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Choose a Plan",
    description: "Pick the plan that fits your needs and workflow.",
    icon: CheckCircle2,
  },
  {
    number: "02",
    title: "Make a Secure Payment",
    description: "Complete your payment securely with Stripe.",
    icon: CreditCard,
  },
  {
    number: "03",
    title: "Manage Your Subscription",
    description:
      "Access your dashboard and manage your subscription with ease.",
    icon: LayoutDashboard,
  },
];

const Work = () => {
  return (
    <section className="wrapper py-10 md:py-16">
      {/*================== Heading =====================*/}
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7aa7ff] md:text-sm">
          How It Works
        </p>

        <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-white md:text-5xl">
          Get Started in 3 Simple Steps
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-400 md:text-base">
          Everything you need to get started and manage your subscription in one
          place.
        </p>
      </div>

      {/*================== Steps =====================*/}
      <div className="mx-auto mt-12 flex max-w-[1100px] flex-col gap-10 md:flex-row md:items-start md:justify-between md:gap-4">
        {steps.map(({ number, title, description, icon: Icon }, index) => (
          <div
            key={title}
            className="relative flex flex-1 flex-col items-center text-center"
          >
            {/*================== Arrow =====================*/}
            {index < steps.length - 1 && (
              <div className="absolute left-[calc(50%+105px)] top-7 hidden items-center md:flex">
                <div className="h-px w-14 bg-linear-to-r from-[#3d568c] to-transparent" />
                <ArrowRight className="-ml-1 h-4 w-4 text-[#6076a8]" />
              </div>
            )}

            {/*================== Step Number =====================*/}
            <span className="mb-3 text-xs font-bold tracking-[0.2em] text-[#7aa7ff]">
              STEP {number}
            </span>

            {/*================== Icon =====================*/}
            <div
              className="
                flex h-16 w-16 items-center justify-center
                rounded-2xl
                border border-[#3d568c]
                bg-[#0d1830]
                text-[#7aa7ff]
                shadow-[0_0_30px_rgba(71,116,255,0.12)]
                transition-all duration-300
                hover:border-[#7aa7ff]/70
                hover:shadow-[0_0_35px_rgba(71,116,255,0.22)]
              "
            >
              <Icon className="h-7 w-7" />
            </div>

            {/*================== Content =====================*/}
            <h3 className="mt-5 text-lg font-semibold text-white md:text-xl">
              {title}
            </h3>

            <p className="mt-3 max-w-[270px] text-sm leading-6 text-slate-400">
              {description}
            </p>
          </div>
        ))}
      </div>

      {/*================== CTA =====================*/}
      <div
        className="
          relative mx-auto mt-14 max-w-[1200px] overflow-hidden
          rounded-2xl
          border border-[#4d69b7]/50
          bg-[linear-gradient(110deg,rgba(13,23,42,0.95),rgba(20,39,72,0.85))]
          px-6 py-7
          shadow-[0_25px_60px_rgba(2,6,20,0.4)]
          md:mt-20 md:flex md:items-center md:justify-between md:px-10 md:py-9
        "
      >
        {/*================== Background Grid ===================*/}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-size-[30px_30px]" />

        <div className="relative max-w-2xl">
          <h3 className="text-2xl font-black tracking-[-0.04em] text-white md:text-4xl">
            Ready to manage your subscriptions smarter?
          </h3>

          <p className="mt-3 text-sm leading-6 text-slate-300 md:text-base">
            Get started with Subnivo and manage your plans, payments, and
            subscriptions from one place.
          </p>
        </div>

        <div className="relative mt-6 md:mt-0 md:pl-8">
          <button
            className="
              inline-flex items-center gap-2
              rounded-xl
              bg-linear-to-r from-[#5f8eff] to-[#4ea5ff]
              px-6 py-3.5
              text-sm font-semibold text-[#081225]
              shadow-[0_0_25px_rgba(94,142,255,0.35)]
              transition-all duration-300
              hover:-translate-y-0.5
              hover:shadow-[0_0_35px_rgba(94,142,255,0.5)]
            "
          >
            Get Started Now
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Work;
