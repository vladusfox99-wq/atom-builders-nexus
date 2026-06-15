export interface AssociationEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  type: string;
  location: string;
  format: "Очно" | "Онлайн" | "Гибрид";
  description: string;
  registrationUrl?: string;
}

type CmsEvent = Partial<AssociationEvent>;

const cmsEventModules = import.meta.glob("./cms/events/*.json", { eager: true });

const normalizeEvent = (raw: CmsEvent): AssociationEvent | null => {
  if (
    typeof raw.id !== "string" ||
    typeof raw.title !== "string" ||
    typeof raw.date !== "string" ||
    typeof raw.type !== "string" ||
    typeof raw.location !== "string" ||
    !["Очно", "Онлайн", "Гибрид"].includes(raw.format ?? "") ||
    typeof raw.description !== "string"
  ) {
    return null;
  }

  return {
    id: raw.id,
    title: raw.title,
    date: raw.date,
    time: typeof raw.time === "string" && raw.time.trim() ? raw.time.trim() : undefined,
    type: raw.type,
    location: raw.location,
    format: raw.format as AssociationEvent["format"],
    description: raw.description,
    registrationUrl:
      typeof raw.registrationUrl === "string" && raw.registrationUrl.trim()
        ? raw.registrationUrl.trim()
        : undefined,
  };
};

export const events: AssociationEvent[] = Object.values(cmsEventModules)
  .map((module) => normalizeEvent((module as { default: CmsEvent }).default))
  .filter((event): event is AssociationEvent => event !== null)
  .sort((left, right) => left.date.localeCompare(right.date));

