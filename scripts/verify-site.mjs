import { readFile, writeFile } from "node:fs/promises";
import { setDefaultResultOrder } from "node:dns";
import assert from "node:assert/strict";

setDefaultResultOrder("ipv4first");
const base = "https://xn--80aa3arm.xn--p1ai";
const request = async url => {
  const response = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(15000) });
  return { url, status: response.status, location: response.headers.get("location"),
    type: response.headers.get("content-type"), body: await response.text() };
};
const localMap = await readFile("public/sitemap.xml", "utf8");
const buildHtml = await readFile("dist/client/index.html", "utf8");
const entry = buildHtml.match(/src="(\/assets\/index-[^"]+\.js)"/)?.[1];
assert.ok(entry, "Build entry point was not found");
const urls = [...localMap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
const result = [];
// Bounded groups keep the production verification light.
for (let offset = 0; offset < urls.length; offset += 4) {
  for (const item of await Promise.all(urls.slice(offset, offset + 4).map(request))) {
    result.push({ ...item, body: undefined, title: item.body.match(/<title>(.*?)<\/title>/)?.[1] });
    assert.equal(item.status, 200, item.url);
    assert.ok(item.body.includes(entry), `Unexpected runtime: ${item.url}`);
  }
}
for (const path of ["/audit-missing-page-20260922", "/news/unknown-audit-test", "/publications/unknown-audit-test", "/committees/unknown-audit-test", "/assets/unknown-audit-test.js"]) {
  const item = await request(base + path);
  result.push({ ...item, body: undefined });
  assert.equal(item.status, 404, item.url);
  if (!path.startsWith("/assets/")) assert.match(item.body, /noindex/);
}
for (const url of ["http://xn--80aa3arm.xn--p1ai/news?audit=1", "https://www.xn--80aa3arm.xn--p1ai/news?audit=1"]) {
  let current = url;
  const chain = [];
  for (let step = 0; step < 5; step++) {
    const item = await request(current);
    chain.push({ url: current, status: item.status, location: item.location });
    if (item.status === 200) break;
    assert.ok([301, 308].includes(item.status) && item.location, "Expected permanent redirect");
    current = new URL(item.location, current).href;
  }
  assert.equal(current, base + "/news?audit=1");
  assert.equal(chain.at(-1).status, 200);
  result.push({ redirects: chain });
}
for (const path of ["/committees/international-cooperation", "/admin/", "/publications/files/izvlechenie-bitumirovannyh-rao-2026.pdf", "/favicon.png"]) {
  const item = await request(base + path);
  result.push({ ...item, body: undefined });
  assert.equal(item.status, 200, item.url);
}
const output = process.argv[2];
if (output) await writeFile(output, JSON.stringify(result, null, 2));
console.log(`Verified ${urls.length} published URLs, missing routes, redirects and preserved resources.`);
