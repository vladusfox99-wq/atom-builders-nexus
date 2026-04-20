import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { Potrace } from "potrace";

const projectRoot = process.cwd();
const contentFiles = [
  path.join(projectRoot, "src", "content", "memberLogos.ts"),
  path.join(projectRoot, "src", "content", "members.ts"),
];
const outputDir = path.join(projectRoot, "public", "member-logos-traced");
const publicPrefix = "/member-logos-traced";

const urlRegex = /https:\/\/[^\s"']+/g;
const rasterLogoRegex = /\.jpe?g(?:\?[^"']*)?$/i;

const escapeForRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const sanitize = (value) => value.replace(/[^a-zA-Z0-9_-]/g, "-").replace(/-+/g, "-");

const traceToSvg = async (buffer) => {
  const potrace = new Potrace({
    blackOnWhite: true,
    color: "#ffffff",
    background: "transparent",
    turdSize: 2,
    threshold: Potrace.THRESHOLD_AUTO,
  });

  await new Promise((resolve, reject) => {
    potrace.loadImage(buffer, (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });

  return potrace.getSVG();
};

await fs.mkdir(outputDir, { recursive: true });

const originalsByFile = new Map();
const allRasterUrls = new Set();

for (const filePath of contentFiles) {
  const raw = await fs.readFile(filePath, "utf8");
  originalsByFile.set(filePath, raw);
  const urls = raw.match(urlRegex) ?? [];

  for (const url of urls) {
    if (rasterLogoRegex.test(url)) {
      allRasterUrls.add(url);
    }
  }
}

const replacements = new Map();
let convertedCount = 0;
let skippedCount = 0;

for (const url of allRasterUrls) {
  const parsed = new URL(url);
  const baseName = path.posix.basename(parsed.pathname, path.posix.extname(parsed.pathname));
  const hash = createHash("sha1").update(url).digest("hex").slice(0, 10);
  const fileName = `${sanitize(baseName)}-${hash}.svg`;
  const outPath = path.join(outputDir, fileName);
  const publicPath = `${publicPrefix}/${fileName}`;

  try {
    await fs.access(outPath);
    replacements.set(url, publicPath);
    skippedCount += 1;
    continue;
  } catch {
    // file does not exist yet
  }

  const response = await fetch(url);
  if (!response.ok) {
    console.warn(`Skip ${url}: HTTP ${response.status}`);
    continue;
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const svg = await traceToSvg(buffer);
  await fs.writeFile(outPath, svg, "utf8");
  replacements.set(url, publicPath);
  convertedCount += 1;
}

for (const [filePath, original] of originalsByFile.entries()) {
  let next = original;
  for (const [sourceUrl, targetUrl] of replacements.entries()) {
    next = next.replace(new RegExp(escapeForRegex(sourceUrl), "g"), targetUrl);
  }
  if (next !== original) {
    await fs.writeFile(filePath, next, "utf8");
  }
}

console.log(
  `Autotrace completed. Converted: ${convertedCount}, reused: ${skippedCount}, replaced URLs: ${replacements.size}.`,
);
