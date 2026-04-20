import { ArrowUpRight } from "lucide-react";

const news = [
  { tag: "Заседание", date: "12 Апр 2025", title: "Совет ассоциации обсудил итоги 2024 года и стратегию развития до 2030 года" },
  { tag: "Форум", date: "28 Мар 2025", title: "АТОМЭКСПО 2025: АСКАО представила цифровые решения для строительства АЭС" },
  { tag: "Проект", date: "15 Мар 2025", title: "Старт работ на новом блоке Курской АЭС-2 с участием членов ассоциации" },
  { tag: "Инициатива", date: "02 Мар 2025", title: "Запущена программа подготовки кадров для строительства атомных объектов за рубежом" },
];

const News = () => (
  <section id="news" className="relative py-24 md:py-32 bg-navy">
    <div className="container">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
        <div>
          <div className="section-label mb-6">Деятельность</div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
            Новости и <span className="text-gradient">события</span>
          </h2>
        </div>
        <a href="#" className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-glow transition-colors">
          Все новости <ArrowUpRight size={18} />
        </a>
      </div>

      <div className="grid gap-px bg-border border border-border">
        {news.map((n, i) => (
          <a key={i} href="#" className="group bg-navy-deep p-6 md:p-8 hover:bg-navy-light transition-all duration-500 grid md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-2 flex items-center gap-3">
              <span className="px-3 py-1 text-[10px] uppercase tracking-widest font-semibold border border-primary/40 text-primary">{n.tag}</span>
            </div>
            <div className="md:col-span-2 text-sm font-mono text-muted-foreground">{n.date}</div>
            <h3 className="md:col-span-7 font-display text-lg md:text-xl font-semibold leading-snug group-hover:text-primary transition-colors">{n.title}</h3>
            <ArrowUpRight className="md:col-span-1 ml-auto text-muted-foreground group-hover:text-primary group-hover:rotate-45 transition-all" size={22} />
          </a>
        ))}
      </div>
    </div>
  </section>
);

export default News;
