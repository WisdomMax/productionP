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

function ParticleBust() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;
    let lastPaint = 0;
    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;
    let lastPointerAt = 0;
    let firstPaint = true;
    let points: Array<{ x: number; y: number; depth: number; size: number }> = [];

    const silhouette = [
      [.35, .08], [.53, .04], [.66, .1], [.72, .2], [.72, .34], [.83, .42],
      [.72, .46], [.77, .5], [.7, .55], [.67, .66], [.58, .73], [.57, .82],
      [.8, .92], [.87, .99], [.15, .99], [.3, .9], [.42, .84], [.4, .72],
      [.28, .62], [.21, .48], [.23, .28], [.29, .16],
    ] as Array<[number, number]>;

    const isInside = (x: number, y: number) => {
      let inside = false;
      for (let i = 0, j = silhouette.length - 1; i < silhouette.length; j = i++) {
        const [xi, yi] = silhouette[i];
        const [xj, yj] = silhouette[j];
        if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
      }
      return inside;
    };

    const rebuild = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      points = [];
      firstPaint = true;
      let seed = 1977;
      const random = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
      };
      for (let attempts = 0; points.length < 620 && attempts < 7000; attempts += 1) {
        const nx = random();
        const ny = random();
        if (!isInside(nx, ny)) continue;
        const eyeVoid = Math.pow((nx - .625) / .105, 2) + Math.pow((ny - .355) / .046, 2);
        if (eyeVoid < 1 && random() < .82) continue;
        const depth = .25 + .75 * (.5 + .5 * Math.sin(nx * 8.4 + ny * 4.2));
        points.push({ x: nx * width, y: ny * height, depth, size: .45 + random() * 1.05 });
      }
    };

    const drawWire = (shiftX: number, shiftY: number) => {
      context.save();
      context.translate(shiftX, shiftY);
      context.strokeStyle = "rgba(255,255,255,.2)";
      context.lineWidth = .65;
      context.beginPath();
      context.moveTo(width * .34, height * .09);
      context.bezierCurveTo(width * .58, height * .01, width * .73, height * .16, width * .72, height * .34);
      context.bezierCurveTo(width * .73, height * .37, width * .78, height * .39, width * .83, height * .42);
      context.bezierCurveTo(width * .78, height * .46, width * .72, height * .45, width * .72, height * .47);
      context.bezierCurveTo(width * .78, height * .5, width * .73, height * .53, width * .69, height * .55);
      context.bezierCurveTo(width * .68, height * .66, width * .61, height * .69, width * .58, height * .73);
      context.stroke();
      context.globalAlpha = .62;
      for (const y of [.29, .43, .58, .72]) {
        context.beginPath();
        context.moveTo(width * .27, height * y);
        context.bezierCurveTo(width * .42, height * (y - .045), width * .62, height * (y + .025), width * .7, height * y);
        context.stroke();
      }
      context.restore();
    };

    const draw = (now: number) => {
      frame = requestAnimationFrame(draw);
      if (!visible || now - lastPaint < 32) return;
      lastPaint = now;
      if (!reducedMotion && now - lastPointerAt > 700) {
        targetX *= .94;
        targetY *= .94;
      }
      pointerX += (targetX - pointerX) * .085;
      pointerY += (targetY - pointerY) * .085;
      const moving = Math.abs(targetX - pointerX) + Math.abs(targetY - pointerY) + Math.abs(pointerX) + Math.abs(pointerY) > .002;
      if (!firstPaint && !moving && now - lastPointerAt > 900) return;
      firstPaint = false;
      context.clearRect(0, 0, width, height);

      const glow = context.createRadialGradient(width * .54, height * .42, 0, width * .54, height * .42, width * .48);
      glow.addColorStop(0, "rgba(255,255,255,.055)");
      glow.addColorStop(1, "rgba(255,255,255,0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);

      for (const point of points) {
        const x = point.x + pointerX * point.depth * 5;
        const y = point.y + pointerY * point.depth * 3.5;
        const alpha = .2 + point.depth * .58;
        const size = point.size * (.65 + point.depth * .55);
        context.fillStyle = `rgba(255,255,255,${alpha})`;
        context.fillRect(x, y, size, size);
      }
      drawWire(pointerX * 2.4, pointerY * 1.7);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (reducedMotion || event.pointerType === "touch") return;
      targetX = Math.max(-1, Math.min(1, (event.clientX / window.innerWidth - .5) * 2));
      targetY = Math.max(-1, Math.min(1, (event.clientY / window.innerHeight - .5) * 2));
      lastPointerAt = performance.now();
    };
    const resizeObserver = new ResizeObserver(rebuild);
    const intersectionObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    resizeObserver.observe(canvas);
    intersectionObserver.observe(canvas);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    rebuild();
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="cinemaParticleBust" aria-hidden="true" />;
}

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
          <img src={work.poster} alt="" loading={index < 5 ? "eager" : "lazy"} />
          <i />
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
          <Link href="/archive/?category=all">ALL WORKS</Link>
          <Link href="/awards/">AWARDS</Link>
          <Link href="/journal/">JOURNAL</Link>
          <Link href="/about/">ABOUT</Link>
          <button type="button" onClick={openInquiry}>CONTACT ↗</button>
        </nav>
      </header>

      <section className="cinemaWorkStage" aria-labelledby="cinema-work-title">
        <div className="cinemaWorkHeading">
          <small>SELECTED / 15</small>
          <h1 id="cinema-work-title">WORK</h1>
          <p>MOVE TO REVEAL<br />CLICK TO PLAY</p>
        </div>

        <ParticleBust />

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
                <a href="mailto:contact@productionp.com">contact@productionp.com</a>
              </div>
            </div>
          </div>
          <Link href="/archive/?category=all"><b>작품 더보기</b><i>→</i></Link>
        </div>
      </section>

      {introVisible && (
        <div className={`cinemaIntro${introLeaving ? " is-leaving" : ""}`}>
          <div className="cinemaIntroPanels" aria-hidden="true"><i /><i /></div>
          <div className="cinemaIntroTop"><span>PRODUCTION P</span><span>SEOUL / KR</span></div>
          <div className="cinemaIntroCounter">
            <small>FRAME</small>
            <strong>{count}</strong>
            <em>/ 240 FPS</em>
          </div>
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
