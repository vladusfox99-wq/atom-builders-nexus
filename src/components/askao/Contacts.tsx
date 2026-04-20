import { MapPin, Phone, Mail, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const Contacts = () => {
  const [form, setForm] = useState({ name: "", company: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Запрос отправлен", description: "Мы свяжемся с вами в ближайшее время." });
    setForm({ name: "", company: "", email: "", message: "" });
  };

  return (
    <section id="contacts" className="relative py-24 md:py-32 bg-navy">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <div className="section-label mb-6">Контакты</div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
              Свяжитесь с <span className="text-gradient">нами</span>
            </h2>
            <p className="mt-6 text-muted-foreground text-lg max-w-md">Мы открыты к диалогу с компаниями, готовыми к участию в стратегических проектах отрасли.</p>

            <div className="mt-12 space-y-6">
              {[
                { icon: MapPin, label: "Адрес", value: "Москва, ул. Большая Ордынка, 24" },
                { icon: Phone, label: "Телефон", value: "+7 (495) 000-00-00" },
                { icon: Mail, label: "Email", value: "info@askao.ru" },
              ].map((c) => (
                <div key={c.label} className="flex items-start gap-5 group">
                  <div className="flex-shrink-0 w-12 h-12 grid place-items-center bg-navy-deep border border-border group-hover:border-primary transition-colors">
                    <c.icon size={20} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">{c.label}</div>
                    <div className="font-display text-lg font-semibold mt-1">{c.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-navy-deep border border-border p-8 md:p-10 space-y-5">
            <div className="text-xs font-mono uppercase tracking-widest text-primary mb-2">/ Форма обратной связи</div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground">Имя</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-2 w-full bg-transparent border-b border-border focus:border-primary outline-none py-2 text-foreground transition-colors" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground">Компания</label>
                <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="mt-2 w-full bg-transparent border-b border-border focus:border-primary outline-none py-2 text-foreground transition-colors" />
              </div>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Email</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-2 w-full bg-transparent border-b border-border focus:border-primary outline-none py-2 text-foreground transition-colors" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Сообщение</label>
              <textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-2 w-full bg-transparent border-b border-border focus:border-primary outline-none py-2 text-foreground transition-colors resize-none" />
            </div>
            <button type="submit" className="group w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-primary text-primary-foreground font-semibold hover:bg-primary-glow transition-all hover:shadow-glow mt-4">
              Отправить запрос
              <Send size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contacts;
