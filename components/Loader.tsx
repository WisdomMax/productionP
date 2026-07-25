"use client";

import { useEffect, useState } from "react";

let loaderHasPlayedInThisDocument = false;

export default function Loader() {
  const [shouldPlay] = useState(() => {
    const play = !loaderHasPlayedInThisDocument;
    loaderHasPlayedInThisDocument = true;
    return play;
  });
  const [frameNumber, setFrameNumber] = useState(shouldPlay ? 0 : 240);
  const [done, setDone] = useState(!shouldPlay);

  useEffect(() => {
    if (!shouldPlay) return;

    const startedAt = performance.now();
    let animationFrame = 0;
    let finishTimer = 0;

    const finish = () => setDone(true);
    const animate = (time: number) => {
      const progress = Math.min(1, (time - startedAt) / 900);
      setFrameNumber(Math.floor(progress * 240));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        finishTimer = window.setTimeout(finish, 80);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    const safetyTimer = window.setTimeout(finish, 1600);

    return () => {
      cancelAnimationFrame(animationFrame);
      clearTimeout(finishTimer);
      clearTimeout(safetyTimer);
    };
  }, [shouldPlay]);

  if (!shouldPlay) return null;

  return (
    <div className={`loaderReact ${done ? "done" : ""}`}>
      <div>
        <b>PRODUCTION P</b>
        <strong>{String(frameNumber).padStart(3, "0")}</strong>
        <span>FRAME / 240 · 60 FPS</span>
        <i style={{ width: `${(frameNumber / 240) * 100}%` }} />
      </div>
    </div>
  );
}
