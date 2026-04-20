export interface NewsItem {
  slug: string;
  title: string;
  date: string;
  tag: string;
  excerpt: string;
  content: string[];
}

type CmsContentItem = string | { text?: string };
type CmsNewsItem = Omit<Partial<NewsItem>, "content"> & {
  content?: CmsContentItem[];
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
    .map((value) => {
      if (typeof value === "string") return value;
      if (value && typeof value === "object" && typeof value.text === "string") return value.text;
      return null;
    })
    .filter((value): value is string => value !== null);
  return {
    slug: raw.slug,
    title: raw.title,
    date: raw.date,
    tag: raw.tag,
    excerpt: raw.excerpt,
    content,
  };
};

export const newsItems: NewsItem[] = Object.values(cmsNewsModules)
  .map((module) => normalizeNewsItem((module as { default: CmsNewsItem }).default))
  .filter((item): item is NewsItem => item !== null)
  .sort((left, right) => right.date.localeCompare(left.date));
