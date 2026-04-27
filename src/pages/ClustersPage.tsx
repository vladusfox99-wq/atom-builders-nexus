import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/askao/Navbar";
import Footer from "@/components/askao/Footer";
import buildersImage from "@/assets/clusters-builders.jpg";
import manufacturersImage from "@/assets/clusters-manufacturers.jpg";
import designersImage from "@/assets/clusters-designers.jpg";

const goals = [
  "Консолидация компетенций организаций для реализации совместных проектов на внешнем рынке.",
  "Совместная проработка новых проектов и оперативная оценка целесообразности их реализации.",
  "Раннее вовлечение потенциальных исполнителей в проект, позволяющее минимизировать ошибки в проектировании и ценообразовании.",
];

const clusters = [
  {
    title: "Кластер производителей",
    image: manufacturersImage,
    imageAlt: "Кластер производителей",
    description:
      "Кластер производителей АСКАО включает в себя крупнейших в стране производителей материалов, оборудования, машин и механизмов, со своими производственными мощностями, расположенными по всей территории страны, отличающимися высоким качеством производства, в том числе с применением новых технологий, развитой логистикой и многолетним опытом поставки материалов и оборудования на объекты строительства в атомной, нефтегазовой, нефтехимической и других отраслях как на территории РФ так и за ее пределами.",
    extra:
      "Компетенции, производственные ресурсы и опыт организаций-участников Кластера производителей АСКАО позволяют обеспечивать полную комплектацию объектов строительства любой сложности.",
  },
  {
    title: "Кластер строителей",
    image: buildersImage,
    imageAlt: "Кластер строителей",
    description:
      "Кластер строительных организаций (подрядчиков) включает в себя лидеров отрасли, специализирующихся на строительстве объектов использования атомной энергии. Благодаря совокупному опыту, собственной специализированной технике и квалифицированному строительному персоналу члены Кластера способны реализовывать строительные проекты любой сложности и масштаба.",
  },
  {
    title: "Кластер проектировщиков",
    image: designersImage,
    imageAlt: "Кластер проектировщиков",
    description:
      "Специализированное добровольное структурное объединение членов АСКАО, имеющих компетенции в области выполнения инженерных изысканий и подготовки проектной документации в отношении ОИАЭ и других объектов промышленного и гражданского назначения.",
  },
] as const;

const ClustersPage = () => {
  useEffect(() => {
    document.title = "Кластеры — АСКАО";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "Кластеры АСКАО: строители, производители и проектировщики. Цели, задачи и состав кластеров.",
      );
    }
  }, []);

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

          <div className="section-label mb-6">Кластеры</div>
          <h1 className="max-w-4xl font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-6xl lg:text-7xl">
            Кластеры <span className="text-gradient">АСКАО</span>
          </h1>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="font-display text-3xl font-semibold leading-tight md:text-4xl">Цели и задачи</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {goals.map((goal) => (
              <div key={goal} className="border border-border bg-navy-deep p-6 text-sm leading-relaxed text-muted-foreground md:text-base">
                {goal}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20 md:pb-24">
        <div className="container space-y-16">
          {clusters.map((cluster) => (
            <article key={cluster.title} className="grid gap-8 lg:grid-cols-12 lg:items-start">
              <div className="lg:col-span-5">
                <div className="overflow-hidden border border-border bg-navy-deep shadow-[0_25px_60px_-25px_rgba(0,0,0,0.8)]">
                  <img src={cluster.image} alt={cluster.imageAlt} className="h-full w-full object-cover" loading="lazy" />
                </div>
              </div>

              <div className="space-y-4 lg:col-span-7">
                <h3 className="font-display text-2xl font-semibold leading-tight md:text-3xl">{cluster.title}</h3>
                <p className="text-base leading-relaxed text-muted-foreground md:text-lg">{cluster.description}</p>
                {cluster.extra ? <p className="text-base leading-relaxed text-muted-foreground md:text-lg">{cluster.extra}</p> : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default ClustersPage;
