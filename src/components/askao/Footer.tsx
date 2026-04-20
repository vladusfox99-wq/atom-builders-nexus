import Logo from "@/components/askao/Logo";

const Footer = () => (
  <footer className="border-t border-border bg-navy-deep py-12">
    <div className="container">
      <div className="grid md:grid-cols-3 gap-8 items-center">
        <Logo imageClassName="h-12" />
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
