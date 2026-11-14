import { describe, expect, it } from "vitest";
import { committees, getCommitteeById } from "@/content/committees";
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

  it("hides the international cooperation committee from public content", () => {
    expect(committees).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "international-cooperation",
          title: "Комитет по международной политике АСКАО",
          pagePath: "/committees/international-cooperation",
        }),
      ]),
    );
  });

  it("keeps the hidden international committee available by its direct link", () => {
    expect(getCommitteeById("international-cooperation")).toEqual(
      expect.objectContaining({
        title: "Комитет по международной политике АСКАО",
        pagePath: "/committees/international-cooperation",
      }),
    );
  });

  it("omits hidden committee events from the shared event calendar", () => {
    expect(events).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "international-policy-innoprom-central-asia-2026",
          committeeId: "international-cooperation",
          source: "committee",
        }),
      ]),
    );
  });

  it("creates a valid Rutube embed URL", () => {
    expect(videos[0].embedUrl).toMatch(/^https:\/\/rutube\.ru\/play\/embed\//);
  });
});
