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
import { SITE_URL, usePageSeo } from "@/lib/seo";

const homeStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "АСКАО",
  alternateName: "Ассоциация организаций строительного комплекса атомной отрасли",
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/favicon.png`,
  description:
    "Ассоциация объединяет 120+ организаций строительного комплекса атомной отрасли России.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Москва",
    streetAddress: "ул. Обручева, д. 30/1, стр. 1, 6 этаж",
    addressCountry: "RU",
  },
  email: "accni@mail.ru",
  telephone: "+7-495-795-71-87",
  sameAs: [
    "https://t.me/accninews",
    "https://max.ru/join/GsaOLIijRQrcm_CwFQ9Xq_A6x0UXeBkxHP6WhGaTQKI",
  ],
};

const Index = () => {
  usePageSeo({
    title: "АСКАО — Ассоциация строительного комплекса атомной отрасли",
    description:
      "АСКАО объединяет 120+ организаций строительного комплекса атомной отрасли России для реализации крупнейших инфраструктурных проектов.",
    path: "/",
    structuredData: homeStructuredData,
  });

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
