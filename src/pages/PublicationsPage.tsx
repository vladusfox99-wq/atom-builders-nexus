import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/askao/Navbar";
import Footer from "@/components/askao/Footer";
import { publications } from "@/content/publications";
import { SITE_URL, usePageSeo } from "@/lib/seo";

const description = "Научные статьи и экспертные материалы по вопросам строительного комплекса атомной отрасли.";
const buttonClass = "inline-flex items-center justify-center gap-2 border border-primary bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-glow";

export default function PublicationsPage() {
  const { slug } = useParams();
  const publication = publications.find(item => item.slug === slug);
  const detail = Boolean(publication);
  const missing = Boolean(slug && !detail);
  const title = missing ? "Публикация не найдена" : publication?.title ?? "Публикации";
  usePageSeo({
    title: `${title} — АСКАО`,
    description: publication?.abstract ?? description,
    path: slug ? `/publications/${slug}` : "/publications",
    noIndex: missing,
    type: detail ? "article" : "website",
    structuredData: publication?.schema ?? {
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
          <div><span className="section-label">{publication?.kind ?? "Материалы и исследования"}</span></div>
          <h1 className={`mt-7 max-w-5xl font-display font-bold leading-tight tracking-tight ${detail ? "text-3xl md:text-5xl" : "text-4xl md:text-6xl"}`}>{title}</h1>
          {publication ? <p className="mt-7 text-muted-foreground leading-relaxed">{publication.credits}<br />{publication.metadata}</p>
            : !missing && <p className="mt-7 max-w-3xl text-lg text-muted-foreground">{description}</p>}
        </div>
      </header>
      {!missing && <section className="py-16 md:py-24"><div className="container">
        {publication ? <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-semibold md:text-3xl">{publication.kind === "Научная статья" ? "О статье" : "О публикации"}</h2>
          <p className="mt-6 text-lg leading-relaxed text-foreground/85">{publication.abstract}</p>
          <p className="mt-6 text-lg leading-relaxed text-foreground/85">{publication.context}</p>
          <div className="mt-10 border border-border bg-navy p-6 md:p-8">
            <h2 className="font-display text-2xl font-semibold">Полный текст</h2>
            <p className="mt-3 text-muted-foreground">{publication.fileDetails}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={publication.pdf} target="_blank" rel="noopener noreferrer" className={buttonClass}>Читать {publication.kind === "Научная статья" ? "статью" : "публикацию"} ↗</a>
              <a href={publication.pdf} download={publication.downloadName} className="inline-flex items-center justify-center border border-border px-6 py-3 text-sm font-semibold hover:border-primary">Скачать PDF ↓</a>
            </div>
            {publication.source && <a href={publication.source} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block text-sm text-primary hover:text-primary-glow">Страница статьи в журнале ↗</a>}
          </div>
          <h2 className="mt-12 font-display text-2xl font-semibold">Библиографическая ссылка</h2>
          <p className="mt-5 break-words text-base leading-relaxed text-muted-foreground">{publication.citation}</p>
        </div> : <div className="max-w-5xl space-y-6">{publications.map(item => (
          <article key={item.slug} className="border border-border bg-navy p-6 md:p-8">
            <span className="section-label">{item.kind}</span>
            <h2 className="mt-5 font-display text-2xl font-semibold leading-tight md:text-3xl"><Link to={`/publications/${item.slug}`} className="hover:text-primary">{item.title}</Link></h2>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{item.credits}<br />{item.metadata}</p>
            <p className="mt-6 text-base leading-relaxed text-foreground/85">{item.abstract}</p>
            <Link to={`/publications/${item.slug}`} className="mt-7 inline-block text-sm font-semibold text-primary hover:text-primary-glow">О публикации и полный текст →</Link>
          </article>
        ))}</div>}
      </div></section>}
      <Footer />
    </main>
  );
}
