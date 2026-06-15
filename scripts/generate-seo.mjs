import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteUrl = "https://xn--80aa3arm.xn--p1ai";
const publicDir = path.join(root, "public");
const newsDir = path.join(root, "src", "content", "cms", "news");
const writeRouteShells = process.argv.includes("--dist");

const staticPages = [
  {
    path: "/",
    title: "АСКАО — Ассоциация строительного комплекса атомной отрасли",
    description:
      "АСКАО объединяет 120+ организаций строительного комплекса атомной отрасли России для реализации крупнейших инфраструктурных проектов.",
  },
  {
    path: "/about",
    title: "Об ассоциации — АСКАО",
    description:
      "История, цели и принципы работы Ассоциации организаций строительного комплекса атомной отрасли.",
  },
  {
    path: "/members",
    title: "Члены ассоциации — АСКАО",
    description:
      "Полный список организаций, входящих в Ассоциацию строительного комплекса атомной отрасли.",
  },
  {
    path: "/committees",
    title: "Комитеты — АСКАО",
    description:
      "Профильные комитеты АСКАО и направления совместной работы участников ассоциации.",
  },
  {
    path: "/clusters",
    title: "Отраслевые кластеры — АСКАО",
    description:
      "Отраслевые кластеры АСКАО: объединение компетенций участников для решения задач атомного строительства.",
  },
  {
    path: "/projects",
    title: "Проекты — АСКАО",
    description:
      "Ключевые проекты и инициативы участников Ассоциации строительного комплекса атомной отрасли.",
  },
  {
    path: "/news",
    title: "Новости АСКАО — события, форумы, инициативы отрасли",
    description:
      "Новости Ассоциации организаций строительного комплекса атомной отрасли: форумы, заседания, проекты и инициативы.",
  },
  {
    path: "/events",
    title: "Календарь событий — АСКАО",
    description:
      "Календарь мероприятий АСКАО: форумы, заседания комитетов, деловые встречи и отраслевые события.",
  },
  {
    path: "/videos",
    title: "Видео — АСКАО",
    description:
      "Видеоматериалы Ассоциации строительного комплекса атомной отрасли: события, выступления и отраслевые проекты.",
  },
];

const escapeXml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const newsFiles = (await readdir(newsDir)).filter((file) => file.endsWith(".json"));
const newsPages = await Promise.all(
  newsFiles.map(async (file) => {
    const item = JSON.parse(await readFile(path.join(newsDir, file), "utf8"));
    return {
      path: `/news/${item.slug}`,
      title: `${item.title} — АСКАО`,
      description: item.excerpt,
      date: item.date,
      type: "article",
    };
  }),
);

const pages = [...staticPages, ...newsPages];
const sitemapEntries = pages
  .map(({ path: pagePath, date }) => {
    const lastmod = date ? `\n    <lastmod>${escapeXml(date)}</lastmod>` : "";
    return `  <url>\n    <loc>${escapeXml(`${siteUrl}${pagePath}`)}</loc>${lastmod}\n  </url>`;
  })
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>\n`;
const robots = `User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: ${siteUrl}/sitemap.xml\nHost: xn--80aa3arm.xn--p1ai\n`;

await mkdir(publicDir, { recursive: true });
await writeFile(path.join(publicDir, "sitemap.xml"), sitemap, "utf8");
await writeFile(path.join(publicDir, "robots.txt"), robots, "utf8");

if (writeRouteShells) {
  const distDir = path.join(root, "dist");
  const template = await readFile(path.join(distDir, "index.html"), "utf8");

  for (const page of pages.filter((item) => item.path !== "/")) {
    const canonical = `${siteUrl}${page.path}`;
    const type = page.type ?? "website";
    const publishedMeta = page.date
      ? `\n    <meta property="article:published_time" content="${escapeHtml(`${page.date}T00:00:00+03:00`)}" />`
      : "";
    const schema = {
      "@context": "https://schema.org",
      "@type": type === "article" ? "NewsArticle" : "WebPage",
      name: page.title,
      headline: type === "article" ? page.title.replace(/ — АСКАО$/, "") : undefined,
      description: page.description,
      url: canonical,
      mainEntityOfPage: canonical,
      datePublished: page.date ? `${page.date}T00:00:00+03:00` : undefined,
      image: `${siteUrl}/og-image.webp`,
      inLanguage: "ru-RU",
      publisher:
        type === "article"
          ? {
              "@type": "Organization",
              name: "АСКАО",
              url: `${siteUrl}/`,
              logo: {
                "@type": "ImageObject",
                url: `${siteUrl}/favicon.png`,
              },
            }
          : undefined,
    };
    const compactSchema = JSON.stringify(schema);

    const html = template
      .replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(page.title)}</title>`)
      .replace(
        /<meta name="description" content=".*?" \/>/s,
        `<meta name="description" content="${escapeHtml(page.description)}" />`,
      )
      .replace(
        /<link rel="canonical" href=".*?" \/>/s,
        `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
      )
      .replace(
        /<meta property="og:title" content=".*?" \/>/s,
        `<meta property="og:title" content="${escapeHtml(page.title)}" />`,
      )
      .replace(
        /<meta property="og:description" content=".*?" \/>/s,
        `<meta property="og:description" content="${escapeHtml(page.description)}" />`,
      )
      .replace(
        /<meta property="og:type" content=".*?" \/>/s,
        `<meta property="og:type" content="${type}" />`,
      )
      .replace(
        /<meta property="og:url" content=".*?" \/>/s,
        `<meta property="og:url" content="${escapeHtml(canonical)}" />`,
      )
      .replace(
        /<meta name="twitter:title" content=".*?" \/>/s,
        `<meta name="twitter:title" content="${escapeHtml(page.title)}" />`,
      )
      .replace(
        /<meta name="twitter:description" content=".*?" \/>/s,
        `<meta name="twitter:description" content="${escapeHtml(page.description)}" />`,
      )
      .replace(
        /<script type="application\/ld\+json" data-seo-structured-data="true">.*?<\/script>/s,
        `<script type="application/ld+json" data-seo-structured-data="true">${compactSchema}</script>${publishedMeta}`,
      );

    const routeFile = path.join(distDir, `${page.path.slice(1)}.html`);
    await mkdir(path.dirname(routeFile), { recursive: true });
    await writeFile(routeFile, html, "utf8");
  }
}

console.log(
  `SEO generated: ${pages.length} sitemap URLs${writeRouteShells ? " and route metadata shells" : ""}.`,
);
