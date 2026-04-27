import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "@/components/askao/Logo";

const links = [
  { href: "/about", label: "О нас", isRoute: true },
  { href: "#activities", label: "Деятельность" },
  { href: "#competencies", label: "Компетенции" },
  { href: "#scale", label: "Масштаб" },
  { href: "/members", label: "Участники", isRoute: true },
  { href: "/clusters", label: "Кластеры", isRoute: true },
  { href: "/news", label: "Новости", isRoute: true },
  { href: "#contacts", label: "Контакты" },
];

const TelegramLogo = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
    <path d="M21.7 4.3c-.2-.2-.7-.3-1.3-.1L3.1 10.8c-1 .4-1 1-.2 1.2l4.4 1.4 1.7 5.2c.2.7.4 1 .7 1 .3 0 .5-.2.8-.5l2.4-2.3 4.7 3.4c.9.5 1.5.3 1.7-.8L22 5.8c.2-.8 0-1.3-.3-1.5Zm-3.2 2.8-8.7 7.8-.3 3-1-3.2-3.1-1L18.5 7Z" />
  </svg>
);

const MaxLogo = () => (
  <span className="text-[10px] font-black leading-none tracking-[0.14em]" aria-hidden="true">
    MAX
  </span>
);

const socialLinks = [
  { href: "https://t.me/accninews", label: "Telegram", Icon: TelegramLogo },
  { href: "https://max.ru/join/GsaOLIijRQrcm_CwFQ9Xq_A6x0UXeBkxHP6WhGaTQKI", label: "MAX", Icon: MaxLogo },
] as const;

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const sectionBase = location.pathname === "/" ? "" : "/";

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
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" className="group">
          <Logo imageClassName="h-14" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((link) =>
            link.isRoute ? (
              <Link
                key={link.href}
                to={link.href}
                className={`relative group text-sm font-medium transition-colors ${
                  location.pathname === link.href ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-primary transition-all duration-300 ${
                    location.pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ) : (
              <a
                key={link.href}
                href={`${sectionBase}${link.href}`}
                className="relative group text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
              </a>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          {socialLinks.map(({ href, label, Icon }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-navy-deep/70 text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
            >
              <Icon />
            </a>
          ))}

          <button onClick={() => setOpen(!open)} className="p-2 text-foreground lg:hidden" aria-label="Меню">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="animate-fade-in border-t border-border bg-navy-deep/95 backdrop-blur-xl lg:hidden">
          <nav className="container flex flex-col gap-4 py-6">
            {links.map((link) =>
              link.isRoute ? (
                <Link key={link.href} to={link.href} onClick={() => setOpen(false)} className="py-2 text-base font-medium text-muted-foreground hover:text-foreground">
                  {link.label}
                </Link>
              ) : (
                <a key={link.href} href={`${sectionBase}${link.href}`} onClick={() => setOpen(false)} className="py-2 text-base font-medium text-muted-foreground hover:text-foreground">
                  {link.label}
                </a>
              ),
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
