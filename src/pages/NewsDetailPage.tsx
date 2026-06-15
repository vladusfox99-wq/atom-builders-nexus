import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, CalendarDays, Newspaper } from "lucide-react";
import Navbar from "@/components/askao/Navbar";
import Footer from "@/components/askao/Footer";
import { newsItems } from "@/content/news";
import { DEFAULT_OG_IMAGE, SITE_URL, usePageSeo } from "@/lib/seo";

const formatDate = (value: string) =>
  new Date(`${value}T00:00:00`).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const NewsDetailPage = () => {
  const { slug } = useParams();
  const item = newsItems.find((newsItem) => newsItem.slug === slug);
  const otherItems = newsItems.filter((newsItem) => newsItem.slug !== slug).slice(0, 3);

  usePageSeo({
    title: item ? `${item.title} — АСКАО` : "Новость не найдена — АСКАО",
    description:
      item?.excerpt ?? "Запрошенная новость не найдена на сайте АСКАО.",
    path: `/news/${slug ?? ""}`,
    type: item ? "article" : "website",
    noIndex: !item,
    publishedTime: item ? `${item.date}T00:00:00+03:00` : undefined,
    structuredData: item
      ? {
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: item.title,
          description: item.excerpt,
          datePublished: `${item.date}T00:00:00+03:00`,
          dateModified: `${item.date}T00:00:00+03:00`,
          mainEntityOfPage: `${SITE_URL}/news/${item.slug}`,
          image: DEFAULT_OG_IMAGE,
          inLanguage: "ru-RU",
          publisher: {
            "@type": "Organization",
            name: "АСКАО",
            url: `${SITE_URL}/`,
            logo: {
              "@type": "ImageObject",
              url: `${SITE_URL}/favicon.png`,
            },
          },
        }
      : undefined,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [slug]);

  if (!item) {
    return (
      <main className="min-h-screen overflow-x-hidden bg-background font-body text-foreground">
        <Navbar />
        <section className="relative flex min-h-[75vh] items-center border-b border-border pb-20 pt-32 md:pt-40">
          <div className="absolute inset-0 grid-pattern opacity-30" />
          <div className="container relative">
            <Newspaper className="text-primary" size={36} />
            <div className="mt-6 font-mono text-sm uppercase tracking-[0.2em] text-primary">
              Новость не найдена
            </div>
            <h1 className="mt-5 max-w-3xl font-display text-5xl font-bold leading-tight md:text-7xl">
              Материал был удалён или ссылка указана неверно
            </h1>
            <Link
              to="/news"
              className="mt-8 inline-flex items-center gap-3 border border-primary bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-glow"
            >
              <ArrowLeft size={18} />
              Вернуться к новостям
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-background font-body text-foreground">
      <Navbar />

      <article>
        <header className="relative border-b border-border pb-16 pt-32 md:pb-20 md:pt-40">
          <div className="absolute inset-0 grid-pattern opacity-30" />
          <div className="container relative">
            <Link
              to="/news"
              className="mb-10 inline-flex items-center gap-2 text-sm font-mono text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft size={16} /> Все новости
            </Link>

            <div className="flex flex-wrap items-center gap-4">
              <span className="border border-primary/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary">
                {item.tag}
              </span>
              <span className="inline-flex items-center gap-2 font-mono text-sm text-muted-foreground">
                <CalendarDays size={15} />
                {formatDate(item.date)}
              </span>
            </div>

            <h1 className="mt-7 max-w-5xl font-display text-4xl font-bold leading-[1.08] tracking-tight md:text-6xl lg:text-7xl">
              {item.title}
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              {item.excerpt}
            </p>
          </div>
        </header>

        <section className="py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl">
              <div className="space-y-6 text-base leading-[1.85] text-foreground/85 md:text-lg">
                {item.content.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-12 border-t border-border pt-8">
                <Link
                  to="/news"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-glow"
                >
                  <ArrowLeft size={17} />
                  Вернуться ко всем новостям
                </Link>
              </div>
            </div>
          </div>
        </section>
      </article>

      {otherItems.length > 0 && (
        <section className="border-t border-border bg-navy py-16 md:py-20">
          <div className="container">
            <div className="mb-8 flex items-end justify-between">
              <h2 className="font-display text-2xl font-semibold md:text-3xl">Другие материалы</h2>
              <Link
                to="/news"
                className="hidden items-center gap-2 text-sm font-semibold text-primary hover:text-primary-glow md:inline-flex"
              >
                Все новости <ArrowUpRight size={17} />
              </Link>
            </div>

            <div className="grid gap-px border border-border bg-border md:grid-cols-3">
              {otherItems.map((otherItem) => (
                <Link
                  key={otherItem.slug}
                  to={`/news/${otherItem.slug}`}
                  className="group flex flex-col bg-navy-deep p-6 transition-colors hover:bg-navy-light"
                >
                  <span className="w-fit border border-primary/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary">
                    {otherItem.tag}
                  </span>
                  <h3 className="mt-5 font-display text-xl font-semibold leading-snug transition-colors group-hover:text-primary">
                    {otherItem.title}
                  </h3>
                  <span className="mt-auto pt-6 font-mono text-xs text-muted-foreground">
                    {formatDate(otherItem.date)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
};

export default NewsDetailPage;
