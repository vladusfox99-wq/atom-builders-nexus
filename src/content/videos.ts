export interface VideoItem {
  id: string;
  title: string;
  description: string;
  sourceUrl: string;
  embedUrl: string;
}

type CmsVideoItem = Omit<Partial<VideoItem>, "embedUrl">;

const cmsVideoModules = import.meta.glob("./cms/videos/*.json", { eager: true });

const getRutubeEmbedUrl = (sourceUrl: string) => {
  const videoId = sourceUrl.match(/rutube\.ru\/(?:video|play\/embed)\/([a-zA-Z0-9]+)/)?.[1];
  return videoId ? `https://rutube.ru/play/embed/${videoId}` : null;
};

const normalizeVideo = (raw: CmsVideoItem): VideoItem | null => {
  if (
    typeof raw.id !== "string" ||
    typeof raw.title !== "string" ||
    typeof raw.description !== "string" ||
    typeof raw.sourceUrl !== "string"
  ) {
    return null;
  }

  const embedUrl = getRutubeEmbedUrl(raw.sourceUrl);
  if (!embedUrl) {
    return null;
  }

  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    sourceUrl: raw.sourceUrl,
    embedUrl,
  };
};

export const videos: VideoItem[] = Object.values(cmsVideoModules)
  .map((module) => normalizeVideo((module as { default: CmsVideoItem }).default))
  .filter((video): video is VideoItem => video !== null);

