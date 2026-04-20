import { ArrowUpRight } from "lucide-react";

const CTA = () => (
  <section id="cta" className="relative py-24 md:py-32 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-radial" />
    <div className="absolute inset-0 bg-grid bg-grid-fade opacity-30" />

    <div className="container relative">
      <div className="max-w-5xl mx-auto text-center">
        <div className="section-label mb-8 justify-center [&::before]:hidden">Присоединяйтесь</div>
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.02] tracking-tight">
          Станьте частью <br />
          строительного комплекса <br />
          <span className="text-gradient">атомной отрасли</span>
        </h2>
        <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Присоединяйтесь к ассоциации, формирующей будущее атомного строительства в России и мире.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#contacts" className="group inline-flex items-center justify-center gap-3 px-8 py-5 bg-primary text-primary-foreground font-semibold hover:bg-primary-glow transition-all hover:shadow-glow">
            Подать заявку
            <ArrowUpRight size={18} className="transition-transform group-hover:rotate-45" />
          </a>
          <a href="#about" className="group inline-flex items-center justify-center gap-3 px-8 py-5 border border-border text-foreground font-semibold hover:bg-secondary transition-all">
            Узнать больше
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default CTA;
