import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/askao/Navbar";
import Footer from "@/components/askao/Footer";
import publication from "@/content/publication.json";
import { SITE_URL, usePageSeo } from "@/lib/seo";

const publicationPath = `/publications/${publication.slug}`;
const description = "Научные статьи и экспертные материалы по вопросам строительного комплекса атомной отрасли.";
const metadata = "«Инженерный вестник Дона», № 8 (2026) · PDF · 19 страниц";
const buttonClass = "inline-flex items-center justify-center gap-2 border border-primary bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-glow";

export default function PublicationsPage() {
  const { slug } = useParams();
  const detail = slug === publication.slug;
  const missing = Boolean(slug && !detail);
  const title = missing ? "Публикация не найдена" : detail ? publication.title : "Публикации";
  usePageSeo({
    title: `${title} — АСКАО`,
    description: detail ? publication.abstract : description,
    path: slug ? `/publications/${slug}` : "/publications",
    noIndex: missing,
    type: detail ? "article" : "website",
    structuredData: detail ? publication.schema : {
      "@context": "https://schema.org", "@type": "CollectionPage",
      name: "Публикации АСКАО", description, url: `${SITE_URL}/publications`,
    },
  });
  useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, [slug]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-background font-body text-foreground">
      <Navbar />
      <header className="relative border-b border-border pb-16 pt-32 md:pb-20 md:pt-40">
        <div className="container relative">
          <Link to={slug ? "/publications" : "/"} className="mb-10 inline-flex text-sm font-mono text-muted-foreground hover:text-primary">
            {slug ? "← Все публикации" : "← На главную"}
          </Link>
          <div><span className="section-label">{detail ? "Научная статья" : "Материалы и исследования"}</span></div>
          <h1 className={`mt-7 max-w-5xl font-display font-bold leading-tight tracking-tight ${detail ? "text-3xl md:text-5xl" : "text-4xl md:text-6xl"}`}>{title}</h1>
          {detail ? <p className="mt-7 text-muted-foreground leading-relaxed">{publication.authors.join(" · ")}<br />{metadata}</p>
            : !missing && <p className="mt-7 max-w-3xl text-lg text-muted-foreground">{description}</p>}
        </div>
      </header>
      {!missing && <section className="py-16 md:py-24"><div className="container">
        {detail ? <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-semibold md:text-3xl">О статье</h2>
          <p className="mt-6 text-lg leading-relaxed text-foreground/85">{publication.abstract}</p>
          <p className="mt-6 text-lg leading-relaxed text-foreground/85">{publication.context}</p>
          <div className="mt-10 border border-border bg-navy p-6 md:p-8">
            <h2 className="font-display text-2xl font-semibold">Полный текст</h2>
            <p className="mt-3 text-muted-foreground">Оригинальная статья в PDF · 19 страниц · 549 КБ</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={publication.pdf} target="_blank" rel="noopener noreferrer" className={buttonClass}>Читать статью ↗</a>
              <a href={publication.pdf} download="Bechtev-Kurguz-Sokolik-2026.pdf" className="inline-flex items-center justify-center border border-border px-6 py-3 text-sm font-semibold hover:border-primary">Скачать PDF ↓</a>
            </div>
            <a href={publication.source} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block text-sm text-primary hover:text-primary-glow">Страница статьи в журнале ↗</a>
          </div>
          <h2 className="mt-12 font-display text-2xl font-semibold">Библиографическая ссылка</h2>
          <p className="mt-5 break-words text-base leading-relaxed text-muted-foreground">{publication.citation}</p>
        </div> : <article className="max-w-5xl border border-border bg-navy p-6 md:p-8">
          <span className="section-label">Научная статья</span>
          <h2 className="mt-5 font-display text-2xl font-semibold leading-tight md:text-3xl"><Link to={publicationPath} className="hover:text-primary">{publication.title}</Link></h2>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{publication.authors.join(" · ")}<br />{metadata}</p>
          <p className="mt-6 text-base leading-relaxed text-foreground/85">{publication.abstract}</p>
          <Link to={publicationPath} className="mt-7 inline-block text-sm font-semibold text-primary hover:text-primary-glow">О публикации и полный текст →</Link>
        </article>}
      </div></section>}
      <Footer />
    </main>
  );
}
