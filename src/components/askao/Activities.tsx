import { Users2, Atom, Cpu, TrendingUp, BookOpen } from "lucide-react";

const items = [
  { icon: Users2, title: "Консолидация участников рынка", text: "Объединяем ключевых игроков отрасли для совместной реализации проектов." },
  { icon: Atom, title: "Реализация проектов ОИАЭ", text: "Полный спектр работ по объектам использования атомной энергии." },
  { icon: Cpu, title: "Внедрение цифровых технологий", text: "BIM-моделирование, цифровые двойники, автоматизация процессов." },
  { icon: TrendingUp, title: "Повышение эффективности", text: "Оптимизация процессов строительства и сокращение сроков." },
  { icon: BookOpen, title: "Развитие отраслевых стандартов", text: "Формирование нормативной базы и лучших практик отрасли." },
];

const Activities = () => (
  <section id="activities" className="relative py-24 md:py-32 bg-navy">
    <div className="container">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
        <div>
          <div className="section-label mb-6">Деятельность</div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight max-w-3xl">
            Чем занимается <span className="text-gradient">АСКАО</span>
          </h2>
        </div>
        <p className="text-muted-foreground max-w-md">Пять направлений, формирующих стратегическую повестку строительного комплекса атомной отрасли.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
        {items.map((it, i) => (
          <div key={it.title} className="group relative bg-navy-deep p-8 md:p-10 hover:bg-navy-light transition-colors duration-500 overflow-hidden">
            <div className="absolute top-6 right-6 text-xs font-mono text-muted-foreground">0{i + 1}</div>
            <div className="w-14 h-14 grid place-items-center bg-navy-light group-hover:bg-primary transition-colors duration-500 mb-6">
              <it.icon size={26} className="text-primary group-hover:text-primary-foreground transition-colors" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-3">{it.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{it.text}</p>
            <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-accent group-hover:w-full transition-all duration-700" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Activities;
