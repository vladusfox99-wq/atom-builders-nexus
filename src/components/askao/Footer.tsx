const Footer = () => (
  <footer className="border-t border-border bg-navy-deep py-12">
    <div className="container">
      <div className="grid md:grid-cols-3 gap-8 items-center">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 grid place-items-center bg-gradient-accent">
            <div className="absolute inset-[3px] bg-navy-deep grid place-items-center">
              <span className="font-display font-bold text-primary text-lg leading-none">А</span>
            </div>
          </div>
          <div>
            <div className="font-display font-bold">АСКАО</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Атомная отрасль</div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground text-center max-w-md mx-auto">
          Ассоциация организаций строительного комплекса атомной отрасли
        </p>
        <div className="text-sm text-muted-foreground md:text-right">
          © {new Date().getFullYear()} АСКАО. Все права защищены.
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
