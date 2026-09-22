import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { LanguageProvider, useLanguage } from "@/lib/i18n";
import { usePageSeo } from "@/lib/seo";
import { newsItems } from "@/content/news";
import publication from "@/content/publication.json";

function ChangingPage() {
  const [second, setSecond] = useState(false);
  const { setLanguage } = useLanguage();
  const title = second ? "Новости" : "Участники";
  usePageSeo({ title, description: title, path: second ? "/news" : "/members" });
  return <>
    <h1>{title}</h1><input aria-label={title} placeholder={title} />
    <p data-testid="count">{second ? "1 компания" : "64 компании"}</p>
    <button onClick={() => setSecond(!second)}>Next</button>
    <button onClick={() => setLanguage("en")}>English</button>
    <button onClick={() => setLanguage("ru")}>Russian</button>
  </>;
}

beforeEach(() => { localStorage.clear(); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("route text and title regressions", () => {
  it("does not install a DOM observer in Russian or restore stale text", () => {
    const spy = vi.spyOn(window, "MutationObserver");
    render(<LanguageProvider><ChangingPage /></LanguageProvider>);
    expect(spy).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText("Next"));
    expect(document.title).toBe("Новости");
    expect(screen.getByRole("heading")).toHaveTextContent("Новости");
    expect(screen.getByTestId("count")).toHaveTextContent("1 компания");
    expect(screen.getByRole("textbox")).toHaveAttribute("placeholder", "Новости");
  });

  it("translates new React values and restores the current page when returning to Russian", async () => {
    render(<LanguageProvider><ChangingPage /></LanguageProvider>);
    fireEvent.click(screen.getByText("English"));
    await waitFor(() => expect(screen.getByRole("heading")).toHaveTextContent("Members"));
    fireEvent.click(screen.getByText("Next"));
    await waitFor(() => expect(screen.getByRole("heading")).toHaveTextContent("News"));
    expect(document.title).toBe("News");
    fireEvent.click(screen.getByText("Russian"));
    expect(screen.getByRole("heading")).toHaveTextContent("Новости");
    expect(document.title).toBe("Новости");
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-label", "Новости");
    expect(screen.getByRole("textbox")).toHaveAttribute("placeholder", "Новости");
    expect(screen.getByTestId("count")).toHaveTextContent("1 компания");
  });

  it("does not schedule an endless loop for its own translation writes", async () => {
    localStorage.setItem("askao-language", "en");
    const raf = vi.spyOn(window, "requestAnimationFrame");
    render(<LanguageProvider><ChangingPage /></LanguageProvider>);
    await waitFor(() => expect(screen.getByRole("heading")).toHaveTextContent("Members"));
    expect(raf.mock.calls.length).toBeLessThan(3);
  });

  it("retains the live publication and its linked news", () => {
    expect(newsItems.find(item => item.slug === "statya-bitumirovannye-rao-2026")?.publicationUrl)
      .toBe(`/publications/${publication.slug}`);
    expect(publication.schema["@type"]).toBe("ScholarlyArticle");
    expect(newsItems.find(item => item.slug === "shos-avtonomnaya-energetika-2026")?.images).toHaveLength(3);
  });
});
