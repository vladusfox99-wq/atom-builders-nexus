import { describe, expect, it } from "vitest";
import { committees } from "@/content/committees";
import { events } from "@/content/events";
import { newsItems } from "@/content/news";
import { videos } from "@/content/videos";

describe("CMS content", () => {
  it("loads the existing collections", () => {
    expect(newsItems.length).toBeGreaterThan(0);
    expect(events.length).toBeGreaterThan(0);
    expect(videos.length).toBeGreaterThan(0);
    expect(Array.isArray(committees)).toBe(true);
  });

  it("loads the international cooperation committee", () => {
    expect(committees).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "international-cooperation",
          title: "Комитет по международной политике АСКАО",
          pagePath: "/committees/international-cooperation",
        }),
      ]),
    );
  });

  it("creates a valid Rutube embed URL", () => {
    expect(videos[0].embedUrl).toMatch(/^https:\/\/rutube\.ru\/play\/embed\//);
  });
});
