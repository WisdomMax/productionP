"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import ContactInquiry from "@/components/ContactInquiry";
import catalogData from "@/data/video-catalog.json";
import brandLogo from "@/img/logo/transparent_brand.png";
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
  "CHROMATIC DRIVE",
  "EARTHNIQ: HOW TO USE",
  "LIPCERIN RITUAL",
  "PIELLA GROOVE",
  "MEGA MOMENT",
  "EXTREME TERRAIN",
  "UNLOCK THE NIGHT",
  "SHINHAN BANK",
  "IRON PULSE",
  "CITY OF GLASS",
  "PIELLA: MADE FOR LIVING",
  "BEAUTY IN BRUSHSTROKES",
  "SCENT IN MOTION",
  "MONO CUBE: ONE",
];

const flatShapes = ["disc", "square", "triangle", "hexagon", "diamond"];
const placements = Array.from({ length: 15 }, (_, index) => ({
  x: 0,
  y: 0,
  z: 0,
  turn: 0,
  shape: flatShapes[index % flatShapes.length],
}));

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
    <div
      className="cinemaObjectHitArea"
      onPointerEnter={preview}
      onPointerLeave={pause}
    >
      <button
        className={`cinemaWorkObject is-${placement.shape} is-${work.orientation}`}
        style={style}
        type="button"
        data-work-id={work.id}
        onFocus={preview}
        onBlur={pause}
        aria-label={`${work.title} 재생`}
      >
        <span
          className={`cinemaSculpture sculpture-${placement.shape}`}
          data-candidate={String(index + 1).padStart(2, "0")}
          aria-hidden="true"
        >
          <i /><i /><i /><i />
        </span>
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
    </div>
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
    const leaveTimer = window.setTimeout(() => setIntroLeaving(true), 2600);
    const removeTimer = window.setTimeout(() => setIntroVisible(false), 3800);
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
          <Link href="/archive?category=all">ALL WORKS</Link>
          <Link href="/archive?category=awards">AWARDS</Link>
          <Link href="/journal">JOURNAL</Link>
          <button type="button" onClick={openInquiry}>CONTACT ↗</button>
        </nav>
      </header>

      <section className="cinemaWorkStage" aria-labelledby="cinema-work-title">
        <div className="cinemaWorkHeading">
          <small>SELECTED / 15</small>
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
          <div className="cinemaContactBlock">
            <span>AI FILM STUDIO · SEOUL</span>
            <div>
              <a href="tel:01065154600">010-6515-4600</a>
              <a href="mailto:contact@productionp.com">contact@productionp.com</a>
            </div>
          </div>
          <Link href="/archive?category=all"><b>작품 더보기</b><i>→</i></Link>
        </div>
      </section>

      {introVisible && (
        <div className={`cinemaIntro${introLeaving ? " is-leaving" : ""}`}>
          <div className="cinemaIntroPanels" aria-hidden="true"><i /><i /></div>
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
