import { useState } from "react";
import { Compass, Cog, Building2, Network, Box } from "lucide-react";

const items = [
  { icon: Compass, title: "Проектирование", text: "Разработка проектной документации для объектов любой сложности с соблюдением требований ядерной и радиационной безопасности." },
  { icon: Cog, title: "Инжиниринг", text: "Полный спектр инжиниринговых услуг — от технико-экономического обоснования до сопровождения эксплуатации." },
  { icon: Building2, title: "Строительство", text: "Возведение объектов использования атомной энергии под ключ, включая монтаж сложного технологического оборудования." },
  { icon: Network, title: "Управление проектами", text: "Координация участников, контроль сроков и бюджетов, риск-менеджмент на всех этапах жизненного цикла." },
  { icon: Box, title: "Цифровое моделирование (BIM)", text: "Информационное моделирование зданий, цифровые двойники, единая среда общих данных." },
];

const Competencies = () => {
  const [active, setActive] = useState(0);
  const Active = items[active].icon;
  return (
    <section id="competencies" className="relative py-24 md:py-32">
      <div className="container">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <div className="section-label mb-6">Компетенции</div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
              Полный цикл <br /> от <span className="text-gradient">идеи</span> до объекта
            </h2>
            <p className="mt-6 text-muted-foreground text-lg">Совокупная экспертиза участников ассоциации покрывает все этапы реализации сложнейших инфраструктурных проектов.</p>
          </div>

          <div className="lg:col-span-7">
            <div className="grid gap-px bg-border border border-border">
              {items.map((it, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={it.title}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => setActive(i)}
                    className={`text-left p-6 md:p-8 transition-all duration-500 ${isActive ? "bg-navy-light" : "bg-navy-deep hover:bg-navy"}`}
                  >
                    <div className="flex items-start gap-6">
                      <div className={`flex-shrink-0 transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                        <it.icon size={28} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline justify-between gap-4">
                          <h3 className="font-display text-xl md:text-2xl font-semibold">{it.title}</h3>
                          <span className="text-xs font-mono text-muted-foreground">/ 0{i + 1}</span>
                        </div>
                        <div className={`grid transition-all duration-500 ${isActive ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0"}`}>
                          <p className="overflow-hidden text-sm text-muted-foreground leading-relaxed">{it.text}</p>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Competencies;
