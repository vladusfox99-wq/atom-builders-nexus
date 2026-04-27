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
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <div>
          <div className="section-label mb-6">О компании</div>
          <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
            Консолидация отрасли <br /> ради <span className="text-gradient">сложных задач</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            АСКАО формирует профессиональные команды и аккумулирует ресурсы для реализации стратегических объектов использования атомной энергии в России и за рубежом.
          </p>
          <ul className="mt-10 space-y-4">
            {points.map((p) => (
              <li key={p} className="group flex gap-4">
                <CheckCircle2 className="mt-0.5 flex-shrink-0 text-primary transition-transform group-hover:scale-110" size={22} />
                <span className="text-foreground/90">{p}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden border border-border shadow-card">
            <img
              src={engineers}
              alt="Инженеры на строительной площадке"
              loading="lazy"
              width={1280}
              height={900}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/20 to-transparent" />
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default About;
