"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  length: number;
  rotation: number;
  spin: number;
  color: string;
};

export default function TemporalCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

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
      cursor.classList.remove("is-breaking", "is-link", "is-on-signal");
    };

    const colorsFor = (target: HTMLElement) => {
      const specified = target.dataset.particleColors;
      if (specified) return specified.split(",").map((color) => color.trim());

      const style = getComputedStyle(target);
      return [style.color, "#AF2711", "#D63A20"];
    };

    const spawnParticles = (
      target: HTMLElement,
      movementX: number,
      movementY: number,
    ) => {
      const colors = colorsFor(target);

      for (let index = 0; index < 9; index += 1) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 10 + Math.random() * 38;
        const speed = 0.45 + Math.random() * 1.4;

        particles.push({
          x: pointer.x + Math.cos(angle) * distance,
          y: pointer.y + Math.sin(angle) * distance,
          vx: Math.cos(angle) * speed + movementX * 0.055,
          vy: Math.sin(angle) * speed + movementY * 0.055,
          life: 0.72 + Math.random() * 0.28,
          size: 0.7 + Math.random() * 1.8,
          length: 1.5 + Math.random() * 7,
          rotation: Math.random() * Math.PI,
          spin: (Math.random() - 0.5) * 0.12,
          color: colors[index % colors.length],
        });
      }

      if (particles.length > 240) particles.splice(0, particles.length - 240);
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
      const onSignalBackground = Boolean(
        element?.closest<HTMLElement>(".awardsReact, [data-cursor-contrast='light']"),
      );

      if (nextTarget !== activeTarget) {
        activeTarget?.classList.remove("is-disintegrating");
        activeTarget = nextTarget;
      }

      cursor.classList.toggle("is-link", Boolean(interactive));
      cursor.classList.toggle("is-breaking", Boolean(activeTarget));
      cursor.classList.toggle("is-on-signal", onSignalBackground);

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

        if (event.timeStamp - lastSpawn > 28) {
          spawnParticles(
            activeTarget,
            event.clientX - previousPointer.x,
            event.clientY - previousPointer.y,
          );
          lastSpawn = event.timeStamp;
        }
      }

      previousPointer = { x: event.clientX, y: event.clientY };
    };

    const onLeave = () => clearTarget();
    const onDown = () => cursor.classList.add("is-pressed");
    const onUp = () => cursor.classList.remove("is-pressed");

    const render = () => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

      renderedPointer.x += (pointer.x - renderedPointer.x) * 0.28;
      renderedPointer.y += (pointer.y - renderedPointer.y) * 0.28;
      cursor.style.transform =
        `translate3d(${renderedPointer.x}px, ${renderedPointer.y}px, 0) translate(-50%, -50%)`;

      for (let index = particles.length - 1; index >= 0; index -= 1) {
        const particle = particles[index];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.975;
        particle.vy *= 0.975;
        particle.rotation += particle.spin;
        particle.life -= 0.018;

        if (particle.life <= 0) {
          particles.splice(index, 1);
          continue;
        }

        context.save();
        context.globalAlpha = Math.max(0, particle.life) * 0.52;
        context.translate(particle.x, particle.y);
        context.rotate(particle.rotation);
        context.fillStyle = particle.color;
        context.fillRect(
          -particle.length / 2,
          -particle.size / 2,
          particle.length,
          particle.size,
        );
        context.restore();
      }

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
      </div>
    </>
  );
}
