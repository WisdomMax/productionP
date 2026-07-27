"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { mediaUrl } from "@/lib/media-url";

type WorkItem = {
  id: string;
  src: string;
  poster: string;
  title: string;
  orientation: "landscape" | "portrait" | "square";
  duration: number;
  industries: string[];
};

const industryOptions = [
  { key: "food-hospitality", label: "F&B & HOSPITALITY" },
  { key: "fashion-beauty", label: "FASHION & BEAUTY" },
  { key: "consumer-lifestyle", label: "CONSUMER & LIFESTYLE" },
  { key: "mobility-outdoor", label: "MOBILITY & OUTDOOR" },
  { key: "finance-corporate", label: "FINANCE & CORPORATE" },
  { key: "culture-entertainment", label: "CULTURE & ENTERTAINMENT" },
] as const;
const industryLabels = new Map<string, string>(
  industryOptions.map((option) => [option.key, option.label]),
);

const orientationGroups = [
  { key: "landscape", label: "WIDE FORMAT", ratio: "LANDSCAPE / 16:9" },
  { key: "portrait", label: "VERTICAL FORMAT", ratio: "PORTRAIT / 9:16" },
] as const;

export default function WorkPortfolio({ works }: { works: WorkItem[] }) {
  const [activeIndustry, setActiveIndustry] = useState("all");
  const availableIndustries = useMemo(
    () =>
      industryOptions
        .map((option) => ({
          ...option,
          count: works.filter((work) => work.industries.includes(option.key)).length,
        }))
        .filter((option) => option.count > 0),
    [works],
  );
  const visibleWorks =
    activeIndustry === "all"
      ? works
      : works.filter((work) => work.industries.includes(activeIndustry));
  const selectIndustry = useCallback((industry: string) => {
    setActiveIndustry(industry);
    const url = new URL(window.location.href);
    if (industry === "all") {
      url.searchParams.delete("industry");
    } else {
      url.searchParams.set("industry", industry);
    }
    window.history.replaceState(window.history.state, "", url);
  }, []);

  useEffect(() => {
    const availableKeys = new Set<string>(
      availableIndustries.map((option) => option.key),
    );
    const syncFromUrl = () => {
      const requested = new URL(window.location.href).searchParams.get("industry");
      setActiveIndustry(requested && availableKeys.has(requested) ? requested : "all");
    };
    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, [availableIndustries]);

  return (
    <>
      <section className="industryExplorer" aria-labelledby="industry-explorer-title">
        <div>
          <small id="industry-explorer-title">EXPLORE BY INDUSTRY</small>
          <p>업종과 비슷한 제작 사례를 빠르게 찾아보세요.</p>
        </div>
        <nav aria-label="업종별 작품 필터">
          <button
            className={activeIndustry === "all" ? "is-active" : ""}
            onClick={() => selectIndustry("all")}
            type="button"
          >
            <span>ALL INDUSTRIES</span>
            <small>{String(works.length).padStart(2, "0")}</small>
          </button>
          {availableIndustries.map((option) => (
            <button
              className={activeIndustry === option.key ? "is-active" : ""}
              key={option.key}
              onClick={() => selectIndustry(option.key)}
              type="button"
            >
              <span>{option.label}</span>
              <small>{String(option.count).padStart(2, "0")}</small>
            </button>
          ))}
        </nav>
      </section>

      <div className="categoryOrientationGroups" aria-live="polite">
        {orientationGroups.map((group) => {
          const items = visibleWorks.filter((work) => work.orientation === group.key);
          if (items.length === 0) return null;
          return (
            <section className={`categoryOrientationGroup is-${group.key}`} key={group.key}>
              <header>
                <h2>{group.label}</h2>
                <p>{group.ratio} · {String(items.length).padStart(2, "0")} WORKS</p>
              </header>
              <div className="categoryGrid">
                {items.map((work, index) => (
                  <article className={`categoryCard is-${work.orientation}`} key={work.id}>
                    <video
                      src={mediaUrl(work.src)}
                      poster={work.poster}
                      controls
                      muted
                      playsInline
                      preload="metadata"
                    />
                    <div>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <strong>{work.title}</strong>
                      <small>
                        {Math.floor(work.duration / 60)}:
                        {String(work.duration % 60).padStart(2, "0")}
                      </small>
                      <em>
                        {work.industries
                          .map((industry) => industryLabels.get(industry))
                          .filter(Boolean)
                          .join(" · ")}
                      </em>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
