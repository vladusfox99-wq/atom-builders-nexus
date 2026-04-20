import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Navbar from "@/components/askao/Navbar";
import Footer from "@/components/askao/Footer";
import { newsItems } from "@/content/news";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const NewsPage = () => {
  useEffect(() => {
    document.title = "Новости АСКАО — события, форумы, инициативы отрасли";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "Новости Ассоциации организаций строительного комплекса атомной отрасли: форумы, заседания, проекты и инициативы.",
      );
    }
  }, []);

  const [featured, ...rest] = newsItems;

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

          <div className="section-label mb-6">Новости и события</div>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.02] tracking-tight max-w-4xl">
            Хроника <span className="text-gradient">атомной стройки</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Заседания, форумы, отраслевые инициативы и достижения членов ассоциации — всё, что формирует повестку строительного комплекса атомной отрасли.
          </p>
        </div>
      </section>

      {featured && (
        <section className="py-16 md:py-20 border-b border-border">
          <div className="container">
            <article className="grid gap-10 md:grid-cols-12">
              <div className="md:col-span-4 flex flex-col gap-4">
                <span className="inline-flex w-fit border border-primary/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary">
                  Главное · {featured.tag}
                </span>
                <div className="font-mono text-sm text-muted-foreground">{formatDate(featured.date)}</div>
              </div>
              <div className="md:col-span-8">
                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
                  {featured.title}
                </h2>
                <p className="mt-6 text-lg text-muted-foreground leading-relaxed">{featured.excerpt}</p>
                <div className="mt-8 space-y-4 text-base text-foreground/80 leading-relaxed">
                  {featured.content.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </section>
      )}

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mb-10 flex items-end justify-between">
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Все материалы</h2>
            <span className="font-mono text-xs text-muted-foreground">{rest.length.toString().padStart(2, "0")} публикаций</span>
          </div>

          <div className="grid gap-px border border-border bg-border">
            {rest.map((item) => (
              <article
                key={item.slug}
                className="group grid gap-6 bg-navy-deep p-6 md:p-8 transition-all duration-500 hover:bg-navy-light md:grid-cols-12 md:items-start"
              >
                <div className="md:col-span-2 flex flex-col gap-2">
                  <span className="inline-flex w-fit border border-primary/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary">
                    {item.tag}
                  </span>
                  <div className="font-mono text-xs text-muted-foreground">{formatDate(item.date)}</div>
                </div>
                <div className="md:col-span-9">
                  <h3 className="font-display text-xl md:text-2xl font-semibold leading-snug transition-colors group-hover:text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-base text-muted-foreground leading-relaxed">{item.excerpt}</p>
                </div>
                <ArrowUpRight
                  className="md:col-span-1 ml-auto text-muted-foreground transition-all group-hover:rotate-45 group-hover:text-primary"
                  size={24}
                />
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default NewsPage;
