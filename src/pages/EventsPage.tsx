import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
} from "lucide-react";
import Navbar from "@/components/askao/Navbar";
import Footer from "@/components/askao/Footer";
import { events, type AssociationEvent } from "@/content/events";
import { usePageSeo } from "@/lib/seo";

const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const toLocalDate = (value: string) => new Date(`${value}T00:00:00`);
const toDateKey = (value: Date) =>
  `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;

const formatMonth = (value: Date) =>
  value.toLocaleDateString("ru-RU", {
    month: "long",
    year: "numeric",
  });

const formatEventDate = (value: string) =>
  toLocalDate(value).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const getInitialMonth = () => {
  const todayKey = toDateKey(new Date());
  const nextEvent = events.find((event) => event.date >= todayKey);
  const initialEvent = nextEvent ?? events[events.length - 1];
  const initialDate = initialEvent ? toLocalDate(initialEvent.date) : new Date();

  return new Date(initialDate.getFullYear(), initialDate.getMonth(), 1);
};

const EventCard = ({ event }: { event: AssociationEvent }) => (
  <article className="group grid gap-6 bg-navy-deep p-6 transition-colors duration-500 hover:bg-navy-light md:grid-cols-12 md:p-8">
    <div className="md:col-span-3">
      <div className="font-display text-3xl font-bold text-primary">
        {toLocalDate(event.date).getDate().toString().padStart(2, "0")}
      </div>
      <div className="mt-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {toLocalDate(event.date).toLocaleDateString("ru-RU", {
          month: "long",
          year: "numeric",
        })}
      </div>
    </div>

    <div className="md:col-span-6">
      <div className="mb-3 flex flex-wrap gap-2">
        <span className="border border-primary/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary">
          {event.type}
        </span>
        <span className="border border-border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {event.format}
        </span>
      </div>
      <h3 className="font-display text-xl font-semibold leading-snug transition-colors group-hover:text-primary md:text-2xl">
        {event.title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
        {event.description}
      </p>
      {event.registrationUrl && (
        <a
          href={event.registrationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 border border-primary/40 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          Регистрация
          <ArrowUpRight size={16} />
        </a>
      )}
    </div>

    <div className="space-y-3 text-sm text-muted-foreground md:col-span-3">
      <div className="flex items-start gap-2">
        <CalendarDays className="mt-0.5 shrink-0 text-primary" size={16} />
        <span>{formatEventDate(event.date)}</span>
      </div>
      <div className="flex items-start gap-2">
        <MapPin className="mt-0.5 shrink-0 text-primary" size={16} />
        <span>{event.location}</span>
      </div>
      <div className="flex items-start gap-2">
        <Clock3 className="mt-0.5 shrink-0 text-primary" size={16} />
        <span>{event.time ?? "Время уточняется"}</span>
      </div>
    </div>
  </article>
);

const EventsPage = () => {
  const [visibleMonth, setVisibleMonth] = useState(getInitialMonth);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const todayKey = toDateKey(new Date());

  usePageSeo({
    title: "Календарь событий АСКАО",
    description:
      "Календарь мероприятий АСКАО: форумы, собрания, конференции и события строительного комплекса атомной отрасли.",
    path: "/events",
  });

  const eventsByDate = useMemo(() => {
    const grouped = new Map<string, AssociationEvent[]>();
    events.forEach((event) => {
      grouped.set(event.date, [...(grouped.get(event.date) ?? []), event]);
    });
    return grouped;
  }, []);

  const calendarDays = useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const mondayOffset = (firstDay.getDay() + 6) % 7;
    const startDate = new Date(year, month, 1 - mondayOffset);

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + index);
      return date;
    });
  }, [visibleMonth]);

  const selectedEvents = selectedDate ? eventsByDate.get(selectedDate) ?? [] : events;
  const upcomingEvents = events.filter((event) => event.date >= todayKey);

  const changeMonth = (offset: number) => {
    setVisibleMonth(
      (current) => new Date(current.getFullYear(), current.getMonth() + offset, 1),
    );
    setSelectedDate(null);
  };

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

          <div className="section-label mb-6">Календарь АСКАО</div>
          <h1 className="max-w-4xl font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-6xl lg:text-7xl">
            События <span className="text-gradient">атомной отрасли</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Форумы, общие собрания, конференции и рабочие встречи участников ассоциации.
          </p>
        </div>
      </section>

      <section className="border-b border-border py-16 md:py-24">
        <div className="container grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="border border-border bg-navy-deep">
              <div className="flex items-center justify-between border-b border-border p-4 md:p-6">
                <button
                  type="button"
                  onClick={() => changeMonth(-1)}
                  className="inline-flex h-10 w-10 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  aria-label="Предыдущий месяц"
                >
                  <ChevronLeft size={20} />
                </button>
                <h2 className="font-display text-xl font-semibold capitalize md:text-2xl">
                  {formatMonth(visibleMonth)}
                </h2>
                <button
                  type="button"
                  onClick={() => changeMonth(1)}
                  className="inline-flex h-10 w-10 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                  aria-label="Следующий месяц"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              <div className="grid grid-cols-7 border-b border-border bg-navy">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="border-r border-border py-3 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground last:border-r-0 md:text-xs"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7">
                {calendarDays.map((date) => {
                  const key = toDateKey(date);
                  const dayEvents = eventsByDate.get(key) ?? [];
                  const isCurrentMonth = date.getMonth() === visibleMonth.getMonth();
                  const isToday = key === todayKey;
                  const isSelected = key === selectedDate;

                  return (
                    <button
                      type="button"
                      key={key}
                      onClick={() => dayEvents.length > 0 && setSelectedDate(key)}
                      className={`relative min-h-20 border-b border-r border-border p-2 text-left transition-colors md:min-h-28 md:p-3 ${
                        isSelected
                          ? "bg-primary/15"
                          : dayEvents.length > 0
                            ? "bg-navy hover:bg-navy-light"
                            : "bg-navy-deep"
                      } ${isCurrentMonth ? "text-foreground" : "text-muted-foreground/30"}`}
                      disabled={dayEvents.length === 0}
                    >
                      <span
                        className={`inline-flex h-7 w-7 items-center justify-center text-xs md:text-sm ${
                          isToday ? "bg-primary font-bold text-primary-foreground" : ""
                        }`}
                      >
                        {date.getDate()}
                      </span>
                      {dayEvents.length > 0 && (
                        <div className="mt-2">
                          <span className="block h-1.5 w-1.5 bg-primary md:hidden" />
                          <span className="hidden text-[10px] font-semibold leading-tight text-primary md:block">
                            {dayEvents[0].title}
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="border border-border bg-navy-deep p-6 md:p-8">
              <div className="section-label mb-5">Ближайшие</div>
              <h2 className="font-display text-2xl font-semibold">Предстоящие события</h2>

              {upcomingEvents.length > 0 ? (
                <div className="mt-7 space-y-6">
                  {upcomingEvents.slice(0, 3).map((event) => (
                    <button
                      type="button"
                      key={event.id}
                      onClick={() => {
                        const date = toLocalDate(event.date);
                        setVisibleMonth(new Date(date.getFullYear(), date.getMonth(), 1));
                        setSelectedDate(event.date);
                      }}
                      className="block w-full border-t border-border pt-5 text-left first:border-t-0 first:pt-0"
                    >
                      <span className="font-mono text-xs text-primary">
                        {formatEventDate(event.date)}
                      </span>
                      <span className="mt-2 block font-display text-lg font-semibold leading-snug transition-colors hover:text-primary">
                        {event.title}
                      </span>
                      <span className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin size={14} /> {event.location}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-7 border border-border bg-background/30 p-5">
                  <CalendarDays className="text-primary" size={24} />
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    Новые мероприятия пока не опубликованы. Следите за обновлениями календаря.
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="section-label mb-4">
                {selectedDate ? "Выбранная дата" : "Архив"}
              </div>
              <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                {selectedDate ? formatEventDate(selectedDate) : "Все события"}
              </h2>
            </div>
            {selectedDate && (
              <button
                type="button"
                onClick={() => setSelectedDate(null)}
                className="w-fit border border-primary/40 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Показать все
              </button>
            )}
          </div>

          {selectedEvents.length > 0 ? (
            <div className="grid gap-px border border-border bg-border">
              {[...selectedEvents]
                .sort((left, right) => right.date.localeCompare(left.date))
                .map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
            </div>
          ) : (
            <div className="border border-border p-10 text-center text-muted-foreground">
              На выбранную дату событий нет.
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default EventsPage;
