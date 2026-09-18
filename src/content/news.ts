export interface NewsItem {
  slug: string;
  title: string;
  date: string;
  tag: string;
  excerpt: string;
  content: NewsContentBlock[];
  images: NewsImage[];
}

export interface NewsImage {
  src: string;
  alt: string;
  fit?: "contain" | "cover";
}

export type NewsContentBlock = string
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; title: string; text: string };

type CmsContentItem = string | { type?: string; text?: string; title?: string; items?: string[] };
type CmsImageItem = string | { src?: string; alt?: string; fit?: "contain" | "cover" };
type CmsNewsItem = Omit<Partial<NewsItem>, "content" | "images"> & {
  content?: CmsContentItem[];
  images?: CmsImageItem[];
};

const cmsNewsModules = import.meta.glob("./cms/news/*.json", { eager: true });

const normalizeNewsItem = (raw: CmsNewsItem): NewsItem | null => {
  if (
    typeof raw.slug !== "string" ||
    typeof raw.title !== "string" ||
    typeof raw.date !== "string" ||
    typeof raw.tag !== "string" ||
    typeof raw.excerpt !== "string" ||
    !Array.isArray(raw.content)
  ) {
    return null;
  }

  const content = raw.content
    .map((value): NewsContentBlock | null => {
      if (typeof value === "string") return value;
      if (value?.type === "list" && Array.isArray(value.items)) {
        return { type: "list", items: value.items.filter((item): item is string => typeof item === "string") };
      }
      if (value?.type === "heading" && typeof value.text === "string") {
        return { type: "heading", text: value.text };
      }
      if (value?.type === "callout" && typeof value.title === "string" && typeof value.text === "string") {
        return { type: "callout", title: value.title, text: value.text };
      }
      if (value && typeof value === "object" && typeof value.text === "string") return value.text;
      return null;
    })
    .filter((value): value is NewsContentBlock => value !== null);

  const images = Array.isArray(raw.images)
    ? raw.images
        .map((value): NewsImage | null => {
          if (typeof value === "string") {
            return { src: value, alt: raw.title };
          }

          if (value && typeof value === "object" && typeof value.src === "string") {
            return {
              src: value.src,
              alt: typeof value.alt === "string" && value.alt.length > 0 ? value.alt : raw.title,
              fit: value.fit === "contain" ? "contain" : "cover",
            };
          }

          return null;
        })
        .filter((value): value is NewsImage => value !== null)
    : [];

  return {
    slug: raw.slug,
    title: raw.title,
    date: raw.date,
    tag: raw.tag,
    excerpt: raw.excerpt,
    content,
    images,
  };
};

export const newsItems: NewsItem[] = Object.values(cmsNewsModules)
  .map((module) => normalizeNewsItem((module as { default: CmsNewsItem }).default))
  .filter((item): item is NewsItem => item !== null)
  .sort((left, right) => right.date.localeCompare(left.date));
