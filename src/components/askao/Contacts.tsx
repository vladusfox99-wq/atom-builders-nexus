import { MapPin, Phone, Mail } from "lucide-react";

const address = 'г. Москва, ул. Обручева, д. 30/1, стр.1, ячейка 12 "АСКАО"';

const contacts = [
  {
    icon: Phone,
    label: "Телефоны",
    value: ["+7 (495) 795-71-87 доб. 205", "+7 (499) 949-43-95 доб. 3530"],
  },
  {
    icon: Mail,
    label: "Email",
    value: ["accni@mail.ru"],
  },
  {
    icon: MapPin,
    label: "Адрес",
    value: [address],
  },
];

const mapQuery = encodeURIComponent(address);

const Contacts = () => {
  return (
    <section id="contacts" className="relative py-24 md:py-32 bg-navy">
      <div className="container">
        <div className="max-w-6xl">
          <div className="section-label mb-6">Контакты</div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
            Свяжитесь с <span className="text-gradient">нами</span>
          </h2>
          <p className="mt-6 text-muted-foreground text-lg max-w-md">Актуальные контактные данные ассоциации.</p>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {contacts.map((c) => (
              <div key={c.label} className="flex items-start gap-5 group bg-navy-deep border border-border p-6">
                <div className="flex-shrink-0 w-12 h-12 grid place-items-center bg-background border border-border group-hover:border-primary transition-colors">
                  <c.icon size={20} className="text-primary" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">{c.label}</div>
                  <div className="mt-2 space-y-2">
                    {c.value.map((line) => (
                      <div key={line} className="font-display text-lg font-semibold leading-snug break-words">
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 overflow-hidden border border-border bg-navy-deep shadow-card">
            <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-primary">Локация</div>
                <div className="mt-2 font-display text-xl font-semibold text-foreground">{address}</div>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                target="_blank"
                rel="noreferrer"
                className="hidden md:inline-flex flex-shrink-0 items-center justify-center border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Открыть карту
              </a>
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/35 via-transparent to-transparent" />
              <iframe
                title="Карта офиса АСКАО"
                src={`https://www.google.com/maps?q=${mapQuery}&z=16&output=embed`}
                className="h-[520px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contacts;
