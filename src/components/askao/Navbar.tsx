import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#about", label: "О нас" },
  { href: "#activities", label: "Деятельность" },
  { href: "#competencies", label: "Компетенции" },
  { href: "#scale", label: "Масштаб" },
  { href: "#members", label: "Участники" },
  { href: "#news", label: "Новости" },
  { href: "#contacts", label: "Контакты" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-navy-deep/85 backdrop-blur-xl border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-20">
        <a href="#" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 grid place-items-center bg-gradient-accent shadow-glow">
            <div className="absolute inset-[3px] bg-navy-deep grid place-items-center">
              <span className="font-display font-bold text-primary text-lg leading-none">А</span>
            </div>
          </div>
          <div className="leading-tight">
            <div className="font-display font-bold tracking-tight text-foreground">АСКАО</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Атомная отрасль</div>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <a
          href="#cta"
          className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary-glow transition-colors"
        >
          Стать участником
        </a>

        <button onClick={() => setOpen(!open)} className="lg:hidden p-2 text-foreground" aria-label="Меню">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-navy-deep/95 backdrop-blur-xl border-t border-border animate-fade-in">
          <nav className="container flex flex-col py-6 gap-4">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-base font-medium text-muted-foreground hover:text-foreground py-2">
                {l.label}
              </a>
            ))}
            <a href="#cta" onClick={() => setOpen(false)} className="mt-2 inline-flex items-center justify-center px-5 py-3 bg-primary text-primary-foreground font-semibold">
              Стать участником
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
