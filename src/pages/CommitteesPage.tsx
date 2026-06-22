import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  UserRound,
  UsersRound,
} from "lucide-react";
import Navbar from "@/components/askao/Navbar";
import Footer from "@/components/askao/Footer";
import { committees } from "@/content/committees";
import { usePageSeo } from "@/lib/seo";

const CommitteesPage = () => {
  usePageSeo({
    title: "Комитеты АСКАО",
    description:
      "Комитеты АСКАО: экспертные направления и рабочие органы Ассоциации организаций строительного комплекса атомной отрасли.",
    path: "/committees",
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

          <div className="section-label mb-6">Экспертная работа</div>
          <h1 className="max-w-4xl font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-6xl lg:text-7xl">
            Комитеты <span className="text-gradient">АСКАО</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Профессиональные площадки для совместной работы участников ассоциации над отраслевыми инициативами,
            стандартами и практическими решениями.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          {committees.length > 0 ? (
            <div className="grid gap-6">
              {committees.map((committee, index) => (
                <article
                  key={committee.id}
                  className="grid gap-px border border-border bg-border lg:grid-cols-12"
                >
                  <div className="bg-navy-deep p-7 lg:col-span-4 lg:p-9">
                    <div className="font-mono text-xs text-primary">
                      / {(index + 1).toString().padStart(2, "0")}
                    </div>
                    <h2 className="mt-5 font-display text-2xl font-semibold leading-tight md:text-3xl">
                      {committee.title}
                    </h2>
                    {(committee.leader || committee.leaderRole) && (
                      <div className="mt-7 border-t border-border pt-6">
                        <div className="flex items-start gap-3">
                          <UserRound className="mt-0.5 shrink-0 text-primary" size={20} />
                          <div>
                            <div className="text-xs uppercase tracking-widest text-muted-foreground">
                              Руководитель
                            </div>
                            {committee.leader && (
                              <div className="mt-2 font-display text-lg font-semibold">
                                {committee.leader}
                              </div>
                            )}
                            {committee.leaderRole && (
                              <div className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                {committee.leaderRole}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-navy-deep p-7 lg:col-span-8 lg:p-9">
                    <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                      {committee.description}
                    </p>

                    {committee.pagePath && (
                      <Link
                        to={committee.pagePath}
                        className="mt-6 inline-flex items-center gap-2 border border-primary/40 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                      >
                        Открыть страницу комитета
                        <ArrowUpRight size={16} />
                      </Link>
                    )}

                    {committee.directions.length > 0 && (
                      <div className="mt-8">
                        <h3 className="font-display text-lg font-semibold">Направления работы</h3>
                        <ul className="mt-4 grid gap-3 md:grid-cols-2">
                          {committee.directions.map((direction) => (
                            <li key={direction} className="flex items-start gap-3 text-sm text-foreground/85">
                              <CheckCircle2 className="mt-0.5 shrink-0 text-primary" size={17} />
                              <span>{direction}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {committee.members.length > 0 && (
                      <div className="mt-8 border-t border-border pt-7">
                        <div className="flex items-center gap-3">
                          <UsersRound className="text-primary" size={20} />
                          <h3 className="font-display text-lg font-semibold">
                            Состав комитета · {committee.members.length}
                          </h3>
                        </div>
                        <div className="mt-5 grid gap-px border border-border bg-border md:grid-cols-2">
                          {committee.members.map((member, memberIndex) => (
                            <div
                              key={`${member.name}-${memberIndex}`}
                              className="bg-background/40 p-4"
                            >
                              <div className="font-semibold">{member.name}</div>
                              {member.organization && (
                                <div className="mt-1 text-sm text-muted-foreground">
                                  {member.organization}
                                </div>
                              )}
                              {member.role && (
                                <div className="mt-1 text-xs uppercase tracking-wider text-primary">
                                  {member.role}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="border border-primary/30 bg-primary/5 p-8 text-center md:p-12">
              <BriefcaseBusiness className="mx-auto text-primary" size={34} />
              <div className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-primary">
                Раздел формируется
              </div>
              <h2 className="mt-4 font-display text-2xl font-semibold md:text-3xl">
                Информация о комитетах готовится к публикации
              </h2>
              <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted-foreground">
                Список комитетов и сведения об их деятельности появятся после добавления материалов через админку.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default CommitteesPage;
