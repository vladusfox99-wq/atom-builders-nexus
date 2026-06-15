import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, CalendarDays, Newspaper, UsersRound } from "lucide-react";
import Navbar from "@/components/askao/Navbar";
import Footer from "@/components/askao/Footer";
import { usePageSeo } from "@/lib/seo";

const usefulLinks = [
  {
    to: "/members",
    label: "Участники",
    description: "Полный список организаций ассоциации",
    icon: UsersRound,
  },
  {
    to: "/news",
    label: "Новости",
    description: "События и инициативы атомной отрасли",
    icon: Newspaper,
  },
  {
    to: "/events",
    label: "Календарь",
    description: "Ближайшие мероприятия АСКАО",
    icon: CalendarDays,
  },
];

const NotFound = () => {
  const location = useLocation();

  usePageSeo({
    title: "Страница не найдена — АСКАО",
    description:
      "Запрошенная страница не найдена. Перейдите на главную страницу сайта АСКАО.",
    path: location.pathname,
    noIndex: true,
  });

  return (
    <main className="min-h-screen overflow-x-hidden bg-background font-body text-foreground">
      <Navbar />

      <section className="relative flex min-h-[78vh] items-center border-b border-border pb-20 pt-32 md:pt-40">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />

        <div className="container relative">
          <div className="max-w-4xl">
            <div className="font-mono text-sm uppercase tracking-[0.25em] text-primary">
              Ошибка 404
            </div>
            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-7xl lg:text-8xl">
              Страница <span className="text-gradient">не найдена</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Возможно, адрес был изменён или страница больше не существует. Проверьте ссылку или вернитесь на
              главную.
            </p>

            <div className="mt-5 max-w-2xl overflow-hidden border border-border bg-navy-deep px-4 py-3 font-mono text-xs text-muted-foreground">
              {location.pathname}
            </div>

            <Link
              to="/"
              className="mt-8 inline-flex items-center gap-3 border border-primary bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-glow"
            >
              <ArrowLeft size={18} />
              Вернуться на главную
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container">
          <h2 className="font-display text-2xl font-semibold md:text-3xl">Полезные разделы</h2>
          <div className="mt-8 grid gap-px border border-border bg-border md:grid-cols-3">
            {usefulLinks.map(({ to, label, description, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="group bg-navy-deep p-6 transition-colors hover:bg-navy-light md:p-8"
              >
                <Icon className="text-primary" size={26} />
                <h3 className="mt-5 font-display text-xl font-semibold transition-colors group-hover:text-primary">
                  {label}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default NotFound;
