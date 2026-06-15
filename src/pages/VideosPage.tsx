import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Play } from "lucide-react";
import Navbar from "@/components/askao/Navbar";
import Footer from "@/components/askao/Footer";
import { videos } from "@/content/videos";
import { usePageSeo } from "@/lib/seo";

const VideosPage = () => {
  usePageSeo({
    title: "Видео АСКАО",
    description: "Видео Ассоциации организаций строительного комплекса атомной отрасли.",
    path: "/videos",
  });

  return (
    <main className="min-h-screen overflow-x-hidden bg-background font-body text-foreground">
      <Navbar />

      <section className="relative border-b border-border pb-16 pt-32 md:pb-20 md:pt-40">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="container relative">
          <Link
            to="/"
            className="mb-10 inline-flex items-center gap-2 text-sm font-mono text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft size={16} /> На главную
          </Link>

          <div className="section-label mb-6">Медиатека</div>
          <h1 className="max-w-4xl font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-6xl lg:text-7xl">
            Видео <span className="text-gradient">АСКАО</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Материалы об ассоциации, её деятельности и событиях строительного комплекса атомной отрасли.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          {videos.length > 0 ? (
            <div className="grid gap-10">
              {videos.map((video) => (
              <article key={video.id} className="border border-border bg-navy-deep">
                <div className="aspect-video overflow-hidden bg-black">
                  <iframe
                    src={video.embedUrl}
                    title={video.title}
                    className="h-full w-full"
                    allow="clipboard-write; autoplay"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>

                <div className="grid gap-6 p-6 md:grid-cols-12 md:items-center md:p-8">
                  <div className="md:col-span-1">
                    <div className="grid h-12 w-12 place-items-center border border-primary/40 text-primary">
                      <Play size={20} fill="currentColor" />
                    </div>
                  </div>
                  <div className="md:col-span-8">
                    <h2 className="font-display text-2xl font-semibold md:text-3xl">{video.title}</h2>
                    <p className="mt-3 leading-relaxed text-muted-foreground">{video.description}</p>
                  </div>
                  <div className="md:col-span-3 md:text-right">
                    <a
                      href={video.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-primary/40 px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                    >
                      Открыть на Rutube
                      <ArrowUpRight size={17} />
                    </a>
                  </div>
                </div>
              </article>
              ))}
            </div>
          ) : (
            <div className="border border-border p-10 text-center text-muted-foreground">
              Видео пока не опубликованы.
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default VideosPage;
