import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Plans from "./plans";
import HowItWorks from "@/components/HowItWorks";

const HomePage = () => {
  return (
    <div>
      <Hero />
      <Features />
      <Plans />
      <HowItWorks />
    </div>
  );
};

export default HomePage;
