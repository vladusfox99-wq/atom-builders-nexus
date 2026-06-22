import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { geoGraticule, geoOrthographic, geoPath } from "d3-geo";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import {
  ArrowLeft,
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  ExternalLink,
  FileText,
  Flag,
  Globe2,
  Handshake,
  Image,
  Landmark,
  Mail,
  MapPin,
  Network,
  Phone,
  Plane,
  Route,
  Search,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { feature } from "topojson-client";
import countriesAtlas from "world-atlas/countries-110m.json";
import Navbar from "@/components/askao/Navbar";
import Footer from "@/components/askao/Footer";
import { committeeEvents } from "@/content/committeeEvents";
import { committees } from "@/content/committees";
import askAoLogo from "@/assets/askao-logo.png";
import committeeHeroImage from "@/assets/international-committee-hero.png";
import { usePageSeo } from "@/lib/seo";

const committeePageTitle = "Комитет по международной политике АСКАО";
const regulationUrl =
  "https://docs.google.com/document/d/1sBybhVRHLpz_UmhCv92-ReXFuu7dqgpEvOmGteNoInk/edit?tab=t.0#heading=h.ya2bws3nuyp";

const heroLogos = ["ШОСПИ", "БРИКС", "ШОС"];

const missionItems = [
  "Формировать международную повестку АСКАО и представлять компетенции участников ассоциации на внешних рынках.",
  "Развивать устойчивые партнерские связи с отраслевыми объединениями, государственными структурами и деловыми площадками.",
  "Поддерживать международные проекты, мероприятия и экспертную аналитику в интересах строительного комплекса атомной отрасли.",
];

const goals = [
  "Развитие международного сотрудничества участников АСКАО.",
  "Расширение географии отраслевых партнерств и деловых контактов.",
  "Продвижение компетенций российских организаций строительного комплекса атомной отрасли за рубежом.",
  "Создание условий для реализации совместных проектов, соглашений и деловых миссий.",
];

const tasks = [
  "Координация международных инициатив участников ассоциации.",
  "Подготовка предложений по соглашениям, меморандумам и дорожным картам сотрудничества.",
  "Организация международных мероприятий, встреч, круглых столов и деловых миссий.",
  "Сбор и систематизация аналитики по зарубежным рынкам и потенциальным партнерам.",
  "Сопровождение коммуникаций с иностранными организациями и экспертными площадками.",
];

const activityCards = [
  {
    icon: Handshake,
    title: "Международное сотрудничество",
    description: "Построение рабочих связей с зарубежными организациями и отраслевыми объединениями.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Международные проекты",
    description: "Сопровождение проектных инициатив от первичной проработки до реализации.",
  },
  {
    icon: CircleDollarSign,
    title: "Международные инвестиции",
    description: "Поиск инвестиционных возможностей и партнерских форматов для участников АСКАО.",
  },
  {
    icon: CalendarDays,
    title: "Международные мероприятия",
    description: "Участие в форумах, конференциях, выставках, деловых миссиях и заседаниях.",
  },
  {
    icon: BarChart3,
    title: "Международная аналитика",
    description: "Подготовка обзоров рынков, стран, партнеров и отраслевых практик.",
  },
  {
    icon: Network,
    title: "Международная кооперация",
    description: "Формирование кооперационных цепочек и совместных решений для зарубежных проектов.",
  },
];

const committeeMembers = [
  {
    name: "Иванов Иван Иванович",
    role: "Председатель Комитета",
    organization: "АСКАО",
    bio: "Краткая информация, биография и контактные данные уточняются.",
  },
];

const partners = [
  {
    organization: "Партнерские организации Республики Таджикистан",
    country: "Республика Таджикистан",
    date: "уточняется",
    documentType: "Соглашение",
    description: "Направления сотрудничества и документы находятся на уточнении.",
  },
  {
    organization: "Партнерские организации Республики Узбекистан",
    country: "Республика Узбекистан",
    date: "уточняется",
    documentType: "Меморандум",
    description: "Взаимодействие по международным мероприятиям и проектным инициативам.",
  },
  {
    organization: "Партнерские организации Республики Казахстан",
    country: "Республика Казахстан",
    date: "уточняется",
    documentType: "Дорожная карта",
    description: "Перспективные форматы отраслевой кооперации и экспертного обмена.",
  },
  {
    organization: "Партнерские организации Республики Беларусь",
    country: "Республика Беларусь",
    date: "уточняется",
    documentType: "Протокол намерений",
    description: "Сотрудничество по профильным компетенциям строительного комплекса.",
  },
  {
    organization: "Партнерские организации Китайской Народной Республики",
    country: "Китайская Народная Республика",
    date: "уточняется",
    documentType: "Меморандум",
    description: "Деловые контакты, мероприятия и перспективные проектные направления.",
  },
  {
    organization: "Партнерские организации Республики Индия",
    country: "Республика Индия",
    date: "уточняется",
    documentType: "Соглашение",
    description: "Проработка форматов взаимодействия и совместных отраслевых инициатив.",
  },
];

const projects = [
  {
    title: "Международная проектная инициатива АСКАО",
    country: "Республика Узбекистан",
    status: "Проработка",
    participants: "Участники АСКАО, профильные партнеры",
    description: "Параметры проекта, состав участников и сроки реализации уточняются.",
    startDate: "уточняется",
    endDate: "уточняется",
  },
  {
    title: "Кооперационная программа по зарубежным объектам",
    country: "Республика Казахстан",
    status: "Подготовка",
    participants: "АСКАО, отраслевые организации",
    description: "Подготовка предложений по участию компаний строительного комплекса.",
    startDate: "уточняется",
    endDate: "уточняется",
  },
  {
    title: "Экспертная поддержка международных проектов",
    country: "Китайская Народная Республика",
    status: "Реализация",
    participants: "Экспертные группы и партнерские организации",
    description: "Сопровождение коммуникаций, аналитики и проектных материалов.",
    startDate: "уточняется",
    endDate: "уточняется",
  },
];

const countries = [
  {
    name: "Россия",
    countryId: "643",
    agreements: 2,
    projects: 3,
    events: 4,
    partners: 5,
    longitude: 90,
    latitude: 60,
  },
  {
    name: "Беларусь",
    countryId: "112",
    agreements: 1,
    projects: 1,
    events: 1,
    partners: 2,
    longitude: 28,
    latitude: 53,
  },
  {
    name: "Казахстан",
    countryId: "398",
    agreements: 1,
    projects: 2,
    events: 2,
    partners: 3,
    longitude: 67,
    latitude: 48,
  },
  {
    name: "Узбекистан",
    countryId: "860",
    agreements: 1,
    projects: 2,
    events: 2,
    partners: 3,
    longitude: 64,
    latitude: 41,
  },
  {
    name: "Таджикистан",
    countryId: "762",
    agreements: 1,
    projects: 1,
    events: 1,
    partners: 2,
    longitude: 71,
    latitude: 39,
  },
  {
    name: "Индия",
    countryId: "356",
    agreements: 1,
    projects: 1,
    events: 1,
    partners: 2,
    longitude: 78,
    latitude: 22,
  },
  {
    name: "Китай",
    countryId: "156",
    agreements: 1,
    projects: 2,
    events: 2,
    partners: 3,
    longitude: 104,
    latitude: 35,
  },
  {
    name: "Турция",
    countryId: "792",
    agreements: 0,
    projects: 1,
    events: 1,
    partners: 1,
    longitude: 35,
    latitude: 39,
  },
  {
    name: "Республика Гана",
    countryId: "288",
    agreements: 0,
    projects: 1,
    events: 0,
    partners: 1,
    longitude: -1,
    latitude: 8,
  },
  {
    name: "Другие страны",
    countryId: "",
    agreements: 0,
    projects: 0,
    events: 0,
    partners: 0,
    longitude: 20,
    latitude: 20,
  },
];

const countryStats = [
  { key: "agreements", label: "Соглашения" },
  { key: "projects", label: "Проекты" },
  { key: "events", label: "Мероприятия" },
  { key: "partners", label: "Партнеры" },
] as const;

const countryLabelOffsets: Record<string, { dx: number; dy: number; anchor: "start" | "end" }> = {
  "Россия": { dx: 14, dy: -8, anchor: "start" },
  "Беларусь": { dx: -12, dy: -10, anchor: "end" },
  "Казахстан": { dx: 14, dy: 18, anchor: "start" },
  "Узбекистан": { dx: -14, dy: 24, anchor: "end" },
  "Таджикистан": { dx: 14, dy: 30, anchor: "start" },
  "Индия": { dx: 14, dy: 12, anchor: "start" },
  "Китай": { dx: 14, dy: -10, anchor: "start" },
  "Турция": { dx: -14, dy: 16, anchor: "end" },
  "Республика Гана": { dx: -14, dy: 12, anchor: "end" },
  "Другие страны": { dx: -14, dy: -12, anchor: "end" },
};

type WorldCountryFeature = Feature<Geometry, { name?: string }> & {
  id?: string | number;
};

const worldCountryCollection = feature(
  countriesAtlas,
  countriesAtlas.objects.countries,
) as FeatureCollection<Geometry, { name?: string }>;

const worldCountryFeatures = worldCountryCollection.features as WorldCountryFeature[];
const cooperationCountryIds = new Set(countries.map((country) => country.countryId).filter(Boolean));
const countryById = new Map(countries.map((country) => [country.countryId, country]));

const galleryItems = [
  { title: "АТОМЭКСПО", category: "мероприятия", image: "Форум" },
  { title: "Подписание соглашения", category: "подписания соглашений", image: "Документ" },
  { title: "Деловая миссия", category: "деловые миссии", image: "Миссия" },
  { title: "Международный проект", category: "проекты", image: "Проект" },
  { title: "Встреча партнеров", category: "мероприятия", image: "Встреча" },
  { title: "Рабочая группа", category: "проекты", image: "Группа" },
];

const galleryFilters = ["все", "мероприятия", "подписания соглашений", "деловые миссии", "проекты"];

const CommitteeDetailPage = () => {
  const { committeeId } = useParams();
  const committee = committees.find((item) => item.id === committeeId);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [galleryFilter, setGalleryFilter] = useState("все");

  const filteredGallery =
    galleryFilter === "все"
      ? galleryItems
      : galleryItems.filter((item) => item.category === galleryFilter);
  const pageEvents = committeeEvents.filter((event) => event.committeeId === committeeId);
  const globeProjection = geoOrthographic()
    .rotate([-55, -35])
    .scale(285)
    .translate([300, 300])
    .clipAngle(90);
  const globePath = geoPath(globeProjection);
  const globeSpherePath = globePath({ type: "Sphere" });
  const globeGraticulePath = globePath(geoGraticule().step([20, 20])());
  const projectedCountries = countries
    .filter((country) => country.countryId)
    .map((country) => ({
      ...country,
      point: globeProjection([country.longitude, country.latitude]),
      labelOffset: countryLabelOffsets[country.name],
    }))
    .filter((country) => country.point !== null);

  usePageSeo({
    title: committee ? `${committeePageTitle} - АСКАО` : "Комитет не найден - АСКАО",
    description:
      committee?.description ??
      "Информация о комитете АСКАО не найдена или еще готовится к публикации.",
    path: committee?.pagePath ?? "/committees",
    image: committeeHeroImage,
  });

  if (!committee) {
    return (
      <main className="min-h-screen overflow-x-hidden bg-background font-body text-foreground">
        <Navbar />
        <section className="relative border-b border-border pb-16 pt-32 md:pb-20 md:pt-40">
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="container relative">
            <Link
              to="/committees"
              className="mb-10 inline-flex items-center gap-2 text-sm font-mono text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft size={16} /> К комитетам
            </Link>
            <div className="section-label mb-6">Комитеты АСКАО</div>
            <h1 className="max-w-4xl font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-6xl">
              Комитет не найден
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Проверьте адрес страницы или вернитесь к списку комитетов.
            </p>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-background font-body text-foreground">
      <Navbar />

      <section className="relative min-h-[92vh] border-b border-border pt-28 md:pt-32">
        <img
          src={committeeHeroImage}
          alt={committeePageTitle}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/86 to-background/30" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,hsl(var(--background))_100%)]" />

        <div className="container relative flex min-h-[92vh] flex-col justify-center pb-20 pt-16">
          <Link
            to="/committees"
            className="mb-8 inline-flex w-fit items-center gap-2 text-sm font-mono text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft size={16} /> К комитетам
          </Link>

          <div className="flex flex-wrap items-center gap-4">
            <img src={askAoLogo} alt="АСКАО" className="h-14 w-auto object-contain" />
            <div className="section-label">Международная деятельность</div>
          </div>

          <h1 className="mt-8 max-w-5xl font-display text-4xl font-bold leading-[1.04] tracking-tight md:text-6xl lg:text-7xl">
            {committeePageTitle}
          </h1>
          <p className="mt-7 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            Комитет формирует международную повестку АСКАО и развивает связи с зарубежными
            партнерами, отраслевыми объединениями и экспертными площадками. Его работа помогает
            участникам ассоциации продвигать компетенции, готовить совместные проекты и
            участвовать в международных мероприятиях.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            {heroLogos.map((item) => (
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
              Комитет по международной политики АСКАО
            </h2>
            <a
              href={regulationUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-flex items-center gap-2 border border-primary/40 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              Положение о Комитете
              <ExternalLink size={16} />
            </a>
          </div>

          <div className="space-y-7 lg:col-span-8">
            <p className="text-lg leading-relaxed text-muted-foreground">
              Комитет объединяет участников ассоциации вокруг задач международного сотрудничества,
              проектной кооперации и продвижения отраслевых компетенций. Он выступает координатором
              международных инициатив и помогает выстраивать понятный контур взаимодействия с
              зарубежными партнерами.
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

            <div className="border-l-2 border-primary pl-5">
              <h3 className="font-display text-xl font-semibold">Роль в структуре АСКАО</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Комитет работает как экспертная и коммуникационная площадка внутри АСКАО,
                связывая запросы участников ассоциации с международными направлениями, партнерами,
                мероприятиями и проектными возможностями.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-navy-deep py-16 md:py-24">
        <div className="container">
          <div className="mb-10 max-w-3xl">
            <div className="section-label mb-5">Цели и задачи</div>
            <h2 className="font-display text-3xl font-semibold leading-tight md:text-4xl">
              Приоритеты международной работы
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <article className="border border-border bg-background/45 p-6 md:p-8">
              <div className="mb-5 flex items-center gap-3">
                <Flag className="text-primary" size={24} />
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
                <ShieldCheck className="text-primary" size={24} />
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

          <div className="mt-12">
            <h3 className="font-display text-2xl font-semibold">Направления деятельности</h3>
            <div className="mt-6 grid gap-px border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
              {activityCards.map(({ icon: Icon, title, description }) => (
                <article key={title} className="bg-background/55 p-6">
                  <Icon className="text-primary" size={27} />
                  <h4 className="mt-5 font-display text-xl font-semibold leading-tight">{title}</h4>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mb-8 flex items-center gap-3">
            <UsersRound className="text-primary" size={24} />
            <h2 className="font-display text-3xl font-semibold md:text-4xl">Состав Комитета</h2>
          </div>
          <div className="grid gap-px border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
            {committeeMembers.map((member) => (
              <article key={member.name} className="bg-navy-deep p-6">
                <div className="flex aspect-[4/3] items-center justify-center border border-border bg-background/45">
                  <UsersRound className="text-primary" size={44} />
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold">{member.name}</h3>
                <div className="mt-2 text-sm text-primary">{member.role}</div>
                <div className="mt-1 text-sm text-muted-foreground">{member.organization}</div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{member.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-navy-deep py-16 md:py-24">
        <div className="container">
          <div className="mb-10 max-w-3xl">
            <div className="section-label mb-5">Соглашения и меморандумы о сотрудничестве</div>
            <h2 className="font-display text-3xl font-semibold md:text-4xl">
              Международные партнеры
            </h2>
          </div>
          <div className="grid gap-px border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
            {partners.map((partner) => (
              <article key={partner.organization} className="bg-background/55 p-6">
                <div className="flex h-16 w-16 items-center justify-center border border-border bg-navy-deep">
                  <Landmark className="text-primary" size={28} />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold leading-tight">
                  {partner.organization}
                </h3>
                <dl className="mt-5 space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Страна</dt>
                    <dd className="text-right">{partner.country}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Дата подписания</dt>
                    <dd className="text-right">{partner.date}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Документ</dt>
                    <dd className="text-right">{partner.documentType}</dd>
                  </div>
                </dl>
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                  {partner.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mb-10 flex items-center gap-3">
            <Route className="text-primary" size={24} />
            <h2 className="font-display text-3xl font-semibold md:text-4xl">
              Международные проекты
            </h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {projects.map((project) => (
              <article key={project.title} className="border border-border bg-navy-deep p-6">
                <div className="mb-5 inline-flex border border-primary/35 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                  {project.status}
                </div>
                <h3 className="font-display text-xl font-semibold leading-tight">{project.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {project.description}
                </p>
                <dl className="mt-6 space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Страна</dt>
                    <dd className="text-right">{project.country}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Участники</dt>
                    <dd className="max-w-[55%] text-right">{project.participants}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Начало</dt>
                    <dd>{project.startDate}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Завершение</dt>
                    <dd>{project.endDate}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-navy-deep py-16 md:py-24">
        <div className="container">
          <div className="mb-10 flex items-center gap-3">
            <CalendarDays className="text-primary" size={24} />
            <h2 className="font-display text-3xl font-semibold md:text-4xl">Мероприятия</h2>
          </div>
          <div className="grid gap-10 lg:grid-cols-2">
            {[
              { title: "Прошедшие мероприятия", status: "past" },
              { title: "Планируемые мероприятия", status: "planned" },
            ].map((group) => (
              <div key={group.status}>
                <h3 className="font-display text-2xl font-semibold">{group.title}</h3>
                <div className="mt-5 grid gap-4">
                  {pageEvents
                    .filter((event) => event.status === group.status)
                    .map((event) => (
                      <article key={event.title} className="border border-border bg-background/55 p-5">
                        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                          <span>{event.type}</span>
                          <span>/</span>
                          <span>{event.dateLabel ?? event.date}</span>
                        </div>
                        <h4 className="mt-3 font-display text-xl font-semibold">{event.title}</h4>
                        <div className="mt-2 text-sm text-muted-foreground">
                          {event.city}, {event.country}
                        </div>
                        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                          {event.description}
                        </p>
                        <div className="mt-4 border-t border-border pt-4 text-sm">
                          {event.results}
                        </div>
                      </article>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="section-label mb-5">География сотрудничества</div>
            <h2 className="font-display text-3xl font-semibold leading-tight md:text-4xl">
              Страны международного взаимодействия
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              Нажмите на подсвеченную точку или название страны, чтобы посмотреть статистику по
              соглашениям, проектам, мероприятиям и партнерам.
            </p>
          </div>
          <div className="lg:col-span-8">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]">
              <div className="border border-border bg-navy-deep p-4 md:p-6">
                <svg
                  viewBox="0 0 600 600"
                  role="img"
                  aria-label="Глобус с реальными странами сотрудничества"
                  className="mx-auto aspect-square max-w-[620px] overflow-visible"
                >
                  <defs>
                    <radialGradient id="globe-ocean" cx="35%" cy="28%" r="72%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.22" />
                      <stop offset="55%" stopColor="hsl(var(--navy-deep))" />
                      <stop offset="100%" stopColor="hsl(var(--background))" />
                    </radialGradient>
                    <filter id="globe-glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="8" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {globeSpherePath && (
                    <path
                      d={globeSpherePath}
                      fill="url(#globe-ocean)"
                      stroke="hsl(var(--primary))"
                      strokeOpacity="0.45"
                      strokeWidth="1.5"
                      filter="url(#globe-glow)"
                    />
                  )}
                  {globeGraticulePath && (
                    <path
                      d={globeGraticulePath}
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeOpacity="0.16"
                      strokeWidth="0.7"
                    />
                  )}

                  <g>
                    {worldCountryFeatures.map((countryFeature) => {
                      const pathData = globePath(countryFeature);
                      if (!pathData) return null;

                      const countryId = String(countryFeature.id ?? "");
                      const cooperationCountry = countryById.get(countryId);
                      const isCooperationCountry = cooperationCountryIds.has(countryId);
                      const isSelected = selectedCountry.countryId === countryId;

                      return (
                        <path
                          key={countryId || countryFeature.properties?.name}
                          d={pathData}
                          role={isCooperationCountry ? "button" : undefined}
                          tabIndex={isCooperationCountry ? 0 : undefined}
                          aria-label={cooperationCountry?.name}
                          onClick={() => {
                            if (cooperationCountry) setSelectedCountry(cooperationCountry);
                          }}
                          onKeyDown={(event) => {
                            if (
                              cooperationCountry &&
                              (event.key === "Enter" || event.key === " ")
                            ) {
                              event.preventDefault();
                              setSelectedCountry(cooperationCountry);
                            }
                          }}
                          fill="hsl(var(--secondary))"
                          fillOpacity={isSelected ? 0.82 : isCooperationCountry ? 0.5 : 0.72}
                          stroke={
                            isSelected || isCooperationCountry
                              ? "hsl(var(--primary))"
                              : "hsl(var(--background))"
                          }
                          strokeOpacity={isSelected ? 0.95 : isCooperationCountry ? 0.7 : 0.65}
                          strokeWidth={isSelected ? 1.35 : isCooperationCountry ? 0.9 : 0.45}
                          className={isCooperationCountry ? "cursor-pointer transition-opacity hover:opacity-90" : ""}
                        />
                      );
                    })}
                  </g>

                  <g>
                    {projectedCountries.map((country) => {
                      const [x, y] = country.point;
                      const isSelected = selectedCountry.name === country.name;
                      const offset = country.labelOffset ?? {
                        dx: 14,
                        dy: -8,
                        anchor: "start" as const,
                      };

                      return (
                        <g
                          key={country.name}
                          role="button"
                          tabIndex={0}
                          aria-pressed={isSelected}
                          aria-label={country.name}
                          onClick={() => setSelectedCountry(country)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              setSelectedCountry(country);
                            }
                          }}
                          className="cursor-pointer"
                        >
                          <circle
                            cx={x}
                            cy={y}
                            r={isSelected ? 8 : 5.5}
                            fill="hsl(var(--primary))"
                            stroke="hsl(var(--background))"
                            strokeWidth="2"
                          />
                          <circle
                            cx={x}
                            cy={y}
                            r={isSelected ? 18 : 12}
                            fill="none"
                            stroke="hsl(var(--primary))"
                            strokeOpacity={isSelected ? 0.55 : 0.25}
                            strokeWidth="1.5"
                          />
                          <text
                            x={x + offset.dx}
                            y={y + offset.dy}
                            textAnchor={offset.anchor}
                            dominantBaseline="middle"
                            fill={
                              isSelected
                                ? "hsl(var(--primary))"
                                : "hsl(var(--foreground))"
                            }
                            stroke="hsl(var(--background))"
                            strokeWidth="4"
                            paintOrder="stroke"
                            className="select-none text-[12px] font-semibold"
                          >
                            {country.name}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                </svg>

                <div className="mt-5 flex flex-wrap gap-2">
                  {countries.map((country) => (
                    <button
                      key={country.name}
                      type="button"
                      onClick={() => setSelectedCountry(country)}
                      className={`border px-3 py-2 text-sm font-semibold transition-colors ${
                        selectedCountry.name === country.name
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                      }`}
                    >
                      {country.name}
                    </button>
                  ))}
                </div>
              </div>

              <aside className="border border-border bg-navy-deep p-6">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 shrink-0 text-primary" size={24} />
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-primary">
                      выбранная страна
                    </div>
                    <h3 className="mt-3 font-display text-3xl font-semibold leading-tight">
                      {selectedCountry.name}
                    </h3>
                  </div>
                </div>

                <div className="mt-6 grid gap-px border border-border bg-border sm:grid-cols-2 xl:grid-cols-1">
                  {countryStats.map((stat) => (
                    <div key={stat.key} className="bg-background/45 p-4">
                      <div className="font-display text-3xl font-semibold text-primary">
                        {selectedCountry[stat.key]}
                      </div>
                      <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 border-l-2 border-primary pl-4 text-sm leading-relaxed text-muted-foreground">
                  Статистика отражает текущую карточку страны на странице и может быть расширена
                  данными о документах, проектах, мероприятиях и партнерах.
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-navy-deep py-16 md:py-24">
        <div className="container">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-5">
            <div>
              <div className="section-label mb-5">Фото и материалы</div>
              <h2 className="font-display text-3xl font-semibold md:text-4xl">Фотогалерея</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {galleryFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setGalleryFilter(filter)}
                  className={`border px-4 py-2 text-sm font-semibold transition-colors ${
                    galleryFilter === filter
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {filteredGallery.map((item) => (
              <article key={`${item.title}-${item.category}`} className="bg-background/55">
                <div className="flex aspect-[4/3] items-center justify-center bg-navy-deep">
                  <div className="text-center">
                    <Image className="mx-auto text-primary" size={34} />
                    <div className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {item.image}
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="text-xs uppercase tracking-wider text-primary">{item.category}</div>
                  <h3 className="mt-2 font-display text-lg font-semibold">{item.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="section-label mb-5">Контакты</div>
            <h2 className="font-display text-3xl font-semibold leading-tight md:text-4xl">
              Комитет по международной политике АСКАО
            </h2>
            <div className="mt-7 space-y-4 text-muted-foreground">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 shrink-0 text-primary" size={20} />
                <span>г. Москва, ул. Обручева, д. 30/1, стр. 1</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="shrink-0 text-primary" size={20} />
                <span>уточняется</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="shrink-0 text-primary" size={20} />
                <span>уточняется</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe2 className="shrink-0 text-primary" size={20} />
                <span>аскао.рф</span>
              </div>
            </div>
          </div>

          <article className="border border-border bg-navy-deep p-6 md:p-8 lg:col-span-7">
            <div className="mb-5 flex items-center gap-3">
              <UsersRound className="text-primary" size={22} />
              <h3 className="font-display text-2xl font-semibold">Контактное лицо</h3>
            </div>
            <dl className="grid gap-px border border-border bg-border sm:grid-cols-2">
              {[
                ["ФИО", "уточняется"],
                ["Должность", "уточняется"],
                ["Телефон", "уточняется"],
                ["E-mail", "уточняется"],
              ].map(([label, value]) => (
                <div key={label} className="bg-background/45 p-4">
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
                  <dd className="mt-2 font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
          </article>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default CommitteeDetailPage;
