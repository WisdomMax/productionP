"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import catalogData from "@/data/video-catalog.json";
import { mediaUrl } from "@/lib/media-url";

type VideoItem = {
  id: string;
  src: string;
  poster: string;
  title: string;
  category: string;
  categoryLabel: string;
  categories: string[];
  categoryLabels: string[];
  status: string | null;
  orientation: "landscape" | "portrait" | "square";
  width: number;
  height: number;
  duration: number;
};

const catalog = catalogData as VideoItem[];
const categoryOrder = ["all", "commercial", "brand-film", "film-content", "p-lab", "animation", "awards"];

function VideoCard({ item, index, onSelect }: { item: VideoItem; index: number; onSelect: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const preview = () => {
    const video = videoRef.current;
    if (!video) return;
    video.preload = "auto";
    void video.play().catch(() => undefined);
  };

  const pause = () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  };

  return (
    <button
      className={`archiveWorkCard is-${item.orientation}`}
      type="button"
      onClick={onSelect}
      onPointerEnter={preview}
      onPointerLeave={pause}
      onFocus={preview}
      onBlur={pause}
      aria-label={`${item.title} 재생`}
    >
      <span className="archiveWorkMedia">
        <img src={item.poster} alt="" />
        <video ref={videoRef} src={mediaUrl(item.src)} muted loop playsInline preload="none" />
        <i>{String(index + 1).padStart(2, "0")}</i>
        <b>PLAY ↗</b>
      </span>
      <span className="archiveWorkMeta">
        <strong>{item.title}</strong>
        <small>{item.status ? `P LAB · ${item.status}` : item.categoryLabel}</small>
      </span>
    </button>
  );
}

export default function VideoArchive() {
  const searchParams = useSearchParams();
  const requestedCategory = searchParams.get("category");
  const requestedStatus = searchParams.get("status");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeStatus, setActiveStatus] = useState<string | null>(null);
  const [selected, setSelected] = useState<VideoItem | null>(null);

  useEffect(() => {
    setActiveCategory(requestedCategory && categoryOrder.includes(requestedCategory) ? requestedCategory : "all");
    setActiveStatus(requestedStatus === "출품작" || requestedStatus === "수상작" ? requestedStatus : null);
  }, [requestedCategory, requestedStatus]);

  useEffect(() => {
    if (!selected) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    document.body.classList.add("has-cinema-player");
    window.addEventListener("keydown", close);
    return () => {
      document.body.classList.remove("has-cinema-player");
      window.removeEventListener("keydown", close);
    };
  }, [selected]);

  const categories = useMemo(() => {
    const labels = new Map<string, string>();
    catalog.forEach((item) => item.categories.forEach((category, index) => labels.set(category, item.categoryLabels[index])));
    return categoryOrder
      .filter((key) => key === "all" || labels.has(key))
      .map((key) => ({ key, label: key === "all" ? "ALL" : labels.get(key)! }));
  }, []);

  const visible = activeCategory === "all"
    ? catalog.filter((item) => !activeStatus || item.status === activeStatus)
    : catalog.filter((item) => item.categories.includes(activeCategory) && (!activeStatus || item.status === activeStatus));
  const isAwards = activeCategory === "awards";

  return (
    <section className="archiveGallery" id="video-archive">
      <header className="archiveGalleryHero">
        <small>PRODUCTION P / FILM INDEX</small>
        <h1><span>{isAwards ? "AWARD" : "ALL"}</span><span>WORKS</span></h1>
        <div><b>{String(visible.length).padStart(2, "0")}</b><p>SELECT A CATEGORY<br />HOVER TO PREVIEW</p></div>
      </header>

      <nav className="archiveCategoryRail" aria-label="영상 카테고리">
        {categories.map(({ key, label }) => (
          <button
            key={key}
            className={activeCategory === key ? "is-active" : ""}
            onClick={() => {
              setActiveCategory(key);
              setActiveStatus(null);
            }}
            type="button"
          >
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {isAwards && (
        <div className="archiveAwardFilters" role="group" aria-label="공모전 작품 구분">
          <button className={!activeStatus ? "is-active" : ""} type="button" onClick={() => setActiveStatus(null)}>공모전 전체</button>
          <button className={activeStatus === "수상작" ? "is-active" : ""} type="button" onClick={() => setActiveStatus("수상작")}>수상작</button>
          <button className={activeStatus === "출품작" ? "is-active" : ""} type="button" onClick={() => setActiveStatus("출품작")}>출품작</button>
        </div>
      )}

      <div className="archiveWorksGrid">
        {visible.map((item, index) => (
          <VideoCard item={item} index={index} key={item.id} onSelect={() => setSelected(item)} />
        ))}
      </div>

      {selected && (
        <div className="cinemaPlayerOverlay" role="dialog" aria-modal="true" aria-label={`${selected.title} 영상 재생`}>
          <button className="cinemaPlayerClose" type="button" onClick={() => setSelected(null)} aria-label="영상 닫기">
            <span /><span />
          </button>
          <div className={`cinemaPlayer is-${selected.orientation}`}>
            <video src={mediaUrl(selected.src)} controls autoPlay playsInline />
            <footer><strong>{selected.title}</strong><span>{selected.categoryLabel} / ESC TO CLOSE</span></footer>
          </div>
        </div>
      )}
    </section>
  );
}
