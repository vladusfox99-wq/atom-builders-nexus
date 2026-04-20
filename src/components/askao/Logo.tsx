import logoSrc from "@/assets/askao-logo.png";

type LogoProps = {
  className?: string;
  imageClassName?: string;
  subtitleClassName?: string;
};

const Logo = ({ className = "", imageClassName = "", subtitleClassName = "" }: LogoProps) => (
  <div className={`flex items-center gap-3 ${className}`.trim()}>
    <img
      src={logoSrc}
      alt="АСКАО"
      width={124}
      height={132}
      className={`h-12 w-auto object-contain ${imageClassName}`.trim()}
    />
    <div className="leading-tight">
      <div className="font-display font-bold tracking-tight text-foreground">АСКАО</div>
      <div className={`text-[10px] uppercase tracking-[0.18em] text-muted-foreground ${subtitleClassName}`.trim()}>
        Атомная отрасль
      </div>
    </div>
  </div>
);

export default Logo;
