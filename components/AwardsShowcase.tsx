"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import catalogData from "@/data/video-catalog.json";
import { mediaUrl } from "@/lib/media-url";

type AwardWork = {
  id: string;
  src: string;
  poster: string;
  title: string;
  status: string | null;
  orientation: "landscape" | "portrait" | "square";
  duration: number;
};

const catalog = catalogData as AwardWork[];

function AwardPreview({ work }: { work: AwardWork }) {
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
      src={mediaUrl(work.src)}
      poster={work.poster}
      muted
      loop
      playsInline
      preload="metadata"
      onPointerEnter={play}
      onPointerLeave={stop}
    />
  );
}

export default function AwardsShowcase() {
  const winners = useMemo(
    () => catalog.filter((item) => item.status === "수상작").slice(0, 6),
    [],
  );
  const formGroups = useMemo(
    () => [
      {
        key: "vertical",
        index: "01",
        label: "VERTICAL FORMAT",
        detail: "PORTRAIT / 9:16",
        works: winners.filter((work) => work.orientation === "portrait"),
      },
      {
        key: "wide",
        index: "02",
        label: "WIDE FORMAT",
        detail: "LANDSCAPE / 16:9",
        works: winners.filter((work) => work.orientation !== "portrait"),
      },
    ],
    [winners],
  );
  const [selected, setSelected] = useState<AwardWork | null>(null);

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
      <section id="awards" className="awardsShowcaseReact" data-cursor-contrast="light">
        <header>
          <div>
            <small>04 / P LAB 교육생 공모전 작품</small>
            <h2>NEXT<br />VOICES.</h2>
          </div>
        </header>

        <div
          className="awardsRail"
          aria-label="P LAB 교육생 수상작"
          onWheel={(event) => {
            if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
              event.currentTarget.scrollLeft += event.deltaY;
              event.preventDefault();
            }
          }}
        >
          {formGroups.map((group) => (
            <section className={`awardsFormGroup is-${group.key}`} key={group.key}>
              <header>
                <span>{group.index} / {group.label}</span>
                <strong>{group.detail}</strong>
              </header>
              <div className="awardsFormWorks">
                {group.works.map((work) => {
                  const winnerIndex = winners.findIndex(
                    (winner) => winner.id === work.id,
                  );
                  return (
                    <button
                      className={`awardWorkCard is-${work.orientation}`}
                      key={work.id}
                      onClick={() => setSelected(work)}
                      type="button"
                    >
                      <span className="awardWorkMedia">
                        <AwardPreview work={work} />
                        <i>PLAY</i>
                        <b>{String(winnerIndex + 1).padStart(2, "0")}</b>
                      </span>
                      <span className="awardWorkMeta">
                        <strong>{work.title}</strong>
                        <small>P LAB 교육생 수상작</small>
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
          <Link
            className="awardsRailMore"
            href="/archive?category=awards&status=수상작"
          >
            <span>수상작 전체 보기</span>
            <b>↗</b>
          </Link>
        </div>
        <div className="awardsRailHint">SCROLL HORIZONTALLY →</div>
        <footer className="awardsShowcaseFooter">
          <p>P LAB 교육 과정에서 완성된 작품들의 출품과 수상 기록입니다.</p>
          <nav aria-label="P LAB 공모전 전체 작품">
            <Link href="/archive?category=awards&status=출품작">
              <small>01 / SUBMISSIONS</small>
              <strong>출품작</strong>
              <b>VIEW ALL ↗</b>
            </Link>
            <Link href="/archive?category=awards&status=수상작">
              <small>02 / WINNERS</small>
              <strong>수상작</strong>
              <b>VIEW ALL ↗</b>
            </Link>
          </nav>
        </footer>
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
              <span>P LAB 교육생 수상작</span>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}
