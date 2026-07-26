"use client";

import { useEffect, useRef, useState } from "react";

let loaderHasPlayedInThisDocument = false;

export default function Loader() {
  // Keep the server render and the browser's first render identical. Deciding
  // from a module variable during render made repeat requests hydrate against
  // different markup.
  const playDecision = useRef<boolean | null>(null);
  const [shouldPlay, setShouldPlay] = useState(true);
  const [frameNumber, setFrameNumber] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (playDecision.current === null) {
      playDecision.current = !loaderHasPlayedInThisDocument;
      loaderHasPlayedInThisDocument = true;
    }

    if (!playDecision.current) {
      setShouldPlay(false);
      return;
    }

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
  }, []);

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
