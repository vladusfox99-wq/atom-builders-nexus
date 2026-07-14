import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  Cpu,
  Database,
  FileText,
  Network,
  ShieldCheck,
  UsersRound,
  Workflow,
} from "lucide-react";
import Navbar from "@/components/askao/Navbar";
import Footer from "@/components/askao/Footer";
import { committees } from "@/content/committees";
import { usePageSeo } from "@/lib/seo";

const committeeId = "digital-ai";
const committeeTitle = "Цифровой комитет по применению искусственного интеллекта АСКАО";

const missionItems = [
  "Собирать и систематизировать практические сценарии применения ИИ в работе участников АСКАО.",
  "Оценивать готовые цифровые продукты, их применимость, ограничения и эффект для отраслевых процессов.",
  "Формировать предложения по развитию цифровой инфраструктуры, данных и стандартов взаимодействия.",
];

const goals = [
  "Развитие практического применения искусственного интеллекта и цифровых инструментов.",
  "Повышение эффективности проектных, строительных, аналитических и управленческих процессов.",
  "Формирование базы проверенных кейсов, методик и рекомендаций для участников АСКАО.",
  "Поддержка кооперации между компаниями, разработчиками и экспертными группами.",
];

const tasks = [
  "Выявление проблемных зон, где цифровые решения могут дать измеримый эффект.",
  "Анализ AI-продуктов, BIM-инструментов, цифровых двойников и сервисов инженерной аналитики.",
  "Подготовка требований к данным, интеграциям и отраслевым цифровым сервисам.",
  "Организация рабочих встреч, демонстраций решений и экспертных обсуждений.",
  "Подготовка практических материалов для внедрения цифровых инструментов участниками ассоциации.",
];

const activityCards = [
  {
    icon: Bot,
    title: "ИИ-продукты",
    description: "Отбор и анализ готовых решений для задач проектирования, управления и аналитики.",
  },
  {
    icon: Workflow,
    title: "Цифровые процессы",
    description: "Описание процессов, которые можно усилить автоматизацией и интеллектуальными сервисами.",
  },
  {
    icon: Database,
    title: "Данные и интеграции",
    description: "Формирование требований к данным, обмену информацией и совместимости систем.",
  },
  {
    icon: Cpu,
    title: "Информационное моделирование",
    description: "Развитие BIM-подходов, цифровых моделей и инженерной аналитики.",
  },
  {
    icon: ShieldCheck,
    title: "Риски и регламенты",
    description: "Оценка ограничений, качества данных, ответственности и безопасного применения AI-инструментов.",
  },
  {
    icon: Network,
    title: "Экспертная кооперация",
    description: "Объединение участников ассоциации, разработчиков и профильных экспертов вокруг практических задач.",
  },
];

const practicalTracks = [
  "Карта проблем сайта и платформы АСКАО с возможными AI-решениями.",
  "Каталог готовых цифровых продуктов для участников ассоциации.",
  "Пилотные сценарии применения ИИ в проектной и организационной работе.",
  "Методические материалы по внедрению AI-инструментов в рабочих процессах.",
];

const DigitalCommitteeDetailPage = () => {
  const committee = committees.find((item) => item.id === committeeId);

  usePageSeo({
    title: `${committeeTitle} - АСКАО`,
    description:
      committee?.description ??
      "Цифровой комитет АСКАО по применению искусственного интеллекта, цифрового проектирования и информационного моделирования.",
    path: "/committees/digital-ai",
  });

  return (
    <main className="min-h-screen overflow-x-hidden bg-background font-body text-foreground">
      <Navbar />

      <section className="relative border-b border-border pb-16 pt-32 md:pb-24 md:pt-40">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,hsl(var(--primary)/0.16),transparent_34%)]" />
        <div className="container relative">
          <Link
            to="/committees"
            className="mb-10 inline-flex items-center gap-2 text-sm font-mono text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft size={16} /> К комитетам
          </Link>

          <div className="section-label mb-6">Цифровая повестка</div>
          <h1 className="max-w-5xl font-display text-4xl font-bold leading-[1.04] tracking-tight md:text-6xl lg:text-7xl">
            {committeeTitle}
          </h1>
          <p className="mt-7 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            Комитет объединяет участников ассоциации вокруг практического применения искусственного
            интеллекта, цифрового проектирования, информационного моделирования и инженерной
            аналитики.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            {[
              "Искусственный интеллект",
              "BIM",
              "Цифровые двойники",
              "Инженерная аналитика",
            ].map((item) => (
              <div
                key={item}
                className="border border-border bg-background/70 px-5 py-3 font-display text-sm font-semibold backdrop-blur"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="section-label mb-5">О Комитете</div>
            <h2 className="font-display text-3xl font-semibold leading-tight md:text-4xl">
              Практическая площадка для цифровой трансформации
            </h2>
          </div>

          <div className="space-y-7 lg:col-span-8">
            <p className="text-lg leading-relaxed text-muted-foreground">
              Комитет работает как экспертный и проектный контур для отбора, обсуждения и внедрения
              цифровых решений. Фокус сделан не на абстрактной цифровизации, а на прикладных задачах,
              которые можно проверить через пилоты, регламенты и измеримый эффект.
            </p>

            <div className="grid gap-px border border-border bg-border md:grid-cols-3">
              {missionItems.map((item, index) => (
                <article key={item} className="bg-navy-deep p-6">
                  <div className="font-mono text-xs text-primary">
                    / {(index + 1).toString().padStart(2, "0")}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{item}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-navy-deep py-16 md:py-24">
        <div className="container">
          <div className="mb-10 max-w-3xl">
            <div className="section-label mb-5">Цели и задачи</div>
            <h2 className="font-display text-3xl font-semibold leading-tight md:text-4xl">
              Приоритеты цифровой работы
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <article className="border border-border bg-background/45 p-6 md:p-8">
              <div className="mb-5 flex items-center gap-3">
                <UsersRound className="text-primary" size={24} />
                <h3 className="font-display text-2xl font-semibold">Цели</h3>
              </div>
              <ul className="space-y-3">
                {goals.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-primary" size={18} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="border border-border bg-background/45 p-6 md:p-8">
              <div className="mb-5 flex items-center gap-3">
                <FileText className="text-primary" size={24} />
                <h3 className="font-display text-2xl font-semibold">Задачи</h3>
              </div>
              <ul className="space-y-3">
                {tasks.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-primary" size={18} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mb-10 max-w-3xl">
            <div className="section-label mb-5">Направления деятельности</div>
            <h2 className="font-display text-3xl font-semibold leading-tight md:text-4xl">
              От анализа решений к пилотам и внедрению
            </h2>
          </div>

          <div className="grid gap-px border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
            {activityCards.map(({ icon: Icon, title, description }) => (
              <article key={title} className="bg-background/55 p-6">
                <Icon className="text-primary" size={27} />
                <h3 className="mt-5 font-display text-xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-navy-deep py-16 md:py-24">
        <div className="container grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="section-label mb-5">Практические результаты</div>
            <h2 className="font-display text-3xl font-semibold leading-tight md:text-4xl">
              Что комитет может готовить для участников
            </h2>
          </div>

          <div className="grid gap-4 lg:col-span-8">
            {practicalTracks.map((item, index) => (
              <article key={item} className="border border-border bg-background/45 p-5">
                <div className="flex items-start gap-4">
                  <div className="font-mono text-xs text-primary">
                    / {(index + 1).toString().padStart(2, "0")}
                  </div>
                  <p className="leading-relaxed text-muted-foreground">{item}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default DigitalCommitteeDetailPage;
