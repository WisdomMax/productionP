"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import CopyEmailButton from "@/components/CopyEmailButton";
import MobilePageMenu from "@/components/MobilePageMenu";
import ResilientVideo from "@/components/ResilientVideo";
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
  "청춘버거",
  "립세린",
  "신한은행",
  "로미오와 줄리엣 — EUREKA",
  "타이타닉",
  "메가커피",
  "핫식스",
  "AFTER HOURS: WONDERLAND",
  "조선시대 가구 전문가",
  "IRON PULSE",
  "무신사 공모전",
  "부천 국제 판타스틱 영화제",
  "초현실 웰빙 아트필름",
  "버섯좀비",
  "호랑이와 파우더",
];

const flatShapes = ["disc", "square", "triangle", "hexagon", "diamond"];
const introSeenKey = "productionp:intro-seen";
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
      <span className="cinemaObjectFloat">
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
            <img src={work.poster} alt="" loading={index < 5 ? "eager" : "lazy"} />
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
      </span>
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
  const [introMuted, setIntroMuted] = useState(true);
  const introClosingRef = useRef(false);
  const introTimerRef = useRef<number | null>(null);
  const introFallbackRef = useRef<number | null>(null);
  const introVideoRef = useRef<HTMLVideoElement>(null);
  const playerVideoRef = useRef<HTMLVideoElement>(null);
  const [selected, setSelected] = useState<Work | null>(null);

  const closePlayer = useCallback(() => {
    const video = playerVideoRef.current;
    if (video) video.pause();
    setSelected(null);
  }, []);

  const dismissIntro = useCallback(() => {
    if (introClosingRef.current) return;
    introClosingRef.current = true;
    document.cookie = `${introSeenKey}=1; Path=/; SameSite=Lax`;
    try {
      window.sessionStorage.setItem(introSeenKey, "1");
    } catch {
      // The intro still closes normally when storage is unavailable.
    }
    if (introFallbackRef.current !== null) clearTimeout(introFallbackRef.current);
    setIntroLeaving(true);
    introTimerRef.current = window.setTimeout(() => setIntroVisible(false), 720);
  }, []);

  const toggleIntroSound = () => {
    const video = introVideoRef.current;
    if (!video) return;
    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIntroMuted(nextMuted);
    if (!nextMuted) void video.play().catch(() => {
      video.muted = true;
      setIntroMuted(true);
    });
  };

  useEffect(() => {
    const skipIntroRequested = new URLSearchParams(window.location.search).get("skipIntro") === "1";
    const introWasSeen = document.cookie
      .split("; ")
      .some((cookie) => cookie === `${introSeenKey}=1`);
    if (skipIntroRequested) {
      window.history.replaceState(window.history.state, "", `${window.location.pathname}${window.location.hash}`);
    }
    try {
      if (skipIntroRequested || introWasSeen || window.sessionStorage.getItem(introSeenKey) === "1") {
        introClosingRef.current = true;
        setIntroVisible(false);
        return;
      }
    } catch {
      if (skipIntroRequested || introWasSeen) {
        introClosingRef.current = true;
        setIntroVisible(false);
        return;
      }
    }

    const skipWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismissIntro();
    };
    window.addEventListener("keydown", skipWithEscape);
    introFallbackRef.current = window.setTimeout(dismissIntro, 22000);
    return () => {
      window.removeEventListener("keydown", skipWithEscape);
      if (introTimerRef.current !== null) clearTimeout(introTimerRef.current);
      if (introFallbackRef.current !== null) clearTimeout(introFallbackRef.current);
    };
  }, [dismissIntro]);

  useEffect(() => {
    if (!selected) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePlayer();
    };
    document.body.classList.add("has-cinema-player");
    window.addEventListener("keydown", close);
    return () => {
      document.body.classList.remove("has-cinema-player");
      window.removeEventListener("keydown", close);
    };
  }, [selected, closePlayer]);

  return (
    <main className={`cinematicHome${introVisible ? " is-intro" : " is-ready"}`}>
      <div className="cinemaAmbient" aria-hidden="true">
        <i className="cinemaArc cinemaArcPrimary" />
        <i className="cinemaArc cinemaArcSecondary" />
        <i className="cinemaStructureLine" />
        <span className="cinemaDotField" />
        <b className="cinemaAmbientMark">P</b>
      </div>

      <header className="cinemaHeader">
        <Link href="/" aria-label="Production P home">
          <Image src={brandLogo} alt="Production P" priority />
        </Link>
        <nav aria-label="주요 메뉴">
          <a href="/archive/?category=all">ALL WORKS</a>
          <Link href="/awards/">AWARDS</Link>
          <Link href="/journal/">JOURNAL</Link>
          <Link href="/about/">ABOUT</Link>
          <Link href="/contact/">CONTACT ↗</Link>
        </nav>
        <MobilePageMenu active="HOME" />
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
            <b className="cinemaContactSeal" aria-hidden="true">P.</b>
            <div className="cinemaContactCopy">
              <span>AI FILM STUDIO · SEOUL</span>
              <div>
                <a href="tel:01065154600">010-6515-4600</a>
                <CopyEmailButton />
              </div>
            </div>
          </div>
          <a href="/archive/?category=all"><b>작품 더보기</b><i>→</i></a>
        </div>
      </section>

      {introVisible && (
        <div className={`cinemaVideoIntro${introLeaving ? " is-leaving" : ""}`}>
          <div className="cinemaVideoIntroBrand">
            <Image src={brandLogo} alt="Production P" priority />
          </div>
          <div className="cinemaIntroPanel">
            <div className="cinemaVideoFrame">
              <video
                ref={introVideoRef}
                autoPlay
                muted={introMuted}
                playsInline
                preload="auto"
                onEnded={dismissIntro}
                onError={dismissIntro}
              >
                <source
                  media="(max-width: 760px)"
                  src={`${mediaUrl("/videos/00-hero-depth/web/hero-intro-vertical.mp4")}?v=1`}
                  type="video/mp4"
                />
                <source
                  src={`${mediaUrl("/videos/00-hero-depth/web/hero-intro.mp4")}?v=3`}
                  type="video/mp4"
                />
              </video>
            </div>
            <div className="cinemaIntroControls">
              <button className="cinemaIntroSkip" type="button" onClick={dismissIntro} aria-label="인트로 영상 건너뛰기">
                <span>SKIP</span>
                <small>ESC</small>
              </button>
              <button
                className="cinemaIntroSound"
                type="button"
                onClick={toggleIntroSound}
                aria-label={introMuted ? "인트로 영상 소리 켜기" : "인트로 영상 음소거"}
              >
                <span>SOUND</span>
                <small>{introMuted ? "OFF" : "ON"}</small>
              </button>
            </div>
          </div>
        </div>
      )}

      {selected && (
        <div className="cinemaPlayerOverlay" role="dialog" aria-modal="true" aria-label={`${selected.title} 영상 재생`}>
          <button
            className="cinemaPlayerClose"
            type="button"
            onClick={closePlayer}
            onTouchEnd={(event) => {
              event.preventDefault();
              event.stopPropagation();
              closePlayer();
            }}
            aria-label="영상 닫기"
          >
            <span />
            <span />
          </button>
          <div className={`cinemaPlayer is-${selected.orientation}`}>
            <ResilientVideo
              ref={playerVideoRef}
              src={mediaUrl(selected.src)}
              poster={selected.poster}
              title={selected.title}
              controls
              autoPlay
              playsInline
            />
            <footer><strong>{selected.title}</strong><span>{selected.categoryLabel} / ESC TO CLOSE</span></footer>
          </div>
        </div>
      )}

    </main>
  );
}
