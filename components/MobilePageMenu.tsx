"use client";

import { useEffect, useState } from "react";

const items = [
  { label: "HOME", href: "/" },
  { label: "ALL WORKS", href: "/archive/?category=all" },
  { label: "AWARDS", href: "/awards/" },
  { label: "JOURNAL", href: "/journal/" },
  { label: "ABOUT", href: "/about/" },
  { label: "CONTACT", href: "/contact/" },
];

export default function MobilePageMenu({ active }: { active?: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("has-page-mobile-menu", open);
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.classList.remove("has-page-mobile-menu");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div className={`mobilePageMenu${open ? " is-open" : ""}`}>
      <button
        className="mobilePageMenuToggle"
        type="button"
        aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
        aria-expanded={open}
        aria-controls="mobile-page-menu"
        onClick={() => setOpen((value) => !value)}
      >
        <span />
        <span />
      </button>

      <aside id="mobile-page-menu" className="mobilePageMenuPanel" aria-hidden={!open}>
        <header>
          <small>PRODUCTION P</small>
          <b>NAVIGATION / SEOUL</b>
        </header>
        <nav aria-label="모바일 주요 메뉴">
          {items.map((item, index) => (
            <a
              className={active === item.label ? "is-active" : undefined}
              href={item.href}
              key={item.label}
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
            >
              <i>{String(index + 1).padStart(2, "0")}</i>
              <strong>{item.label}</strong>
              <span>↗</span>
            </a>
          ))}
        </nav>
        <footer>
          <span>AI FILM STUDIO</span>
          <span>010-6515-4600</span>
        </footer>
      </aside>
    </div>
  );
}
