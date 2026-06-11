import { useState } from "react";

const LEGAL_FORMS = new Set([
  "АО", "ООО", "ЗАО", "ПАО", "ОАО", "НАО", "СЗАО", "ФГУП", "ФЯО",
  "НПК", "НПО", "НПП", "НПЦ", "ГК", "ИК", "УК", "ТД", "ХК", "АКБ", "СК", "ГСК",
]);

const getInitials = (name: string) => {
  const words = name
    .replace(/[«»"'()]/g, " ")
    .trim()
    .split(/\s+/)
    .filter((w) => w && !LEGAL_FORMS.has(w.toUpperCase()));
  const initials = words.slice(0, 2).map((w) => w[0]).join("");
  return (initials || name.slice(0, 2)).toUpperCase();
};

interface MemberLogoProps {
  src: string;
  name: string;
  className?: string;
}

const MemberLogo = ({ src, name, className = "" }: MemberLogoProps) => {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`flex items-center justify-center bg-white p-3 ${className}`}>
      {failed || !src ? (
        <span className="select-none font-display text-xl font-bold tracking-wider text-navy-deep" aria-label={name}>
          {getInitials(name)}
        </span>
      ) : (
        <img
          src={src}
          alt={name}
          loading="lazy"
          className="max-h-full max-w-full object-contain"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
};

export default MemberLogo;
