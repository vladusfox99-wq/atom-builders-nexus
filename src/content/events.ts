import { committeeEvents } from "./committeeEvents";

export interface AssociationEvent {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  dateLabel?: string;
  time?: string;
  type: string;
  location: string;
  format: "Очно" | "Онлайн" | "Гибрид";
  description: string;
  registrationUrl?: string;
  source?: "association" | "committee";
  committeeId?: string;
  committeeTitle?: string;
  sourcePagePath?: string;
  city?: string;
  country?: string;
  results?: string;
  status?: "past" | "planned";
}

type CmsEvent = Partial<AssociationEvent>;

const cmsEventModules = import.meta.glob("./cms/events/*.json", { eager: true });
const validFormats: AssociationEvent["format"][] = ["Очно", "Онлайн", "Гибрид"];

const normalizeEvent = (raw: CmsEvent): AssociationEvent | null => {
  if (
    typeof raw.id !== "string" ||
    typeof raw.title !== "string" ||
    typeof raw.date !== "string" ||
    typeof raw.type !== "string" ||
    typeof raw.location !== "string" ||
    !validFormats.includes((raw.format ?? "") as AssociationEvent["format"]) ||
    typeof raw.description !== "string"
  ) {
    return null;
  }

  return {
    id: raw.id,
    title: raw.title,
    date: raw.date,
    endDate:
      typeof raw.endDate === "string" && raw.endDate.trim() ? raw.endDate.trim() : undefined,
    dateLabel:
      typeof raw.dateLabel === "string" && raw.dateLabel.trim()
        ? raw.dateLabel.trim()
        : undefined,
    time: typeof raw.time === "string" && raw.time.trim() ? raw.time.trim() : undefined,
    type: raw.type,
    location: raw.location,
    format: raw.format as AssociationEvent["format"],
    description: raw.description,
    registrationUrl:
      typeof raw.registrationUrl === "string" && raw.registrationUrl.trim()
        ? raw.registrationUrl.trim()
        : undefined,
    source: "association",
  };
};

const normalizedCmsEvents = Object.values(cmsEventModules)
  .map((module) => normalizeEvent((module as { default: CmsEvent }).default))
  .filter((event): event is AssociationEvent => event !== null);

const normalizedCommitteeEvents: AssociationEvent[] = committeeEvents.map((event) => ({
  ...event,
  source: "committee",
}));

export const events: AssociationEvent[] = [
  ...normalizedCmsEvents,
  ...normalizedCommitteeEvents,
].sort((left, right) => left.date.localeCompare(right.date));
