import { useEffect } from "react";

export const SITE_URL = "https://xn--80aa3arm.xn--p1ai";
export const SITE_NAME = "АСКАО";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.webp`;

type StructuredData = Record<string, unknown> | Record<string, unknown>[];

interface PageSeo {
  title: string;
  description: string;
  path?: string;
  type?: "website" | "article";
  image?: string;
  noIndex?: boolean;
  publishedTime?: string;
  structuredData?: StructuredData;
}

const setMeta = (selector: string, attributes: Record<string, string>) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([name, value]) => element?.setAttribute(name, value));
};

const setCanonical = (url: string) => {
  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = url;
};

const getAbsoluteUrl = (value: string) =>
  value.startsWith("http://") || value.startsWith("https://")
    ? value
    : `${SITE_URL}${value.startsWith("/") ? value : `/${value}`}`;

export const usePageSeo = ({
  title,
  description,
  path,
  type = "website",
  image = DEFAULT_OG_IMAGE,
  noIndex = false,
  publishedTime,
  structuredData,
}: PageSeo) => {
  useEffect(() => {
    const pathname = path ?? window.location.pathname;
    const canonicalUrl = `${SITE_URL}${pathname === "/" ? "/" : pathname.replace(/\/+$/, "")}`;
    const imageUrl = getAbsoluteUrl(image);

    document.title = title;
    setCanonical(canonicalUrl);
    setMeta('meta[name="description"]', { name: "description", content: description });
    setMeta('meta[name="robots"]', {
      name: "robots",
      content: noIndex ? "noindex, nofollow" : "index, follow",
    });
    setMeta('meta[property="og:title"]', { property: "og:title", content: title });
    setMeta('meta[property="og:description"]', {
      property: "og:description",
      content: description,
    });
    setMeta('meta[property="og:type"]', { property: "og:type", content: type });
    setMeta('meta[property="og:url"]', { property: "og:url", content: canonicalUrl });
    setMeta('meta[property="og:image"]', { property: "og:image", content: imageUrl });
    setMeta('meta[property="og:site_name"]', { property: "og:site_name", content: SITE_NAME });
    setMeta('meta[property="og:locale"]', { property: "og:locale", content: "ru_RU" });
    setMeta('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: "summary_large_image",
    });
    setMeta('meta[name="twitter:title"]', { name: "twitter:title", content: title });
    setMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: description,
    });
    setMeta('meta[name="twitter:image"]', { name: "twitter:image", content: imageUrl });

    const articlePublished = 'meta[property="article:published_time"]';
    if (publishedTime) {
      setMeta(articlePublished, {
        property: "article:published_time",
        content: publishedTime,
      });
    } else {
      document.head.querySelector(articlePublished)?.remove();
    }

    const schema =
      structuredData ??
      ({
        "@context": "https://schema.org",
        "@type": type === "article" ? "Article" : "WebPage",
        name: title,
        description,
        url: canonicalUrl,
        image: imageUrl,
        inLanguage: "ru-RU",
        isPartOf: {
          "@type": "WebSite",
          name: SITE_NAME,
          url: `${SITE_URL}/`,
        },
      } satisfies Record<string, unknown>);

    let script = document.head.querySelector<HTMLScriptElement>(
      'script[data-seo-structured-data="true"]',
    );
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.seoStructuredData = "true";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);
  }, [
    description,
    image,
    noIndex,
    path,
    publishedTime,
    structuredData,
    title,
    type,
  ]);
};

