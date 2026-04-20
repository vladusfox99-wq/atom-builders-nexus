import engineers from "@/assets/engineers.jpg";
import { CheckCircle2 } from "lucide-react";

const points = [
  "Крупнейшая ассоциация строительного комплекса атомной отрасли России",
  "Более 100 компаний — от проектных до подрядных организаций",
  "Прямое участие в программах Госкорпорации «Росатом»",
  "Полный цикл компетенций: от концепции до ввода в эксплуатацию",
];

const About = () => (
  <section id="about" className="relative py-24 md:py-32">
    <div className="absolute inset-0 bg-gradient-radial opacity-50" />
    <div className="container relative">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="section-label mb-6">О компании</div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
            Консолидация отрасли <br /> ради <span className="text-gradient">сложных задач</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            АСКАО формирует профессиональные команды и аккумулирует ресурсы для реализации стратегических объектов использования атомной энергии в России и за рубежом.
          </p>
          <ul className="mt-10 space-y-4">
            {points.map((p) => (
              <li key={p} className="flex gap-4 group">
                <CheckCircle2 className="flex-shrink-0 text-primary mt-0.5 group-hover:scale-110 transition-transform" size={22} />
                <span className="text-foreground/90">{p}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden border border-border shadow-card">
            <img src={engineers} alt="Инженеры на строительной площадке" loading="lazy" width={1280} height={900} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="text-xs font-mono uppercase tracking-widest text-primary mb-2">Зона строительства</div>
              <div className="font-display text-2xl font-semibold">Атомная энергетика нового поколения</div>
            </div>
          </div>
          <div className="absolute -top-6 -right-6 hidden md:block bg-navy-light border border-border p-6 max-w-[200px] shadow-elevated">
            <div className="font-display text-4xl font-bold text-primary">15+</div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">лет опыта в отраслевой консолидации</div>
          </div>
          <div className="absolute -bottom-6 -left-6 hidden md:block bg-primary p-6 max-w-[200px]">
            <div className="font-display text-4xl font-bold text-primary-foreground">№1</div>
            <div className="text-xs uppercase tracking-wider text-primary-foreground/80 mt-1">в строительстве объектов атомной отрасли</div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default About;
