import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import Plans from "./plans";

const HomePage = () => {
  return (
    <div className="wrapper min-h-screen ">
      <Hero />
      <Features />
      <Plans />
      <Work />
    </div>
  );
};

export default HomePage;
