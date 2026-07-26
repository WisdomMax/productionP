"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import catalogData from "@/data/video-catalog.json";
import { mediaUrl } from "@/lib/media-url";

type Work = {
  id: string;
  src: string;
  poster: string;
  title: string;
  category: string;
  categoryLabel: string;
  orientation: "landscape" | "portrait" | "square";
};

const catalog = catalogData as Work[];

function selectFeatured() {
  const titles = [
    "BITE INTO YOUTH",
    "MEGA MOMENT",
    "EXTREME TERRAIN",
    "UNLOCK THE NIGHT",
    "SHINHAN BANK",
    "IRON PULSE",
  ];

  return titles
    .map((title) => catalog.find((item) => item.title === title))
    .filter((item): item is Work => Boolean(item));
}

function Preview({ item }: { item: Work }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const play = () => {
    const video = videoRef.current;
    if (!video) return;
    video.load();
    void video.play().catch(() => undefined);
  };

  const stop = () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  };

  return (
    <video
      ref={videoRef}
      src={mediaUrl(item.src)}
      poster={item.poster}
      muted
      loop
      playsInline
      preload="metadata"
      onPointerEnter={play}
      onPointerLeave={stop}
    />
  );
}

export default function FeaturedWorks() {
  const featured = useMemo(selectFeatured, []);
  const [selected, setSelected] = useState<Work | null>(null);

  useEffect(() => {
    if (!selected) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    document.body.classList.add("has-video-modal");
    window.addEventListener("keydown", close);
    return () => {
      document.body.classList.remove("has-video-modal");
      window.removeEventListener("keydown", close);
    };
  }, [selected]);

  return (
    <>
      <section className="featuredWorksReact" id="selected">
        <div className="featuredMotionStage" data-selected-motion-stage>
          <div className="featuredMotionScene" data-selected-motion-scene>
            <header>
              <small>03 / SELECTED MOTION</small>
            </header>
            <div className="featuredTypeRail" aria-label="Play the work">
              <div>
                <span>PLAY THE WORK.</span><i>↗</i>
                <span aria-hidden="true">PLAY THE WORK.</span><i aria-hidden="true">↗</i>
              </div>
            </div>
            <div className="featuredWorksToolbar">
              <p>대표작만 선별했습니다. 마우스를 올려 미리 보고, 클릭하면 전체 영상을 재생합니다.</p>
              <Link href="/archive">전체 작품 보기 <b>↗</b></Link>
            </div>
          </div>
        </div>
        <div className="featuredWorksGrid">
          {featured.map((item, index) => (
            <button
              className={`featuredWorkCard is-${item.orientation}`}
              key={item.id}
              onClick={() => setSelected(item)}
              type="button"
            >
              <span className="featuredWorkMedia">
                <Preview item={item} />
                <i>PLAY</i>
                <b>{String(index + 1).padStart(2, "0")}</b>
              </span>
              <span className="featuredWorkMeta">
                <strong>{item.title}</strong>
                <small>{item.categoryLabel}</small>
              </span>
            </button>
          ))}
        </div>
      </section>

      {selected && (
        <div
          className="videoModal"
          role="dialog"
          aria-modal="true"
          aria-label={`${selected.title} 영상 재생`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelected(null);
          }}
        >
          <button
            className="videoModalClose"
            onClick={() => setSelected(null)}
            type="button"
          >
            닫기 ×
          </button>
          <div className={`videoModalFrame is-${selected.orientation}`}>
            <video src={mediaUrl(selected.src)} controls autoPlay muted playsInline />
            <footer>
              <strong>{selected.title}</strong>
              <span>{selected.categoryLabel}</span>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}
