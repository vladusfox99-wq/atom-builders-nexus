import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type Language = "ru" | "en";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (text: string) => string;
};

const STORAGE_KEY = "askao-language";
const DEFAULT_LANGUAGE: Language = "ru";

const exactTranslations: Record<string, string> = {
  "Загрузка страницы": "Loading page",
  "Меню": "Menu",
  "О нас": "About",
  "Участники": "Members",
  "Комитеты": "Committees",
  "Кластеры": "Clusters",
  "Проекты": "Projects",
  "Новости": "News",
  "Новости и": "News and",
  "события": "Events",
  "Календарь": "Calendar",
  "Видео": "Video",
  "На главную": "Home",
  "К комитетам": "Back to Committees",
  "Комитеты АСКАО": "ASKAO Committees",
  "АСКАО": "ASKAO",
  "Атомная отрасль": "Nuclear Industry",
  "Ассоциация организаций строительного комплекса атомной отрасли":
    "Association of Nuclear Industry Construction Complex Organizations",
  "Все права защищены.": "All rights reserved.",
  "Главная": "Home",
  "Подробнее": "Learn more",
  "Все новости": "All news",
  "Показать больше": "Show more",
  "Строительство АЭС": "NPP Construction",
  "Инженеры на строительной площадке": "Engineers at a construction site",
  "BIM модель": "BIM model",
  "Карта офиса АСКАО": "ASKAO office map",

  "52°N / 38°E · РОССИЯ": "52°N / 38°E · RUSSIA",
  "Ассоциация · с 2018 года": "Association · since 2018",
  "Ассоциация · с 2018": "Association · since 2018",
  "АСКАО — ядро строительного комплекса атомной отрасли":
    "ASKAO — the core of the nuclear industry construction complex",
  "ядро": "core",
  "Объединяем ведущие проектные, инжиниринговые и подрядные организации для реализации крупнейших инфраструктурных проектов России и зарубежья.":
    "We unite leading design, engineering and contracting organizations to deliver major infrastructure projects in Russia and abroad.",
  "организаций": "organizations",
  "работ Росатома": "of Rosatom work",
  "лет в отрасли": "years in the industry",
  "стран присутствия": "countries of presence",

  "О компании": "About the Company",
  "Консолидация отрасли ради сложных задач": "Industry consolidation for complex challenges",
  "сложных задач": "complex challenges",
  "АСКАО формирует профессиональные команды и аккумулирует ресурсы для реализации стратегических объектов использования атомной энергии в России и за рубежом.":
    "ASKAO forms professional teams and consolidates resources to deliver strategic nuclear energy facilities in Russia and abroad.",
  "Крупнейшая ассоциация строительного комплекса атомной отрасли России":
    "Russia's largest association in the nuclear industry construction complex",
  "130+ организаций — от проектных до подрядных":
    "130+ organizations — from design companies to contractors",
  "Прямое участие в программах Госкорпорации «Росатом»":
    "Direct participation in Rosatom State Corporation programs",
  "Полный цикл компетенций: от концепции до ввода в эксплуатацию":
    "Full competency cycle: from concept to commissioning",

  "Деятельность": "Activities",
  "Чем занимается АСКАО": "What ASKAO Does",
  "Пять направлений, формирующих стратегическую повестку строительного комплекса атомной отрасли.":
    "Five areas shaping the strategic agenda of the nuclear industry construction complex.",
  "Консолидация участников рынка": "Market Participant Consolidation",
  "Объединяем ключевых игроков отрасли для совместной реализации проектов.":
    "We unite key industry players for joint project delivery.",
  "Реализация проектов ОИАЭ": "Delivery of Nuclear Facility Projects",
  "Полный спектр работ по объектам использования атомной энергии.":
    "A full scope of work for nuclear energy facilities.",
  "Внедрение цифровых технологий": "Implementation of Digital Technologies",
  "BIM-моделирование, цифровые двойники, автоматизация процессов.":
    "BIM modeling, digital twins and process automation.",
  "Повышение эффективности": "Efficiency Improvement",
  "Оптимизация процессов строительства и сокращение сроков.":
    "Optimization of construction processes and schedule reduction.",
  "Развитие отраслевых стандартов": "Development of Industry Standards",
  "Формирование нормативной базы и лучших практик отрасли.":
    "Development of the regulatory base and industry best practices.",

  "Компетенции": "Competencies",
  "Полный цикл от идеи до объекта": "A full cycle from idea to facility",
  "идеи": "idea",
  "Совокупная экспертиза участников ассоциации покрывает все этапы реализации сложнейших инфраструктурных проектов.":
    "The combined expertise of association members covers every stage of complex infrastructure project delivery.",
  "Разработка проектной документации для объектов любой сложности с соблюдением требований ядерной и радиационной безопасности.":
    "Development of design documentation for facilities of any complexity in compliance with nuclear and radiation safety requirements.",
  "Полный спектр инжиниринговых услуг — от технико-экономического обоснования до сопровождения эксплуатации.":
    "A full range of engineering services — from feasibility studies to operational support.",
  "Возведение объектов использования атомной энергии под ключ, включая монтаж сложного технологического оборудования.":
    "Turnkey construction of nuclear energy facilities, including installation of complex process equipment.",
  "Управление проектами": "Project Management",
  "Координация участников, контроль сроков и бюджетов, риск-менеджмент на всех этапах жизненного цикла.":
    "Coordination of participants, schedule and budget control, and risk management at every lifecycle stage.",
  "Цифровое моделирование (BIM)": "Digital Modeling (BIM)",
  "Информационное моделирование зданий, цифровые двойники, единая среда общих данных.":
    "Building information modeling, digital twins and a common data environment.",

  "Масштаб, измеримый в цифрах": "Scale measured in numbers",
  "250 тыс.": "250k",
  "Все участники": "All Members",
  "Экосистема крупных игроков": "An ecosystem of major players",
  "крупных игроков": "major players",
  "130+ организаций — проектировщики, производители и подрядные организации, формирующие опорный каркас атомного строительства.":
    "130+ organizations — designers, manufacturers and contractors forming the backbone of nuclear construction.",

  "Инновации": "Innovation",
  "Технологии, меняющие отрасль": "Technologies changing the industry",
  "отрасль": "the industry",
  "Активное внедрение цифровых решений и индустриальных платформ нового поколения.":
    "Active implementation of digital solutions and next-generation industrial platforms.",
  "Цифровое строительство": "Digital Construction",
  "Сквозная цифровизация процессов от проектирования до эксплуатации.":
    "End-to-end digitalization of processes from design to operation.",
  "BIM-моделирование": "BIM Modeling",
  "Единая информационная модель и цифровой двойник объекта.":
    "A unified information model and a facility digital twin.",
  "Автоматизация процессов": "Process Automation",
  "Роботизация рутинных операций и интеграция систем.":
    "Robotization of routine operations and system integration.",
  "Управление данными": "Data Management",
  "Платформы общих данных и единая среда коллаборации.":
    "Common data platforms and a unified collaboration environment.",

  "Преимущества": "Benefits",
  "Что даёт членство": "What membership provides",
  "членство": "membership",
  "Доступ к проектам": "Access to Projects",
  "Прямое участие в крупнейших инфраструктурных программах атомной отрасли.":
    "Direct participation in the largest nuclear industry infrastructure programs.",
  "Отраслевые связи": "Industry Connections",
  "Прямой контакт с ключевыми участниками рынка и Госкорпорацией «Росатом».":
    "Direct contact with key market participants and Rosatom State Corporation.",
  "Участие в стандартах": "Participation in Standards",
  "Возможность влиять на разработку отраслевых норм и регламентов.":
    "An opportunity to influence the development of industry norms and regulations.",
  "Обмен опытом": "Knowledge Exchange",
  "Площадка для совместной работы, форумов, семинаров и исследовательских инициатив.":
    "A platform for joint work, forums, seminars and research initiatives.",
  "Усиление позиций": "Stronger Market Position",
  "Повышение узнаваемости, рейтинга и конкурентоспособности на рынке.":
    "Improved recognition, reputation and market competitiveness.",

  "Свяжитесь с нами": "Contact Us",
  "нами": "us",
  "Актуальные контактные данные ассоциации.": "Current contact details of the association.",
  "Телефоны": "Phones",
  "Адрес": "Address",
  "Локация": "Location",
  "Открыть карту": "Open Map",
  "г. Москва, ул. Обручева, д. 30/1, стр.1, 6 этаж":
    "Moscow, Obrucheva St., 30/1, bldg. 1, 6th floor",

  "Регистрация": "Registration",
  "Открыть страницу комитета": "Open committee page",
  "Открыть на Rutube": "Open on Rutube",
  "Видео пока не опубликованы.": "No videos have been published yet.",
  "Страница не найдена": "Page not found",
  "Комитет не найден": "Committee not found",
  "Запрошенная страница не найдена. Перейдите на главную страницу сайта АСКАО.":
    "The requested page was not found. Go to the ASKAO home page.",
  "Возможно, адрес был изменён или страница больше не существует. Проверьте ссылку или вернитесь на":
    "The address may have changed or the page may no longer exist. Check the link or return to",

  "О Комитете": "About the Committee",
  "Комитет по международной политике АСКАО": "ASKAO International Policy Committee",
  "Комитет по международной политики АСКАО": "ASKAO International Policy Committee",
  "Комитет формирует международную повестку АСКАО и развивает связи с зарубежными партнерами, отраслевыми объединениями и экспертными площадками. Его работа помогает участникам ассоциации продвигать компетенции, готовить совместные проекты и участвовать в международных мероприятиях.":
    "The Committee shapes ASKAO's international agenda and develops ties with foreign partners, industry associations and expert platforms. Its work helps association members promote competencies, prepare joint projects and participate in international events.",
  "Комитет объединяет участников ассоциации вокруг задач международного сотрудничества, проектной кооперации и продвижения отраслевых компетенций. Он выступает координатором международных инициатив и помогает выстраивать понятный контур взаимодействия с зарубежными партнерами.":
    "The Committee unites association members around international cooperation, project collaboration and the promotion of industry competencies. It coordinates international initiatives and helps build a clear framework for interaction with foreign partners.",
  "Формировать международную повестку АСКАО и представлять компетенции участников ассоциации на внешних рынках.":
    "Shape ASKAO's international agenda and present member competencies in foreign markets.",
  "Развивать устойчивые партнерские связи с отраслевыми объединениями, государственными структурами и деловыми площадками.":
    "Develop sustainable partnerships with industry associations, government bodies and business platforms.",
  "Комитет работает как экспертная и коммуникационная площадка внутри АСКАО, связывая запросы участников ассоциации с международными направлениями, партнерами, мероприятиями и проектными возможностями.":
    "The Committee operates as an expert and communication platform within ASKAO, connecting member needs with international areas, partners, events and project opportunities.",
  "Международная деятельность": "International Activity",
  "Положение о Комитете": "Committee Regulations",
  "Миссия": "Mission",
  "Основные направления деятельности": "Core Areas of Activity",
  "Роль Комитета в структуре АСКАО": "Role of the Committee within ASKAO",
  "Цели и задачи": "Goals and Objectives",
  "Приоритеты международной работы": "International Work Priorities",
  "Развитие международного сотрудничества участников АСКАО.":
    "Development of international cooperation among ASKAO members.",
  "Расширение географии отраслевых партнерств и деловых контактов.":
    "Expansion of industry partnerships and business contacts.",
  "Продвижение компетенций российских организаций строительного комплекса атомной отрасли за рубежом.":
    "Promotion of Russian nuclear construction competencies abroad.",
  "Создание условий для реализации совместных проектов, соглашений и деловых миссий.":
    "Creating conditions for joint projects, agreements and business missions.",
  "Координация международных инициатив участников ассоциации.":
    "Coordination of international initiatives by association members.",
  "Подготовка предложений по соглашениям, меморандумам и дорожным картам сотрудничества.":
    "Preparation of proposals for agreements, memoranda and cooperation roadmaps.",
  "Организация международных мероприятий, встреч, круглых столов и деловых миссий.":
    "Organization of international events, meetings, roundtables and business missions.",
  "Сбор и систематизация аналитики по зарубежным рынкам и потенциальным партнерам.":
    "Collection and systematization of analytics on foreign markets and potential partners.",
  "Сопровождение коммуникаций с иностранными организациями и экспертными площадками.":
    "Support for communications with foreign organizations and expert platforms.",
  "Цели": "Goals",
  "Задачи": "Tasks",
  "Направления деятельности": "Areas of Activity",
  "Состав Комитета": "Committee Members",
  "Соглашения и меморандумы о сотрудничестве": "Cooperation Agreements and Memoranda",
  "Международные партнеры": "International Partners",
  "Построение рабочих связей с зарубежными организациями и отраслевыми объединениями.":
    "Building working relationships with foreign organizations and industry associations.",
  "Сопровождение проектных инициатив от первичной проработки до реализации.":
    "Support for project initiatives from initial development through implementation.",
  "Поиск инвестиционных возможностей и партнерских форматов для участников АСКАО.":
    "Search for investment opportunities and partnership formats for ASKAO members.",
  "Участие в форумах, конференциях, выставках, деловых миссиях и заседаниях.":
    "Participation in forums, conferences, exhibitions, business missions and meetings.",
  "Подготовка обзоров рынков, стран, партнеров и отраслевых практик.":
    "Preparation of reviews of markets, countries, partners and industry practices.",
  "Формирование кооперационных цепочек и совместных решений для зарубежных проектов.":
    "Formation of cooperation chains and joint solutions for foreign projects.",
  "Международные проекты": "International Projects",
  "Мероприятия": "Events",
  "Прошедшие мероприятия": "Past Events",
  "Планируемые мероприятия": "Planned Events",
  "География сотрудничества": "Cooperation Geography",
  "Страны международного взаимодействия": "Countries of International Cooperation",
  "выбранная страна": "selected country",
  "Соглашения": "Agreements",
  "Партнеры": "Partners",
  "Фото и материалы": "Photos and Materials",
  "Фотогалерея": "Photo Gallery",
  "Контакты": "Contacts",
  "Контактное лицо": "Contact Person",
  "Председатель Комитета": "Committee Chair",
  "Заместитель председателя Комитета": "Deputy Committee Chair",
  "Советник по международно-правовым вопросам": "International Legal Affairs Adviser",
  "Члены экспертного совета": "Expert Council Members",
  "Организации членов АСКАО": "ASKAO Member Organizations",
  "Состав уточняется": "Membership to be confirmed",
  "Координация работы Комитета и международной повестки.":
    "Coordination of the Committee's work and international agenda.",
  "Сопровождение рабочих направлений и взаимодействия участников.":
    "Support for workstreams and member interaction.",
  "Правовая экспертиза международных инициатив и документов.":
    "Legal review of international initiatives and documents.",
  "Названия организаций членов АСКАО будут добавлены после утверждения состава.":
    "Member organization names will be added after the composition is approved.",
  "ФИО": "Full Name",
  "Должность": "Position",
  "Телефон": "Phone",
  "E-mail": "Email",
  "Страна": "Country",
  "Дата подписания": "Signing Date",
  "Документ": "Document",
  "Начало": "Start",
  "Завершение": "End",
  "Профиль": "Profile",
  "Инструменты поддержки": "Support Tools",
  "все": "all",
  "мероприятия": "events",
  "подписания соглашений": "agreement signings",
  "деловые миссии": "business missions",
  "проекты": "projects",
  "Форум": "Forum",
  "Выставка": "Exhibition",
  "Конференция": "Conference",
  "Встреча": "Meeting",
  "Группа": "Group",
  "уточняется": "to be confirmed",
  "Итоги будут добавлены после мероприятия.": "Results will be added after the event.",
  "Итоги и материалы уточняются.": "Results and materials are being confirmed.",

  "Россия": "Russia",
  "Росатом": "Rosatom",
  "Беларусь": "Belarus",
  "Казахстан": "Kazakhstan",
  "Узбекистан": "Uzbekistan",
  "Таджикистан": "Tajikistan",
  "Индия": "India",
  "Индонезия (Бали)": "Indonesia (Bali)",
  "Вьетнам": "Vietnam",
  "Китай": "China",
  "Турция": "Turkey",
  "Республика Гана": "Republic of Ghana",
  "Гвинея": "Guinea",
  "ОАЭ": "UAE",
  "Другие страны": "Other Countries",
  "Египет": "Egypt",
  "Венгрия": "Hungary",
  "Нью-Дели": "New Delhi",
  "Москва": "Moscow",
  "Ташкент": "Tashkent",
  "Стамбул": "Istanbul",
  "Москва, Россия": "Moscow, Russia",
  "Ташкент, Узбекистан": "Tashkent, Uzbekistan",
  "Стамбул, Турция": "Istanbul, Türkiye",
  "Нью-Дели, Индия": "New Delhi, India",
  "г. Москва, ул. Обручева, д. 30/1, стр. 1":
    "Moscow, Obrucheva St., 30/1, bldg. 1",

  "Текущие проекты": "Current Projects",
  "Перспективные проекты": "Prospective Projects",
  "Инвестиционный портфель": "Investment Portfolio",
  "В реализации": "In Progress",
  "Перспектива": "Prospective",
  "Инвестпортфель": "Investment Portfolio",
  "Портфель проектов": "Project Portfolio",
  "Проекты АСКАО": "ASKAO Projects",
  "Текущие, перспективные и инвестиционные проекты Ассоциации организаций строительного комплекса атомной отрасли.":
    "Current, prospective and investment projects of the Association of Nuclear Industry Construction Complex Organizations.",
  "Проекты, которые в презентации отмечены как реализуемые с участием организаций АСКАО.":
    "Projects identified in the presentation as being implemented with ASKAO member organizations.",
  "Проекты из дорожной карты развития и планирования новых направлений работ.":
    "Projects from the development roadmap and planning of new areas of work.",
  "Формируемый пул инвестиционных инициатив участников АСКАО с возможными мерами поддержки.":
    "A developing pool of investment initiatives from ASKAO members with potential support measures.",

  "Медиатека": "Media Library",
  "Видео АСКАО": "ASKAO Video",
  "Видео Ассоциации организаций строительного комплекса атомной отрасли.":
    "Videos of the Association of Nuclear Industry Construction Complex Organizations.",
  "Материалы об ассоциации, её деятельности и событиях строительного комплекса атомной отрасли.":
    "Materials about the association, its activities and events in the nuclear construction complex.",

  "Новости АСКАО": "ASKAO News",
  "Новости и события": "News and Events",
  "Событие": "Event",
  "Технологии": "Technologies",
  "Общее собрание АСКАО: итоги года и стратегия развития до 2030":
    "ASKAO General Meeting: year-end results and development strategy to 2030",
  "Общее собрание АСКАО: итоги и стратегия развития до 2030":
    "ASKAO General Meeting: results and development strategy to 2030",
  "Новости и события Ассоциации организаций строительного комплекса атомной отрасли.":
    "News and events of the Association of Nuclear Industry Construction Complex Organizations.",
  "Другие новости": "More News",
  "Материал не найден": "Article Not Found",

  "Масштаб": "Scale",
  "в": "in",
  "цифрах": "numbers",
  "организаций-участников": "member organizations",
  "строительных работ Росатома": "of Rosatom construction work",
  "международных проектов": "international projects",
  "квалифицированных специалистов": "qualified specialists",
  "Крупнейшие проектные, инжиниринговые и строительные организации":
    "Major design, engineering and construction organizations",
  "Доля работ, выполняемых членами ассоциации":
    "Share of work performed by association members",
  "АЭС, НИЦ и индустриальные объекты по всему миру":
    "NPPs, research centers and industrial facilities worldwide",
  "Инженеров, проектировщиков и строителей в команде":
    "Engineers, designers and builders in the team",

  "Проектирование": "Design",
  "Инжиниринг": "Engineering",
  "Строительство": "Construction",
  "Производство": "Manufacturing",
  "Оборудование": "Equipment",
  "Наука": "Science",
  "Управление": "Management",
  "Материалы": "Materials",
  "Сервис": "Services",
  "Безопасность": "Safety",
};

const phraseTranslations: Array<[string, string]> = [
  ["АСКАО —", "ASKAO —"],
  ["строительного комплекса", "construction complex"],
  ["атомной отрасли", "nuclear industry"],
  ["Консолидация отрасли", "Industry consolidation"],
  ["ради", "for"],
  ["Чем занимается", "What"],
  ["Полный цикл", "Full cycle"],
  ["до объекта", "to facility"],
  ["Масштаб, измеримый", "Scale measured"],
  ["в цифрах", "in numbers"],
  ["Экосистема", "Ecosystem"],
  ["Технологии,", "Technologies"],
  ["меняющие", "changing"],
  ["Что даёт", "What"],
  ["Новости и события", "News and Events"],
  ["СОБЫТИЕ", "EVENT"],
  ["ТЕХНОЛОГИИ", "TECHNOLOGIES"],
  ["Общее собрание АСКАО: итоги и стратегия развития до 2030", "ASKAO General Meeting: results and development strategy to 2030"],
  ["Внедрение единого BIM-стандарта на стройплощадках Росатома", "Implementation of a unified BIM standard at Rosatom construction sites"],
  ["Форум «АтомСтрой-2026»: более 1500 специалистов отрасли", "AtomStroy 2026 Forum: more than 1,500 industry specialists"],
  ["Свяжитесь с", "Contact"],
  ["доб.", "ext."],
  ["г.", ""],
  ["АСКАО.", "ASKAO."],
  ["Ассоциация организаций строительного комплекса атомной отрасли", "Association of Nuclear Industry Construction Complex Organizations"],
  ["Комитет по международной политике АСКАО", "ASKAO International Policy Committee"],
  ["строительного комплекса атомной отрасли", "nuclear industry construction complex"],
  ["строительный комплекс атомной отрасли", "nuclear industry construction complex"],
  ["атомной отрасли", "nuclear industry"],
  ["международного сотрудничества", "international cooperation"],
  ["международной повестки", "international agenda"],
  ["зарубежными партнерами", "foreign partners"],
  ["отраслевыми объединениями", "industry associations"],
  ["экспертными площадками", "expert platforms"],
  ["участников ассоциации", "association members"],
  ["участники ассоциации", "association members"],
  ["участников АСКАО", "ASKAO members"],
  ["организаций АСКАО", "ASKAO organizations"],
  ["компетенции участников", "members' competencies"],
  ["совместные проекты", "joint projects"],
  ["международных мероприятиях", "international events"],
  ["международные мероприятия", "international events"],
  ["деловые миссии", "business missions"],
  ["партнерские встречи", "partner meetings"],
  ["проектные инициативы", "project initiatives"],
  ["дорожным картам", "roadmaps"],
  ["соглашениям", "agreements"],
  ["меморандумам", "memoranda"],
  ["аналитика", "analytics"],
  ["аналитики", "analytics"],
  ["зарубежных рынках", "foreign markets"],
  ["потенциальным партнерам", "potential partners"],
  ["Сопровождение", "Support for"],
  ["Подготовка", "Preparation of"],
  ["Организация", "Organization of"],
  ["Координация", "Coordination of"],
  ["Развитие", "Development of"],
  ["Расширение", "Expansion of"],
  ["Продвижение", "Promotion of"],
  ["Создание условий", "Creating conditions"],
  ["Построение рабочих связей", "Building working relationships"],
  ["Поиск инвестиционных возможностей", "Search for investment opportunities"],
  ["Формирование кооперационных цепочек", "Formation of cooperation chains"],
  ["Подготовка обзоров", "Preparation of reviews"],
  ["Международное сотрудничество", "International Cooperation"],
  ["Международные проекты", "International Projects"],
  ["Международные инвестиции", "International Investments"],
  ["Международные мероприятия", "International Events"],
  ["Международная аналитика", "International Analytics"],
  ["Международная кооперация", "International Cooperation"],
  ["Партнерские организации", "Partner organizations"],
  ["Республика Таджикистан", "Republic of Tajikistan"],
  ["Республика Узбекистан", "Republic of Uzbekistan"],
  ["Республика Казахстан", "Republic of Kazakhstan"],
  ["Республика Беларусь", "Republic of Belarus"],
  ["Китайская Народная Республика", "People's Republic of China"],
  ["Республика Индия", "Republic of India"],
  ["Соглашение", "Agreement"],
  ["Меморандум", "Memorandum"],
  ["Дорожная карта", "Roadmap"],
  ["Протокол намерений", "Letter of Intent"],
  ["Проработка", "Under Development"],
  ["Реализация", "Implementation"],
  ["Подготовка", "Preparation"],
  ["Формат", "Format"],
  ["Очно", "In person"],
  ["Онлайн", "Online"],
  ["Гибрид", "Hybrid"],
  ["сентябрь", "September"],
  ["марта", "March"],
  ["февраля", "February"],
  ["июня", "June"],
  ["июля", "July"],
  ["апреля", "April"],
  ["мая", "May"],
  ["года", ""],
  ["перспективных проектов", "prospective projects"],
  ["текущих направлений", "current areas"],
  ["инвестиционный проект", "investment project"],
  ["проектная инициатива", "project initiative"],
  ["высокими требованиями", "strict requirements"],
  ["индустриальной безопасности", "industrial safety"],
  ["технологической кооперации", "technological cooperation"],
  ["производственной кооперации", "production cooperation"],
  ["участием организаций", "participation of organizations"],
  ["в России и за рубежом", "in Russia and abroad"],
  ["в России", "in Russia"],
  ["за рубежом", "abroad"],
  ["крупнейший", "major"],
  ["крупнейшие", "major"],
  ["проектирование", "design"],
  ["строительство", "construction"],
  ["производство", "manufacturing"],
  ["инжиниринг", "engineering"],
  ["оборудования", "equipment"],
  ["материалов", "materials"],
  ["комплексные услуги", "comprehensive services"],
  ["объектов промышленной инфраструктуры", "industrial infrastructure facilities"],
  ["атомной энергетике", "nuclear energy"],
  ["радиационного контроля", "radiation monitoring"],
  ["технические средства", "technical systems"],
  ["модульного судостроения", "modular shipbuilding"],
  ["полимерные модули плавучести", "polymer buoyancy modules"],
  ["Технические средства защиты объектов от БПЛА", "technical systems for protecting facilities from UAVs"],
  ["Все права защищены", "All rights reserved"],
];

const wordTranslations: Record<string, string> = {
  "АЭС": "NPP",
  "НИЦ": "Research Center",
  "АСММ": "Small Modular NPP",
  "Россия": "Russia",
  "Египет": "Egypt",
  "Турция": "Türkiye",
  "Узбекистан": "Uzbekistan",
  "Венгрия": "Hungary",
  "Гана": "Ghana",
  "Гвинея": "Guinea",
  "Индия": "India",
  "Китай": "China",
  "Беларусь": "Belarus",
  "Казахстан": "Kazakhstan",
  "Таджикистан": "Tajikistan",
  "Москва": "Moscow",
  "Ташкент": "Tashkent",
  "Стамбул": "Istanbul",
  "проект": "project",
  "проекты": "projects",
  "мероприятия": "events",
  "партнеры": "partners",
  "соглашения": "agreements",
  "страна": "country",
  "документ": "document",
  "участники": "participants",
  "контакты": "contacts",
  "новости": "news",
  "видео": "video",
  "календарь": "calendar",
  "комитет": "committee",
  "кластеры": "clusters",
};

const cyrillicPattern = /[А-Яа-яЁё]/;
const textNodeOriginals = new WeakMap<Text, string>();

const preserveWhitespace = (source: string, translated: string) => {
  const leading = source.match(/^\s*/)?.[0] ?? "";
  const trailing = source.match(/\s*$/)?.[0] ?? "";
  return `${leading}${translated}${trailing}`;
};

export const translateText = (source: string, language: Language = "en") => {
  if (language === "ru" || !cyrillicPattern.test(source)) return source;

  const trimmed = source.trim();
  if (!trimmed) return source;

  const exact = exactTranslations[trimmed];
  if (exact) return preserveWhitespace(source, exact);

  let translated = trimmed;
  for (const [ru, en] of [...phraseTranslations].sort((left, right) => right[0].length - left[0].length)) {
    translated = translated.split(ru).join(en);
  }

  translated = translated.replace(/\b[А-Яа-яЁёA-Za-z0-9«»"().\-]+/g, (token) => {
    const clean = token.replace(/[«»"().,;:!?]/g, "");
    const replacement = wordTranslations[clean];
    return replacement ? token.replace(clean, replacement) : token;
  });

  return preserveWhitespace(source, translated);
};

const translateAttribute = (element: Element, attribute: string, language: Language) => {
  const current = element.getAttribute(attribute);
  if (!current) return;

  const originalAttribute = `data-i18n-original-${attribute}`;
  const original = element.getAttribute(originalAttribute) ?? current;

  if (!element.hasAttribute(originalAttribute) && cyrillicPattern.test(current)) {
    element.setAttribute(originalAttribute, current);
  }

  element.setAttribute(attribute, language === "ru" ? original : translateText(original, language));
};

const translateElementTree = (root: ParentNode, language: Language) => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];

  while (walker.nextNode()) {
    textNodes.push(walker.currentNode as Text);
  }

  textNodes.forEach((node) => {
    const original = textNodeOriginals.get(node) ?? node.nodeValue ?? "";
    if (!textNodeOriginals.has(node) && cyrillicPattern.test(original)) {
      textNodeOriginals.set(node, original);
    }

    if (!textNodeOriginals.has(node)) return;
    node.nodeValue = language === "ru" ? original : translateText(original, language);
  });

  const elements =
    root instanceof Element
      ? [root, ...Array.from(root.querySelectorAll("*"))]
      : Array.from(root.querySelectorAll("*"));

  elements.forEach((element) => {
    ["aria-label", "alt", "title", "placeholder"].forEach((attribute) =>
      translateAttribute(element, attribute, language),
    );
  });
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const getInitialLanguage = (): Language => {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "en" || stored === "ru" ? stored : DEFAULT_LANGUAGE;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);
  const originalTitleRef = useRef<string | null>(null);

  const setLanguage = useCallback((nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    window.localStorage.setItem(STORAGE_KEY, nextLanguage);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === "ru" ? "en" : "ru");
  }, [language, setLanguage]);

  useEffect(() => {
    let isApplying = false;

    const applyTranslation = () => {
      if (isApplying) return;
      isApplying = true;
      document.documentElement.lang = language;
      if (!originalTitleRef.current && cyrillicPattern.test(document.title)) {
        originalTitleRef.current = document.title;
      }
      document.title =
        language === "ru"
          ? originalTitleRef.current ?? document.title
          : translateText(originalTitleRef.current ?? document.title, language);
      translateElementTree(document.body, language);
      isApplying = false;
    };

    applyTranslation();

    const observer = new MutationObserver(() => {
      if (isApplying) return;
      window.requestAnimationFrame(applyTranslation);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["aria-label", "alt", "title", "placeholder"],
    });

    return () => observer.disconnect();
  }, [language]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t: (text: string) => translateText(text, language),
    }),
    [language, setLanguage, toggleLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
