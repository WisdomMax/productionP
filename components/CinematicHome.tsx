"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import ContactInquiry from "@/components/ContactInquiry";
import catalogData from "@/data/video-catalog.json";
import brandLogo from "@/img/logo/transparent_smooth.png";
import { mediaUrl } from "@/lib/media-url";

type Work = {
  id: string;
  src: string;
  poster: string;
  title: string;
  categoryLabel: string;
  orientation: "landscape" | "portrait" | "square";
};

type TileStyle = CSSProperties & {
  "--x": string;
  "--y": string;
  "--z": string;
  "--turn": string;
  "--delay": string;
};

const catalog = catalogData as Work[];
const featuredTitles = [
  "BITE INTO YOUTH",
  "MEGA MOMENT",
  "EXTREME TERRAIN",
  "UNLOCK THE NIGHT",
  "SHINHAN BANK",
  "IRON PULSE",
  "CITY OF GLASS",
  "PIELLA: MADE FOR LIVING",
];

const placements = [
  { x: 27, y: 27, z: 78, turn: -8, shape: "prism" },
  { x: 52, y: 22, z: 20, turn: 5, shape: "disc" },
  { x: 77, y: 29, z: 62, turn: -4, shape: "prism" },
  { x: 38, y: 53, z: 115, turn: 7, shape: "disc" },
  { x: 65, y: 51, z: 42, turn: -7, shape: "prism" },
  { x: 86, y: 60, z: 90, turn: 6, shape: "disc" },
  { x: 20, y: 72, z: 34, turn: 5, shape: "prism" },
  { x: 55, y: 77, z: 102, turn: -5, shape: "disc" },
];

function WorkObject({ work, index }: { work: Work; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const placement = placements[index];
  const style: TileStyle = {
    "--x": `${placement.x}%`,
    "--y": `${placement.y}%`,
    "--z": `${placement.z}px`,
    "--turn": `${placement.turn}deg`,
    "--delay": `${index * 0.08}s`,
  };

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
      className={`cinemaWorkObject is-${placement.shape} is-${work.orientation}`}
      style={style}
      type="button"
      data-work-id={work.id}
      onPointerEnter={preview}
      onPointerLeave={pause}
      onFocus={preview}
      onBlur={pause}
      aria-label={`${work.title} 재생`}
    >
      <span className="cinemaObjectFace">
        <img src={work.poster} alt="" />
        <video ref={videoRef} src={mediaUrl(work.src)} muted loop playsInline preload="none" />
        <i>{String(index + 1).padStart(2, "0")}</i>
      </span>
      <span className="cinemaObjectMeta">
        <strong>{work.title}</strong>
        <small>{work.categoryLabel}</small>
      </span>
    </button>
  );
}

export default function CinematicHome() {
  const works = useMemo(
    () => featuredTitles
      .map((title) => catalog.find((work) => work.title === title))
      .filter((work): work is Work => Boolean(work)),
    [],
  );
  const [introVisible, setIntroVisible] = useState(true);
  const [introLeaving, setIntroLeaving] = useState(false);
  const [count, setCount] = useState(0);
  const [selected, setSelected] = useState<Work | null>(null);

  useEffect(() => {
    const startedAt = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / 2100, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.round(eased * 240));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    const leaveTimer = window.setTimeout(() => setIntroLeaving(true), 2550);
    const removeTimer = window.setTimeout(() => setIntroVisible(false), 3450);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(leaveTimer);
      clearTimeout(removeTimer);
    };
  }, []);

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

  const openInquiry = () => {
    window.dispatchEvent(new CustomEvent("productionp:open-inquiry"));
  };

  return (
    <main className={`cinematicHome${introVisible ? " is-intro" : " is-ready"}`}>
      <div className="cinemaAmbient" aria-hidden="true"><i /><i /><i /></div>

      <header className="cinemaHeader">
        <Link href="/" aria-label="Production P home">
          <Image src={brandLogo} alt="Production P" priority />
        </Link>
        <nav aria-label="주요 메뉴">
          <Link href="/archive">ALL WORKS</Link>
          <Link href="/archive?category=awards&status=수상작">AWARDS</Link>
          <button type="button" onClick={openInquiry}>CONTACT ↗</button>
        </nav>
      </header>

      <section className="cinemaWorkStage" aria-labelledby="cinema-work-title">
        <div className="cinemaWorkHeading">
          <small>SELECTED / 08</small>
          <h1 id="cinema-work-title">WORK</h1>
          <p>MOVE TO REVEAL<br />CLICK TO PLAY</p>
        </div>

        <div className="cinemaObjectField">
          {works.map((work, index) => (
            <div className="cinemaObjectSlot" key={work.id} onClick={() => setSelected(work)}>
              <WorkObject work={work} index={index} />
            </div>
          ))}
        </div>

        <div className="cinemaStageFooter">
          <span>AI FILM STUDIO · SEOUL</span>
          <Link href="/archive"><b>VIEW ALL WORKS</b><i>↗</i></Link>
        </div>
      </section>

      {introVisible && (
        <div className={`cinemaIntro${introLeaving ? " is-leaving" : ""}`}>
          <div className="cinemaIntroTop"><span>PRODUCTION P</span><span>SEOUL / KR</span></div>
          <strong>{String(count).padStart(3, "0")}</strong>
          <div className="cinemaIntroLine"><i style={{ width: `${(count / 240) * 100}%` }} /></div>
          <h2><span>상상을,</span><span>움직이다.</span></h2>
          <p>IMAGINATION IN MOTION</p>
        </div>
      )}

      {selected && (
        <div className="cinemaPlayerOverlay" role="dialog" aria-modal="true" aria-label={`${selected.title} 영상 재생`}>
          <button className="cinemaPlayerClose" type="button" onClick={() => setSelected(null)} aria-label="영상 닫기">
            <span />
            <span />
          </button>
          <div className={`cinemaPlayer is-${selected.orientation}`}>
            <video src={mediaUrl(selected.src)} controls autoPlay playsInline />
            <footer><strong>{selected.title}</strong><span>{selected.categoryLabel} / ESC TO CLOSE</span></footer>
          </div>
        </div>
      )}

      <ContactInquiry showTrigger={false} />
    </main>
  );
}
