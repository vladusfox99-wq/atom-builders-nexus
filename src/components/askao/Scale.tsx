const stats = [
  { v: "100+", l: "компаний-участников", d: "Крупнейшие проектные, инжиниринговые и строительные организации" },
  { v: "70%", l: "строительных работ Росатома", d: "Доля работ, выполняемых членами ассоциации" },
  { v: "30+", l: "международных проектов", d: "АЭС, НИЦ и индустриальные объекты по всему миру" },
  { v: "15K+", l: "квалифицированных специалистов", d: "Инженеров, проектировщиков и строителей в команде" },
];

const Scale = () => (
  <section id="scale" className="relative py-24 md:py-32 bg-navy-deep overflow-hidden">
    <div className="absolute inset-0 bg-grid bg-grid-fade opacity-20" />
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />

    <div className="container relative">
      <div className="text-center max-w-3xl mx-auto mb-20">
        <div className="section-label mb-6 justify-center [&::before]:hidden">Масштаб</div>
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
          Масштаб, измеримый <br /> в <span className="text-gradient">цифрах</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border">
        {stats.map((s, i) => (
          <div key={s.l} className="bg-navy-deep p-8 md:p-10 group hover:bg-navy-light transition-colors duration-500 relative">
            <div className="text-xs font-mono text-primary mb-6">/ 0{i + 1}</div>
            <div className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-none text-gradient">{s.v}</div>
            <div className="mt-4 font-display text-lg font-semibold text-foreground">{s.l}</div>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.d}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Scale;
