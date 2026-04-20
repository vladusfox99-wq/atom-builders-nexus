const companies = [
  "АТОМСТРОЙЭКСПОРТ", "АТОМЭНЕРГОПРОЕКТ", "АТОМПРОЕКТ", "ТИТАН-2", "СОЮЗАТОМСТРОЙ",
  "СТРОЙТРАНСНЕФТЕГАЗ", "ВНИПИЭТ", "АТОМТЕХЭНЕРГО", "НИКИМТ-АТОМСТРОЙ", "АЭМ-ТЕХНОЛОГИИ",
  "ЦКБМ", "СВЭЛ", "АТОММАШ", "ОКБМ АФРИКАНТОВ", "ГИДРОПРЕСС",
  "РОСАТОМ ОВЕРСИЗ", "ЦПТИ", "ЭНЕРГОСПЕЦМОНТАЖ", "АТОМЭНЕРГОМАШ", "СПБАЭП",
];

const row1 = [...companies.slice(0, 10), ...companies.slice(0, 10)];
const row2 = [...companies.slice(10), ...companies.slice(10)];

const Logo = ({ name }: { name: string }) => (
  <div className="flex-shrink-0 w-64 h-24 mx-2 grid place-items-center border border-border bg-navy-deep group hover:border-primary transition-colors">
    <span className="font-display font-semibold text-sm tracking-wider text-muted-foreground group-hover:text-primary transition-colors">{name}</span>
  </div>
);

const Members = () => (
  <section id="members" className="relative py-24 md:py-32 overflow-hidden">
    <div className="container mb-16">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <div className="section-label mb-6">Участники</div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
            Экосистема <br /> <span className="text-gradient">крупных игроков</span>
          </h2>
        </div>
        <p className="text-muted-foreground max-w-md">Более 100 компаний-лидеров, формирующих опорный каркас атомного строительства.</p>
      </div>
    </div>

    <div className="space-y-4">
      <div className="flex animate-ticker">{row1.map((c, i) => <Logo key={i} name={c} />)}</div>
      <div className="flex animate-ticker [animation-direction:reverse]">{row2.map((c, i) => <Logo key={i} name={c} />)}</div>
    </div>
  </section>
);

export default Members;
