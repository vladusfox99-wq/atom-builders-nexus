import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { afterEach, describe, expect, it, vi } from "vitest";

const script = readFileSync("public/askao-metrika.js", "utf8");
const windows: JSDOM[] = [];
const counterId = 113671476;

function setup(url = "https://xn--80aa3arm.xn--p1ai/") {
  const dom = new JSDOM("<!doctype html><html><head><title>Главная</title></head><body></body></html>", {
    url, runScripts: "outside-only", referrer: "https://yandex.ru/",
  });
  windows.push(dom);
  const ym = vi.fn();
  Object.assign(dom.window, { ym });
  dom.window.eval(script);
  dom.window.document.dispatchEvent(new dom.window.Event("DOMContentLoaded"));
  return { window: dom.window, ym, hits: () => ym.mock.calls.filter(call => call[1] === "hit") };
}

afterEach(() => { windows.splice(0).forEach(dom => dom.window.close()); });

describe("Metrika on client-side routes", () => {
  it("sends exactly one initial view and ignores duplicate installation and hash changes", () => {
    const { window, ym, hits } = setup();
    window.eval(script);
    window.history.replaceState({}, "", "/");
    window.history.pushState({}, "", "/#contacts");
    expect(hits()).toHaveLength(1);
    expect(hits()[0]).toEqual([counterId, "hit", "https://xn--80aa3arm.xn--p1ai/", {
      title: "Главная", referer: "https://yandex.ru/",
    }]);
    expect(ym.mock.calls.filter(call => call[1] === "init")).toHaveLength(1);
    expect(window.document.querySelectorAll('script[src*="mc.yandex.ru/metrika/tag.js"]')).toHaveLength(1);
  });

  it("tracks a lazy route with its new title and a back navigation without double views", async () => {
    const { window, hits } = setup();
    window.history.pushState({}, "", "/news");
    expect(hits()).toHaveLength(1);
    window.document.title = "Новости";
    await vi.waitFor(() => expect(hits()).toHaveLength(2));
    expect(hits()[1][3]).toEqual({ title: "Новости", referer: "https://xn--80aa3arm.xn--p1ai/" });
    window.history.back();
    await vi.waitFor(() => expect(window.location.pathname).toBe("/"));
    window.document.title = "Главная";
    await vi.waitFor(() => expect(hits()).toHaveLength(3));
    expect(hits()[2][2]).toBe("https://xn--80aa3arm.xn--p1ai/");
  });

  it("records file and contact goals without transmitting contact values", () => {
    const { window, ym } = setup();
    for (const [href, download] of [["mailto:private@example.com", false], ["tel:+79990000000", false], ["/publications/files/paper.pdf", true]] as const) {
      const link = window.document.createElement("a");
      link.href = href;
      if (download) link.download = "paper.pdf";
      link.addEventListener("click", event => event.preventDefault());
      window.document.body.appendChild(link);
      link.click();
    }
    const goals = ym.mock.calls.filter(call => call[1] === "reachGoal");
    expect(goals.map(call => call[2])).toEqual(["contact_email", "contact_phone", "pdf_download"]);
    expect(JSON.stringify(goals)).not.toMatch(/private@example|799900/);
    expect(goals[2][3]).toEqual({ page_path: "/", file_path: "/publications/files/paper.pdf" });
  });

  it("does not send development or administration visits to production analytics", () => {
    for (const url of ["http://localhost:5173/", "https://xn--80aa3arm.xn--p1ai/admin/"]) {
      const { ym, window } = setup(url);
      expect(ym).not.toHaveBeenCalled();
      expect(window.document.querySelector('script[src*="mc.yandex.ru"]')).toBeNull();
    }
  });
});
