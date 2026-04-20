import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "@/components/askao/Logo";

const links = [
  { href: "/about", label: "О нас", isRoute: true },
  { href: "#activities", label: "Деятельность" },
  { href: "#competencies", label: "Компетенции" },
  { href: "#scale", label: "Масштаб" },
  { href: "#members", label: "Участники" },
  { href: "/news", label: "Новости", isRoute: true },
  { href: "#contacts", label: "Контакты" },
];

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
      <div className="container flex items-center justify-between h-20">
        <Link to="/" className="group">
          <Logo imageClassName="h-14" />
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
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
                <span className={`absolute -bottom-1 left-0 h-px bg-primary transition-all duration-300 ${location.pathname === link.href ? "w-full" : "w-0 group-hover:w-full"}`} />
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

        <button onClick={() => setOpen(!open)} className="lg:hidden p-2 text-foreground" aria-label="Меню">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-navy-deep/95 backdrop-blur-xl animate-fade-in">
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
