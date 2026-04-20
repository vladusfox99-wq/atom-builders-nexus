import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/askao/Navbar";
import Footer from "@/components/askao/Footer";
import aboutHistoryImage from "@/assets/about-history.png";

const AboutPage = () => {
  useEffect(() => {
    document.title = "О нас — АСКАО";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "История Ассоциации организаций строительного комплекса атомной отрасли и ключевые принципы деятельности АСКАО.",
      );
    }
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground font-body overflow-x-hidden">
      <Navbar />

      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 border-b border-border">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="container relative">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-primary transition-colors mb-10"
          >
            <ArrowLeft size={16} /> На главную
          </Link>

          <div className="section-label mb-6">Об АСКАО</div>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.02] tracking-tight max-w-4xl">
            История <span className="text-gradient">Ассоциации</span>
          </h1>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container grid gap-10 lg:grid-cols-12 lg:items-center">
          <article className="lg:col-span-6 space-y-6">
            <h2 className="font-display text-3xl md:text-4xl font-semibold leading-tight">История Ассоциации</h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Решение о создании Ассоциации было принято генеральным директором Госкорпорации «Росатом» Лихачёвым А.Е.
              по итогам первой конференции представителей строительного комплекса атомной отрасли в ноябре 2017 года.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              АСКАО является корпоративной некоммерческой организацией, основанной на добровольном членстве.
              Ассоциация берет на себя содействие в консолидации ресурсов членов ассоциации и формирование
              профессиональных команд из специалистов строительного комплекса для реализации проектов строительства
              объектов использования атомной энергии в России и за рубежом.
            </p>
          </article>

          <div className="lg:col-span-6">
            <div className="overflow-hidden border border-border bg-navy-deep shadow-[0_25px_60px_-25px_rgba(0,0,0,0.8)]">
              <img
                src={aboutHistoryImage}
                alt="История Ассоциации АСКАО"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default AboutPage;
