export interface CommitteeEvent {
  id: string;
  committeeId: string;
  committeeTitle: string;
  sourcePagePath: string;
  title: string;
  date: string;
  endDate?: string;
  dateLabel?: string;
  time?: string;
  type: string;
  city: string;
  country: string;
  location: string;
  format: "Очно" | "Онлайн" | "Гибрид";
  description: string;
  results: string;
  status: "past" | "planned";
  registrationUrl?: string;
}

export const committeeEvents: CommitteeEvent[] = [
  {
    id: "international-policy-atomekspo-2026",
    committeeId: "international-cooperation",
    committeeTitle: "Комитет по международной политике АСКАО",
    sourcePagePath: "/committees/international-cooperation",
    title: "АТОМЭКСПО",
    date: "2026-09-01",
    dateLabel: "сентябрь 2026",
    type: "Форум",
    city: "Москва",
    country: "Россия",
    location: "Москва, Россия",
    format: "Очно",
    description:
      "Участие Комитета в международной деловой программе и партнерских встречах.",
    results: "Итоги будут добавлены после мероприятия.",
    status: "planned",
  },
  {
    id: "international-policy-innoprom-central-asia-2026",
    committeeId: "international-cooperation",
    committeeTitle: "Комитет по международной политике АСКАО",
    sourcePagePath: "/committees/international-cooperation",
    title: "INNOPROM Central Asia",
    date: "2026-04-20",
    endDate: "2026-04-22",
    dateLabel: "20-22 апреля 2026",
    type: "Выставка",
    city: "Ташкент",
    country: "Узбекистан",
    location: "Ташкент, Узбекистан",
    format: "Очно",
    description:
      "Проработка деловой миссии и встреч с профильными организациями.",
    results: "Итоги будут добавлены после мероприятия.",
    status: "past",
  },
  {
    id: "international-policy-nppes-turkey-2026",
    committeeId: "international-cooperation",
    committeeTitle: "Комитет по международной политике АСКАО",
    sourcePagePath: "/committees/international-cooperation",
    title: "NPPES Turkey",
    date: "2026-06-30",
    endDate: "2026-07-01",
    dateLabel: "30 июня - 1 июля 2026",
    type: "Конференция",
    city: "Стамбул",
    country: "Турция",
    location: "Стамбул, Турция",
    format: "Очно",
    description:
      "Международная площадка для обмена опытом по атомной энергетике.",
    results: "Итоги и материалы уточняются.",
    status: "planned",
  },
  {
    id: "international-policy-brics-forums-2026",
    committeeId: "international-cooperation",
    committeeTitle: "Комитет по международной политике АСКАО",
    sourcePagePath: "/committees/international-cooperation",
    title: "Форумы БРИКС",
    date: "2026-09-12",
    endDate: "2026-09-13",
    dateLabel: "12-13 сентября 2026",
    type: "Форум",
    city: "Нью-Дели",
    country: "Индия",
    location: "Нью-Дели, Индия",
    format: "Очно",
    description:
      "Площадка для продвижения кооперации и экспертных контактов.",
    results: "Итоги будут добавлены после мероприятия.",
    status: "planned",
  },
  {
    id: "international-policy-sco-forums-2025",
    committeeId: "international-cooperation",
    committeeTitle: "Комитет по международной политике АСКАО",
    sourcePagePath: "/committees/international-cooperation",
    title: "Форумы ШОС",
    date: "2025-05-23",
    dateLabel: "23 мая 2025",
    type: "Форум",
    city: "уточняется",
    country: "уточняется",
    location: "уточняется",
    format: "Очно",
    description:
      "Подготовка международной повестки и партнерских встреч.",
    results: "Итоги будут добавлены после мероприятия.",
    status: "past",
  },
];
