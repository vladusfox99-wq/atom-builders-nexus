import { ExternalLink, Mail, MessageCircle, Phone, Send } from "lucide-react";
import askaoLogo from "@/assets/askao-logo.png";
import { SITE_URL, usePageSeo } from "@/lib/seo";

const personName = "Фролов Александр Викторович";
const personRole = "Советник Генерального Директора";
const portraitUrl = "/frolov-aleksandr-viktorovich.jpg";
const email = "avfrolov@accni.ru";
const phone = "+79031368183";
const formattedPhone = "+7 903 136-81-83";
const telegramUrl = "https://t.me/+79031368183";
const maxUrl = "https://max.ru/join/GsaOLIijRQrcm_CwFQ9Xq_A6x0UXeBkxHP6WhGaTQKI";
const cardPath = "/frolov";

const personStructuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: personName,
  jobTitle: personRole,
  image: `${SITE_URL}${portraitUrl}`,
  url: `${SITE_URL}${cardPath}`,
  email,
  telephone: phone,
  worksFor: {
    "@type": "Organization",
    name: "АСКАО",
    url: `${SITE_URL}/`,
  },
  sameAs: [telegramUrl, maxUrl],
};

const contactLinks = [
  {
    label: "Telegram",
    href: telegramUrl,
    Icon: Send,
    external: true,
    className: "bg-primary text-primary-foreground ring-1 ring-primary/30 hover:bg-primary-glow",
  },
  {
    label: "MAX",
    href: maxUrl,
    Icon: MessageCircle,
    external: true,
    className: "bg-secondary text-secondary-foreground ring-1 ring-border hover:bg-navy-light",
  },
  {
    label: email,
    href: `mailto:${email}`,
    Icon: Mail,
    className: "bg-secondary text-primary ring-1 ring-primary/20 hover:bg-navy-light",
  },
  {
    label: formattedPhone,
    href: `tel:${phone}`,
    Icon: Phone,
    className: "bg-card text-foreground ring-1 ring-border hover:bg-navy-light",
  },
];

const BusinessCardPage = () => {
  usePageSeo({
    title: `${personName} — визитка`,
    description: `${personRole}. Телефон, email, Telegram и MAX.`,
    path: cardPath,
    image: portraitUrl,
    structuredData: personStructuredData,
  });

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <section className="relative flex min-h-screen items-center justify-center px-5 py-8 sm:px-8">
        <div className="absolute inset-0 bg-gradient-radial" />
        <article className="relative grid w-full max-w-5xl overflow-hidden rounded-[28px] bg-gradient-card shadow-card ring-1 ring-border md:grid-cols-[0.9fr_1.1fr]">
          <div className="absolute right-4 top-4 z-10 rounded-2xl bg-white/92 px-3 py-2 shadow-[0_12px_30px_rgba(12,23,40,0.16)] ring-1 ring-slate-200/80 backdrop-blur sm:right-6 sm:top-6">
            <img src={askaoLogo} alt="АСКАО" className="h-12 w-auto object-contain sm:h-14" />
          </div>

          <div className="relative min-h-[300px] bg-navy-light md:min-h-[640px]">
            <img
              src={portraitUrl}
              alt={personName}
              className="h-full w-full object-cover object-center"
              loading="eager"
            />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background/40 to-transparent md:hidden" />
          </div>

          <div className="flex flex-col justify-center px-6 py-8 sm:px-10 md:px-14 md:py-16">
            <div className="mb-10">
              <div className="mb-7 inline-flex rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                АСКАО
              </div>
              <h1 className="max-w-xl text-4xl font-semibold leading-[1.04] tracking-tight text-foreground sm:text-5xl md:text-6xl">
                {personName}
              </h1>
              <p className="mt-5 max-w-lg text-xl leading-relaxed text-muted-foreground">
                {personRole}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {contactLinks.map(({ label, href, Icon, external, className }) => (
                <a
                  key={label}
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer" : undefined}
                  className={`inline-flex min-h-14 items-center justify-center gap-3 rounded-xl px-5 text-base font-semibold transition ${className}`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  <span>{label}</span>
                  {external && <ExternalLink className="h-4 w-4 opacity-75" aria-hidden="true" />}
                </a>
              ))}
            </div>

            <div className="mt-10 border-t border-border pt-7 text-sm leading-relaxed text-muted-foreground">
              Выберите удобный способ связи: телефон, email или мессенджер.
            </div>
          </div>
        </article>
      </section>
    </main>
  );
};

export default BusinessCardPage;
