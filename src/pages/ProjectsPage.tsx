import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/askao/Navbar";
import Footer from "@/components/askao/Footer";
import { projectGroups, projects, type ProjectGroup } from "@/content/projects";
import { usePageSeo } from "@/lib/seo";

const groupDescriptions: Record<ProjectGroup, string> = {
  "Текущие проекты":
    "Проекты, которые в презентации отмечены как реализуемые с участием организаций АСКАО.",
  "Перспективные проекты":
    "Проекты из дорожной карты развития и планирования новых направлений работ.",
  "Инвестиционный портфель":
    "Формируемый пул инвестиционных инициатив участников АСКАО с возможными мерами поддержки.",
};

const ProjectsPage = () => {
  usePageSeo({
    title: "Проекты АСКАО",
    description:
      "Текущие, перспективные и инвестиционные проекты Ассоциации организаций строительного комплекса атомной отрасли.",
    path: "/projects",
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

          <div className="grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-12">
              <div className="section-label mb-6">Портфель проектов</div>
              <h1 className="font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-6xl lg:text-7xl">
                Проекты <span className="text-gradient">АСКАО</span>
              </h1>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container space-y-12">
          {projectGroups.map((group) => {
            const groupProjects = projects.filter((project) => project.group === group);
            return (
              <section key={group} className="space-y-6">
                <div className="space-y-2">
                  <h2 className="font-display text-3xl font-semibold leading-tight md:text-4xl">{group}</h2>
                  <p className="max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
                    {groupDescriptions[group]}
                  </p>
                </div>

                <div className="grid gap-px border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
                  {groupProjects.map((project) => (
                    <article key={project.id} className="flex h-full flex-col bg-navy-deep p-6 transition-colors hover:bg-navy-light">
                      {group !== "Инвестиционный портфель" ? (
                        <div className="mb-5 overflow-hidden border border-border bg-background/40">
                          <img src={project.image} alt={project.name} className="aspect-[16/9] h-full w-full object-cover" loading="lazy" />
                        </div>
                      ) : null}
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className="inline-flex w-fit border border-primary/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary">
                          {project.status}
                        </span>
                        <span className="inline-flex w-fit border border-border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                          {project.location}
                        </span>
                      </div>
                      <h3 className="font-display text-xl font-semibold leading-snug">{project.name}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{project.summary}</p>
                      {project.note ? (
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                          Профиль: <span className="text-foreground">{project.note}</span>
                        </p>
                      ) : null}
                      {project.supportTools ? (
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                          Инструменты поддержки: <span className="text-foreground">{project.supportTools}</span>
                        </p>
                      ) : null}
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default ProjectsPage;
