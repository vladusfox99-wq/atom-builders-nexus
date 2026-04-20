import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { newsItems } from "@/content/news";

const News = () => {
  const previewItems = newsItems.slice(0, 3);
  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <section id="news" className="relative py-24 md:py-32 bg-navy">
      <div className="container">
        <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="section-label mb-6">Новости</div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
              Новости и <span className="text-gradient">события</span>
            </h2>
          </div>
          <Link to="/news" className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-glow transition-colors">
            Все новости <ArrowUpRight size={18} />
          </Link>
        </div>

        <div className="grid gap-px border border-border bg-border">
          {previewItems.map((item) => (
            <Link key={item.slug} to="/news" className="group grid items-center gap-6 bg-navy-deep p-6 transition-all duration-500 hover:bg-navy-light md:grid-cols-12 md:p-8">
              <div className="md:col-span-2 flex items-center gap-3">
                <span className="border border-primary/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary">{item.tag}</span>
              </div>
              <div className="md:col-span-2 text-sm font-mono text-muted-foreground">{formatDate(item.date)}</div>
              <h3 className="md:col-span-7 font-display text-lg md:text-xl font-semibold leading-snug transition-colors group-hover:text-primary">{item.title}</h3>
              <ArrowUpRight className="md:col-span-1 ml-auto text-muted-foreground transition-all group-hover:rotate-45 group-hover:text-primary" size={22} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default News;
