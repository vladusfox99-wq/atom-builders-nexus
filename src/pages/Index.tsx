import Navbar from "@/components/askao/Navbar";
import Hero from "@/components/askao/Hero";
import About from "@/components/askao/About";
import Activities from "@/components/askao/Activities";
import Competencies from "@/components/askao/Competencies";
import Scale from "@/components/askao/Scale";
import Members from "@/components/askao/Members";
import Innovations from "@/components/askao/Innovations";
import Benefits from "@/components/askao/Benefits";
import News from "@/components/askao/News";
import Contacts from "@/components/askao/Contacts";
import Footer from "@/components/askao/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background text-foreground font-body overflow-x-hidden">
      <Navbar />
      <Hero />
      <About />
      <Activities />
      <Competencies />
      <Scale />
      <Members />
      <Innovations />
      <Benefits />
      <News />
      <Contacts />
      <Footer />
    </main>
  );
};

export default Index;
