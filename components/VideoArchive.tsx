"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import catalogData from "@/data/video-catalog.json";
import { mediaUrl } from "@/lib/media-url";

type VideoItem = {
  id: string;
  src: string;
  poster: string;
  title: string;
  category: string;
  categoryLabel: string;
  status: string | null;
  orientation: "landscape" | "portrait" | "square";
  width: number;
  height: number;
  duration: number;
};

const catalog = catalogData as VideoItem[];
const categoryOrder = [
  "all",
  "commercial",
  "brand-film",
  "film-content",
  "p-lab",
  "animation",
  "awards",
];
const orientationGroups = [
  { key: "landscape", label: "가로형", ratio: "LANDSCAPE / 16:9" },
  { key: "portrait", label: "세로형", ratio: "PORTRAIT / 9:16" },
] as const;

function VideoCard({ item, index }: { item: VideoItem; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const ratio =
    item.orientation === "portrait"
      ? "9:16"
      : item.orientation === "square"
        ? "1:1"
        : "16:9";

  const play = () => {
    const video = videoRef.current;
    if (!video) return;
    video.preload = "auto";
    void video.play().catch(() => undefined);
  };

  const stop = () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  };

  return (
    <article
      className={`videoArchiveCard is-${item.orientation}`}
      onMouseEnter={play}
      onMouseLeave={stop}
      onFocus={play}
      onBlur={stop}
      tabIndex={0}
    >
      <div className="videoArchiveMedia">
        <video
          ref={videoRef}
          src={mediaUrl(item.src)}
          poster={item.poster}
          muted
          loop
          playsInline
          preload="none"
        />
        <span className="videoRatio">{ratio}</span>
        <span className="videoIndex">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="videoArchiveMeta">
        <h3>{item.title}</h3>
        <p>
          <span>{item.status ? `P LAB 교육생 ${item.status}` : item.categoryLabel}</span>
          <span>{Math.floor(item.duration / 60)}:{String(item.duration % 60).padStart(2, "0")}</span>
        </p>
      </div>
    </article>
  );
}

export default function VideoArchive() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeStatus, setActiveStatus] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");
    const status = params.get("status");
    if (category && categoryOrder.includes(category)) setActiveCategory(category);
    if (status === "출품작" || status === "수상작") setActiveStatus(status);
  }, []);
  const categories = useMemo(() => {
    const labels = new Map(catalog.map((item) => [item.category, item.categoryLabel]));
    return categoryOrder
      .filter((key) => key === "all" || labels.has(key))
      .map((key) => ({ key, label: key === "all" ? "전체" : labels.get(key)! }));
  }, []);
  const visible =
    activeCategory === "all"
      ? catalog.filter((item) => !activeStatus || item.status === activeStatus)
      : catalog.filter(
          (item) =>
            item.category === activeCategory &&
            (!activeStatus || item.status === activeStatus),
        );

  return (
    <section className="videoArchiveReact" id="video-archive">
      <header>
        <small>03 / VIDEO ARCHIVE</small>
        <h2>EVERY<br />FRAME.</h2>
        <p>가로형과 세로형 작품을 화면비에 맞춰 구분해 보여줍니다.</p>
      </header>
      <nav className="videoArchiveFilters" aria-label="영상 카테고리">
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
            {label}
          </button>
        ))}
      </nav>
      {activeStatus && (
        <div className="archiveStatus">
          <span>P LAB 교육생 {activeStatus}</span>
          <button type="button" onClick={() => setActiveStatus(null)}>
            공모전 전체 보기
          </button>
        </div>
      )}
      <div className="videoOrientationGroups">
        {orientationGroups.map((group) => {
          const items = visible.filter((item) => item.orientation === group.key);
          if (items.length === 0) return null;
          return (
            <section className={`videoOrientationGroup is-${group.key}`} key={group.key}>
              <header className="videoOrientationHeader">
                <h3>{group.label}</h3>
                <p>{group.ratio} · {String(items.length).padStart(2, "0")} WORKS</p>
              </header>
              <div className="videoArchiveGrid">
                {items.map((item, index) => (
                  <VideoCard item={item} index={index} key={item.id} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}
