"use client";

import { useRef, useState } from "react";

const EMAIL = "contact@productionp.com";

export default function CopyEmailButton() {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      const input = document.createElement("textarea");
      input.value = EMAIL;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }

    setCopied(true);
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button className="cinemaEmailCopy" type="button" onClick={copy}>
      <span>{EMAIL}</span>
      <small aria-live="polite">{copied ? "COPIED" : "COPY"}</small>
    </button>
  );
}
