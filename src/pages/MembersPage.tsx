import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import Navbar from "@/components/askao/Navbar";
import Footer from "@/components/askao/Footer";
import { members } from "@/content/members";

const MembersPage = () => {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("Все");

  useEffect(() => {
    document.title = "Члены ассоциации АСКАО — более 80 компаний атомной отрасли";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "Полный список членов АСКАО: проектные, инжиниринговые и подрядные организации, формирующие строительный комплекс атомной отрасли России.",
      );
    }
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    members.forEach((m) => m.category && set.add(m.category));
    return ["Все", ...Array.from(set).sort()];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members.filter((m) => {
      const matchesCategory = activeCategory === "Все" || m.category === activeCategory;
      const matchesQuery =
        !q || m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, activeCategory]);

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

          <div className="grid gap-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <div className="section-label mb-6">Члены ассоциации</div>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.02] tracking-tight">
                {members.length}+ компаний — <br />
                <span className="text-gradient">единый строительный комплекс</span>
              </h1>
            </div>
            <div className="md:col-span-4 space-y-2 md:text-right">
              <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Источник</div>
              <a
                href="https://xn--80aa3arm.xn--p1ai/members"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:text-primary-glow break-all"
              >
                askao.ru/members
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="sticky top-20 z-30 border-b border-border bg-navy-deep/85 backdrop-blur-xl">
        <div className="container py-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск по названию или описанию"
              className="w-full bg-navy border border-border pl-10 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-widest border transition-colors ${
                  activeCategory === cat
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container">
          <div className="mb-8 flex items-end justify-between">
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {filtered.length.toString().padStart(2, "0")} {filtered.length === 1 ? "компания" : "компаний"}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="border border-border p-12 text-center text-muted-foreground">
              Ничего не найдено. Попробуйте изменить запрос или сбросить фильтры.
            </div>
          ) : (
            <div className="grid gap-px bg-border border border-border md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((m) => (
                <article
                  key={m.name}
                  className="group flex flex-col bg-navy-deep p-6 transition-all duration-500 hover:bg-navy-light"
                >
                  <div className="mb-6 flex h-20 items-center">
                    <div className="flex h-20 w-32 items-center justify-center bg-background/40 p-3 border border-border">
                      <img
                        src={m.logo}
                        alt={m.name}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain opacity-80 transition-opacity duration-500 group-hover:opacity-100"
                        style={{ filter: "brightness(0) invert(1)" }}
                      />
                    </div>
                    {m.category && (
                      <span className="ml-auto border border-primary/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary">
                        {m.category}
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                    {m.name}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{m.description}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default MembersPage;
