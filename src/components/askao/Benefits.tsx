import { ArrowUpRight } from "lucide-react";

const benefits = [
  { n: "01", title: "Доступ к проектам", text: "Прямое участие в крупнейших инфраструктурных программах атомной отрасли." },
  { n: "02", title: "Отраслевые связи", text: "Прямой контакт с ключевыми участниками рынка и Госкорпорацией «Росатом»." },
  { n: "03", title: "Участие в стандартах", text: "Возможность влиять на разработку отраслевых норм и регламентов." },
  { n: "04", title: "Обмен опытом", text: "Площадка для совместной работы, форумов, семинаров и исследовательских инициатив." },
  { n: "05", title: "Усиление позиций", text: "Повышение узнаваемости, рейтинга и конкурентоспособности на рынке." },
];

const Benefits = () => (
  <section className="relative py-24 md:py-32">
    <div className="container">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="section-label mb-6 justify-center [&::before]:hidden">Преимущества</div>
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
          Что даёт <span className="text-gradient">членство</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {benefits.map((b) => (
          <div key={b.n} className="group relative p-8 border border-border bg-gradient-card hover:border-primary transition-all duration-500 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-8">
              <span className="font-display text-5xl font-bold text-primary/20 group-hover:text-primary transition-colors">{b.n}</span>
              <ArrowUpRight className="text-muted-foreground group-hover:text-primary group-hover:rotate-45 transition-all" size={20} />
            </div>
            <h3 className="font-display text-xl font-semibold mb-3">{b.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{b.text}</p>
          </div>
        ))}
        <a href="#cta" className="group relative p-8 border border-primary bg-gradient-accent hover:shadow-glow transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between min-h-[240px]">
          <ArrowUpRight className="text-primary-foreground group-hover:rotate-45 transition-transform self-end" size={32} />
          <div>
            <h3 className="font-display text-2xl font-bold text-primary-foreground mb-2">Подать заявку</h3>
            <p className="text-sm text-primary-foreground/80">Присоединяйтесь к ассоциации сегодня</p>
          </div>
        </a>
      </div>
    </div>
  </section>
);

export default Benefits;
