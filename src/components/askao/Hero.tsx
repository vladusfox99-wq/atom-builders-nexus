import heroImg from "@/assets/hero-nuclear.jpg";
import { ArrowUpRight, Zap } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-end overflow-hidden pt-32 pb-20">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={heroImg} alt="Строительство АЭС" width={1920} height={1080} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid bg-grid-fade opacity-30" />

      {/* Decorative elements */}
      <div className="absolute top-32 right-8 hidden md:flex flex-col items-end gap-2 text-xs font-mono text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-primary animate-pulse-glow" />
          <span>SYSTEM ONLINE · 2025</span>
        </div>
        <div>52°N / 38°E · РОССИЯ</div>
      </div>

      <div className="container relative z-10">
        <div className="max-w-5xl">
          <div className="section-label mb-8 animate-fade-in">Ассоциация · с 2009</div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight text-foreground animate-fade-in-up">
            АСКАО — <span className="text-gradient">ядро</span> строительного комплекса <br className="hidden md:block" />
            атомной отрасли
          </h1>

          <p className="mt-8 max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
            Объединяем ведущие проектные, инжиниринговые и подрядные организации для реализации крупнейших инфраструктурных проектов России и зарубежья.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <a href="#cta" className="group inline-flex items-center justify-between gap-6 px-7 py-5 bg-primary text-primary-foreground font-semibold hover:bg-primary-glow transition-all hover:shadow-glow">
              <span className="flex items-center gap-3">
                <Zap size={18} /> Стать участником
              </span>
              <ArrowUpRight size={18} className="transition-transform group-hover:rotate-45" />
            </a>
            <a href="#contacts" className="group inline-flex items-center justify-between gap-6 px-7 py-5 border border-border bg-background/30 backdrop-blur-sm text-foreground font-semibold hover:bg-secondary transition-all">
              <span>Оставить запрос</span>
              <ArrowUpRight size={18} className="transition-transform group-hover:rotate-45" />
            </a>
          </div>

          {/* Bottom stats strip */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-border border border-border animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
            {[
              { v: "100+", l: "компаний" },
              { v: "70%", l: "работ Росатома" },
              { v: "15+", l: "лет в отрасли" },
              { v: "10+", l: "стран присутствия" },
            ].map((s) => (
              <div key={s.l} className="bg-navy-deep/80 backdrop-blur-md p-6">
                <div className="font-display text-3xl md:text-4xl font-bold text-foreground">{s.v}</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
