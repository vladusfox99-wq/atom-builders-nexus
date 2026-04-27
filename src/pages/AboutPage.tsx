import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/askao/Navbar";
import Footer from "@/components/askao/Footer";
import aboutHistoryImage from "@/assets/about-history.png";
import malininPhoto from "@/assets/about-leader-malinin.png";

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

      <section className="pb-20 md:pb-24">
        <div className="container grid gap-10 lg:grid-cols-12 lg:items-start">
          <article className="lg:col-span-7 space-y-5">
            <div className="section-label">Руководители организации</div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold leading-tight">Малинин Сергей Михайлович</h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Опыт работы - 42 года, из них на руководящих должностях 37 лет.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Начиная с 2018 г. и по наст. время Сергей Михайлович занимает должность Генерального директора Ассоциации организаций строительного комплекса атомной отрасли (Объединяет крупные инжиниринговые и подрядные организации, задействованные в реализации проектов по сооружению объектов использования атомной энергии в РФ и за рубежом).
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Основные обязанности: консолидация организаций строительного комплекса атомной отрасли для реализации инвестиционной программы Госкорпорации «Росатом» по сооружению объектов использования атомной энергии в РФ и за рубежом, развитие международного сотрудничества в сфере строительства объектов использования атомной энергии, обмен профессиональным, управленческим опытом между членами Ассоциации.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              В настоящее время АСКАО успешно функционирует и включает в себя более 90 организаций.
            </p>
          </article>

          <div className="lg:col-span-5">
            <div className="overflow-hidden border border-border bg-navy-deep shadow-[0_25px_60px_-25px_rgba(0,0,0,0.8)]">
              <img
                src={malininPhoto}
                alt="Малинин Сергей Михайлович"
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
