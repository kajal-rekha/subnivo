import { BarChart3, BadgeCheck, ShieldCheck, Zap } from "lucide-react";

const features = [
  {
    title: "Easy Subscription Management",
    description:
      "Upgrade, downgrade, or cancel your plan anytime with a simple, hassle-free experience.",
    icon: Zap,
    iconColor: "text-amber-400",
    iconBg: "bg-amber-400/10",
  },
  {
    title: "Secure Payments",
    description:
      "Process recurring transactions with reliable, protected payment workflows that keep your data safe.",
    icon: ShieldCheck,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-400/10",
  },
  {
    title: "Real-time Analytics",
    description:
      "Track revenue, performance, and customer activity with live insights tailored to your business.",
    icon: BarChart3,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-400/10",
  },
  {
    title: "24/7 Support",
    description:
      "Get help whenever you need it from a team focused on keeping your subscription operations smooth.",
    icon: BadgeCheck,
    iconColor: "text-violet-400",
    iconBg: "bg-violet-400/10",
  },
];

const Features = () => {
  return (
    <section className="py-16 md:py-20 lg:py-24">
      <div className="wrapper">
        {/*============= Section Header ================*/}
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8aa3ff]">
            Why choose Subnivo
          </p>

          <h2 className="text-2xl font-black leading-tight tracking-[-0.04em] text-white sm:text-3xl md:text-[2.5rem]">
            Everything You Need In One Place
          </h2>

          <p className="mx-auto mt-4  text-sm leading-6 text-slate-300 md:text-base">
            Powerful tools to manage subscriptions, payments, and accounts with
            ease.
          </p>
        </div>

        {/*============= Features ================*/}
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map(
            ({ title, description, icon: Icon, iconColor, iconBg }) => (
              <div
                key={title}
                className="
              group
              min-h-[220px]
              rounded-[22px]
              border border-transparent
              p-6
              text-left
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-[#2a3c5d]
              hover:bg-[#0d172a]/40
            "
              >
                <div
                  className={`
                mb-5
                flex h-11 w-11
                items-center justify-center
                rounded-xl
                ${iconBg}
                transition-transform
                duration-300
                group-hover:scale-105
              `}
                >
                  <Icon className={`h-5 w-5 ${iconColor}`} />
                </div>

                <h3 className="text-[1rem] font-semibold leading-[1.3] text-white md:text-[1.08rem]">
                  {title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {description}
                </p>
              </div>
            ),
          )}
        </div>

        {/*============= Section Divider ================*/}
        <div className="mx-auto mt-12 h-px w-[85%] max-w-5xl bg-linear-to-r from-transparent via-[#1b2331] to-transparent md:mt-16" />
      </div>
    </section>
  );
};

export default Features;
