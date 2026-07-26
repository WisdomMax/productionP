"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  decay: number;
  size: number;
  length: number;
  rotation: number;
  spin: number;
  color: string;
  glow: boolean;
};

const brandColors = ["#AF2711", "#FF4B30", "#F1EFE8", "#4BD9E8"];

export default function TemporalCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const canvas = canvasRef.current;
    const cursor = cursorRef.current;
    if (!canvas || !cursor) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let activeTarget: HTMLElement | null = null;
    let frame = 0;
    let lastSpawn = 0;
    let previousPointer = { x: -100, y: -100 };
    let renderedPointer = { x: -100, y: -100 };
    let speed = 0;
    const pointer = { x: -100, y: -100 };
    const particles: Particle[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const clearTarget = () => {
      activeTarget?.classList.remove("is-disintegrating");
      activeTarget = null;
      cursor.classList.remove(
        "is-breaking",
        "is-link",
        "is-on-signal",
        "is-on-light",
        "is-media",
      );
    };

    const colorsFor = (target?: HTMLElement | null) => {
      const specified = target?.dataset.particleColors;
      if (specified) return specified.split(",").map((color) => color.trim());
      return brandColors;
    };

    const spawnParticles = (
      amount: number,
      movementX: number,
      movementY: number,
      target?: HTMLElement | null,
    ) => {
      const colors = colorsFor(target);
      const intensity = Math.min(Math.hypot(movementX, movementY), 42);

      for (let index = 0; index < amount; index += 1) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 4 + Math.random() * (target ? 48 : 20);
        const burst = target ? 1.8 : 0.8;

        particles.push({
          x: pointer.x + Math.cos(angle) * distance,
          y: pointer.y + Math.sin(angle) * distance,
          vx:
            Math.cos(angle) * (0.35 + Math.random() * burst) -
            movementX * (0.018 + Math.random() * 0.018),
          vy:
            Math.sin(angle) * (0.35 + Math.random() * burst) -
            movementY * (0.018 + Math.random() * 0.018),
          life: 0.58 + Math.random() * 0.42,
          decay: 0.012 + Math.random() * 0.014,
          size: 0.65 + Math.random() * (target ? 2.2 : 1.2),
          length: 2 + Math.random() * (5 + intensity * 0.24),
          rotation: Math.atan2(movementY, movementX) + (Math.random() - 0.5),
          spin: (Math.random() - 0.5) * 0.14,
          color: colors[index % colors.length],
          glow: index % 4 === 0,
        });
      }

      if (particles.length > 380) {
        particles.splice(0, particles.length - 380);
      }
    };

    const onMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;

      const element =
        event.target instanceof Element
          ? event.target
          : document.elementFromPoint(event.clientX, event.clientY);
      const nextTarget =
        element?.closest<HTMLElement>("[data-disintegrate]") ?? null;
      const interactive =
        element?.closest<HTMLElement>("a, button, [data-cursor]") ?? null;
      const media =
        element?.closest<HTMLElement>(
          "video, img, .featuredWorkMedia, .awardWorkMedia",
        ) ?? null;
      const onSignalBackground = Boolean(
        element?.closest<HTMLElement>(
          ".awardsReact, .awardsShowcaseReact, [data-cursor-contrast='light']",
        ),
      );
      const onLight = Boolean(
        element?.closest<HTMLElement>(
          ".manifestReact, .journalReact, .journalIndexPage, .journalArticlePage, .caseStudyNotice, .caseStudyIntro",
        ),
      );

      if (nextTarget !== activeTarget) {
        activeTarget?.classList.remove("is-disintegrating");
        activeTarget = nextTarget;
      }

      cursor.classList.toggle("is-link", Boolean(interactive));
      cursor.classList.toggle("is-breaking", Boolean(activeTarget));
      cursor.classList.toggle("is-media", Boolean(media));
      cursor.classList.toggle("is-on-signal", onSignalBackground);
      cursor.classList.toggle("is-on-light", onLight);

      const movementX = event.clientX - previousPointer.x;
      const movementY = event.clientY - previousPointer.y;
      speed = Math.min(Math.hypot(movementX, movementY), 60);
      cursor.style.setProperty("--cursor-speed", `${speed}`);
      cursor.style.setProperty(
        "--cursor-angle",
        `${Math.atan2(movementY, movementX)}rad`,
      );

      if (activeTarget) {
        const rect = activeTarget.getBoundingClientRect();
        activeTarget.classList.add("is-disintegrating");
        activeTarget.style.setProperty(
          "--disintegrate-x",
          `${event.clientX - rect.left}px`,
        );
        activeTarget.style.setProperty(
          "--disintegrate-y",
          `${event.clientY - rect.top}px`,
        );
      }

      if (event.timeStamp - lastSpawn > (activeTarget || media ? 15 : 22)) {
        spawnParticles(
          activeTarget || media ? 11 : 4,
          movementX,
          movementY,
          activeTarget || media,
        );
        lastSpawn = event.timeStamp;
      }

      previousPointer = { x: event.clientX, y: event.clientY };
    };

    const onLeave = () => clearTarget();
    const onDown = () => cursor.classList.add("is-pressed");
    const onUp = () => cursor.classList.remove("is-pressed");

    const render = () => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

      renderedPointer.x += (pointer.x - renderedPointer.x) * 0.25;
      renderedPointer.y += (pointer.y - renderedPointer.y) * 0.25;
      cursor.style.transform =
        `translate3d(${renderedPointer.x}px, ${renderedPointer.y}px, 0) translate(-50%, -50%)`;

      for (let index = particles.length - 1; index >= 0; index -= 1) {
        const particle = particles[index];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.975;
        particle.vy *= 0.975;
        particle.rotation += particle.spin;
        particle.life -= particle.decay;

        if (particle.life <= 0) {
          particles.splice(index, 1);
          continue;
        }

        context.save();
        context.globalAlpha = Math.max(0, particle.life) * 0.76;
        context.translate(particle.x, particle.y);
        context.rotate(particle.rotation);
        context.fillStyle = particle.color;
        if (particle.glow) {
          context.shadowBlur = 13;
          context.shadowColor = particle.color;
        }
        context.fillRect(
          -particle.length / 2,
          -particle.size / 2,
          particle.length,
          particle.size,
        );
        context.restore();
      }

      speed *= 0.9;
      frame = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      clearTarget();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="disintegrationCanvas"
        aria-hidden="true"
      />
      <div ref={cursorRef} className="temporalCursor" aria-hidden="true">
        <i />
        <b />
        <span />
      </div>
    </>
  );
}
