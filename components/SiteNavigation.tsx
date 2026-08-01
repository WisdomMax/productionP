"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import brandLogo from "@/img/logo/transparent_smooth.png";

const menuItems = [
  { label: "WORK", href: "/archive", index: "01" },
  { label: "AWARDS", href: "#awards-links", index: "02" },
  { label: "JOURNAL", href: "/journal", index: "03" },
  { label: "CONTACT", href: "#contact", index: "04" },
];

export default function SiteNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  const openInquiry = () => {
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent("productionp:open-inquiry"));
  };

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    });
  };

  useEffect(() => {
    document.body.classList.toggle("has-mobile-menu", isOpen);

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.classList.remove("has-mobile-menu");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  return (
    <>
      <nav className="navReact">
        <Link
          href="/"
          className="brandReact"
          aria-label="Production P home"
          data-cursor-label="HOME"
          onClick={() => setIsOpen(false)}
        >
          <Image src={brandLogo} alt="Production P" priority />
        </Link>
        <div className="navLinks">
          <a href="#work">WORK</a>
          <a href="#awards">AWARDS</a>
          <a href="#lab">P LAB</a>
          <Link href="/journal">JOURNAL</Link>
          <a
            className="navContact"
            href="#contact"
            aria-haspopup="dialog"
            onClick={(event) => {
              event.preventDefault();
              openInquiry();
            }}
          >
            CONTACT ↗
          </a>
          <button
            className={`mobileMenuToggle${isOpen ? " is-open" : ""}`}
            type="button"
            aria-label={isOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-controls="mobile-site-menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((open) => !open)}
          >
            <span />
            <span />
          </button>
        </div>
      </nav>

      <aside
        className={`mobileMenuPanel${isOpen ? " is-open" : ""}`}
        id="mobile-site-menu"
        aria-hidden={!isOpen}
      >
        <p>PRODUCTION P / NAVIGATION</p>
        <nav aria-label="모바일 주요 메뉴">
          {menuItems.map((item) => (
            <Link
              href={item.href}
              key={item.label}
              aria-haspopup={item.href === "#contact" ? "dialog" : undefined}
              onClick={(event) => {
                if (item.href === "#contact") {
                  event.preventDefault();
                  openInquiry();
                  return;
                }
                if (item.href === "#awards-links") {
                  event.preventDefault();
                  scrollToSection("awards-links");
                  return;
                }
                setIsOpen(false);
              }}
              tabIndex={isOpen ? 0 : -1}
            >
              <span>{item.index}</span>
              <strong>{item.label}</strong>
              <i>↗</i>
            </Link>
          ))}
        </nav>
        <footer>
          <span>AI FILM STUDIO</span>
          <span>SEOUL, KR</span>
        </footer>
      </aside>
    </>
  );
}
