import bim from "@/assets/bim-tech.jpg";
import { Layers, Box, Workflow, Database } from "lucide-react";

const tech = [
  { icon: Box, title: "Цифровое строительство", text: "Сквозная цифровизация процессов от проектирования до эксплуатации." },
  { icon: Layers, title: "BIM-моделирование", text: "Единая информационная модель и цифровой двойник объекта." },
  { icon: Workflow, title: "Автоматизация процессов", text: "Роботизация рутинных операций и интеграция систем." },
  { icon: Database, title: "Управление данными", text: "Платформы общих данных и единая среда коллаборации." },
];

const Innovations = () => (
  <section className="relative py-24 md:py-32 bg-navy">
    <div className="container">
      <div className="grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 relative order-2 lg:order-1">
          <div className="relative aspect-[4/3] overflow-hidden border border-border">
            <img src={bim} alt="BIM модель" loading="lazy" width={1280} height={800} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-tr from-navy-deep/80 via-transparent to-transparent" />
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between text-xs font-mono">
              <span className="text-primary">BIM_MODEL.v3.4</span>
              <span className="text-muted-foreground flex items-center gap-2">
                <span className="w-2 h-2 bg-primary animate-pulse-glow rounded-full" /> LIVE
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 order-1 lg:order-2">
          <div className="section-label mb-6">Инновации</div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
            Технологии, <br /> меняющие <span className="text-gradient">отрасль</span>
          </h2>
          <p className="mt-6 text-muted-foreground text-lg">Активное внедрение цифровых решений и индустриальных платформ нового поколения.</p>

          <div className="mt-10 grid sm:grid-cols-2 gap-px bg-border border border-border">
            {tech.map((t) => (
              <div key={t.title} className="bg-navy-deep p-6 hover:bg-navy-light transition-colors group">
                <t.icon size={22} className="text-primary mb-3 group-hover:scale-110 transition-transform" />
                <div className="font-display font-semibold mb-1">{t.title}</div>
                <p className="text-xs text-muted-foreground leading-relaxed">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Innovations;
