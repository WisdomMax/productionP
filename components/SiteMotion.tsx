"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let savedHomeScrollY = 0;
let restoreHomeAfterHistoryTraversal = false;
let isLeavingHome = false;

export default function SiteMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const isHome = pathname === "/";
    const enteredViaHistoryTraversal = restoreHomeAfterHistoryTraversal;
    const restoreY =
      isHome && (restoreHomeAfterHistoryTraversal || isLeavingHome)
        ? savedHomeScrollY
        : null;
    const resetSubpageToTop = !isHome && !enteredViaHistoryTraversal;
    if (isHome) isLeavingHome = false;
    restoreHomeAfterHistoryTraversal = false;
    const markHistoryTraversal = () => {
      restoreHomeAfterHistoryTraversal = true;
    };
    window.addEventListener("popstate", markHistoryTraversal);
    const trackHomePosition = () => {
      if (isHome && !isLeavingHome) savedHomeScrollY = window.scrollY;
    };
    const captureHomeBeforeNavigation = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const anchor = event.target.closest<HTMLAnchorElement>("a[href]");
      const href = anchor?.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      const destination = new URL(href, window.location.href);
      if (destination.origin !== window.location.origin) return;
      if (
        isHome &&
        destination.origin === window.location.origin &&
        destination.pathname !== "/"
      ) {
        savedHomeScrollY = window.scrollY;
        isLeavingHome = true;
      } else if (!isHome && destination.pathname === "/") {
        isLeavingHome = false;
        restoreHomeAfterHistoryTraversal = false;
      }
    };
    window.addEventListener("scroll", trackHomePosition, { passive: true });
    window.addEventListener("click", captureHomeBeforeNavigation, true);

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "auto";
    }

    if (isHome) {
      if (window.location.hash) {
        window.history.replaceState(
          null,
          "",
          `${window.location.pathname}${window.location.search}`,
        );
      }
    } else if (window.location.hash) {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}`,
      );
    }

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ duration: 1.02, smoothWheel: true });
    let isRestoringHome = restoreY !== null;
    let animationFrame = 0;
    let restoreFrame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      animationFrame = requestAnimationFrame(raf);
    };
    animationFrame = requestAnimationFrame(raf);
    lenis.on("scroll", () => {
      if (isHome && !isRestoringHome && !isLeavingHome) {
        savedHomeScrollY = window.scrollY;
      }
      ScrollTrigger.update();
    });

    if (restoreY !== null || resetSubpageToTop) {
      const targetY = restoreY ?? 0;
      restoreFrame = requestAnimationFrame(() => {
        restoreFrame = requestAnimationFrame(() => {
          window.scrollTo({ top: targetY, left: 0, behavior: "instant" });
          lenis.scrollTo(targetY, { immediate: true });
          isRestoringHome = false;
          ScrollTrigger.refresh();
        });
      });
    }

    const context = gsap.context(() => {
      const desktopPinned = matchMedia("(min-width: 900px)").matches;
      const hero = document.querySelector<HTMLElement>(".heroReact");

      if (hero) {
        const eyebrow = hero.querySelector<HTMLElement>(
          ".heroReactContent > small",
        );
        const titleLines =
          hero.querySelectorAll<HTMLElement>(".heroReact .heroLine");
        const titleBeats =
          hero.querySelectorAll<HTMLElement>(".heroReact .heroBeat");
        const footerItems =
          hero.querySelectorAll<HTMLElement>(".heroReactFooter > *");

        gsap.set(titleLines, { transformOrigin: "left bottom" });
        gsap.set(titleBeats, { transformOrigin: "left bottom" });

        if (desktopPinned) {
          const heroTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: () => `+=${Math.min(window.innerHeight * 1.28, 1180)}`,
              pin: true,
              scrub: 0.68,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          heroTimeline
            .set(eyebrow, { x: -42, autoAlpha: 0 }, 0)
            .set(footerItems, { y: 30, autoAlpha: 0 }, 0)
            .set(
              titleLines,
              { autoAlpha: 1, clipPath: "inset(0 0 0% 0)" },
              0,
            )
            .set(
              titleBeats,
              {
                yPercent: 125,
                scale: 1.42,
                autoAlpha: 0,
                filter: "blur(16px)",
                letterSpacing: ".025em",
              },
              0,
            )
            // Establish the moving image, then resolve the statement word by word.
            .to({}, { duration: 0.1 })
            .to(
              titleBeats,
              {
                yPercent: 0,
                scale: 1,
                autoAlpha: 1,
                filter: "blur(0px)",
                letterSpacing: "-.055em",
                duration: 0.24,
                stagger: 0.095,
                ease: "expo.out",
              },
              0.1,
            )
            .to(
              eyebrow,
              {
                x: 0,
                autoAlpha: 1,
                duration: 0.17,
                ease: "power3.out",
              },
              0.7,
            )
            .to(
              footerItems,
              {
                y: 0,
                autoAlpha: 1,
                duration: 0.2,
                stagger: 0.045,
                ease: "power3.out",
              },
              0.74,
            )
            .to(
              ".heroReact .heroBeatCinema",
              {
                backgroundPosition: "-120% 50%",
                filter: "drop-shadow(0 0 12px rgba(175,39,17,.3))",
                duration: 0.3,
                ease: "none",
              },
              0.66,
            )
            .to(
              ".heroReact .heroBeatCinema",
              { filter: "drop-shadow(0 0 0 rgba(175,39,17,0))", duration: 0.12 },
              0.9,
            )
            .to({}, { duration: 0.12 });
        } else {
          const heroTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: () => `+=${Math.min(window.innerHeight * 0.88, 760)}`,
              pin: true,
              scrub: 0.66,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          heroTimeline
            .set(eyebrow, { x: -24, autoAlpha: 0 }, 0)
            .set(footerItems, { y: 18, autoAlpha: 0 }, 0)
            .set(
              titleLines,
              { autoAlpha: 1, clipPath: "inset(0 0 0% 0)" },
              0,
            )
            .set(
              titleBeats,
              {
                yPercent: 112,
                scale: 1.28,
                autoAlpha: 0,
                filter: "blur(11px)",
                letterSpacing: ".01em",
              },
              0,
            )
            .to({}, { duration: 0.08 })
            .to(
              titleBeats,
              {
                yPercent: 0,
                scale: 1,
                autoAlpha: 1,
                filter: "blur(0px)",
                letterSpacing: "-.05em",
                duration: 0.24,
                stagger: 0.085,
                ease: "expo.out",
              },
              0.08,
            )
            .to(
              eyebrow,
              { x: 0, autoAlpha: 1, duration: 0.22, ease: "power3.out" },
              0.65,
            )
            .to(
              footerItems,
              {
                y: 0,
                autoAlpha: 1,
                duration: 0.26,
                stagger: 0.06,
                ease: "power3.out",
              },
              0.7,
            )
            .to(
              ".heroReact .heroBeatCinema",
              {
                backgroundPosition: "-120% 50%",
                filter: "drop-shadow(0 0 9px rgba(175,39,17,.28))",
                duration: 0.26,
                ease: "none",
              },
              0.62,
            )
            .to(
              ".heroReact .heroBeatCinema",
              { filter: "drop-shadow(0 0 0 rgba(175,39,17,0))", duration: 0.12 },
              0.84,
            )
            .to({}, { duration: 0.12 });
        }
      }

      const headingSelector = [
        ".reelReact h2",
        ".manifestReact h2",
        ".workReact h2",
        ".awardsShowcaseReact h2",
        ".labReact h2",
        ".journalReact h2",
        ".contactReact h2",
        ".caseTeaserContent h2",
        ".categoryHeader h1",
        ".videoArchiveReact > header h2",
      ].join(",");

      gsap.utils.toArray<HTMLElement>(headingSelector).forEach((heading, headingIndex) => {
        if (!heading.dataset.motionLines) {
          const lines = heading.innerHTML.split(/<br\s*\/?>/i);
          heading.innerHTML = lines
            .map(
              (line) =>
                `<span class="motionLine"><span class="motionLineInner">${line}</span></span>`,
            )
            .join("");
          heading.dataset.motionLines = "true";
          heading.classList.add("motionHeading");
        }

        const lines = Array.from(
          heading.querySelectorAll<HTMLElement>(".motionLineInner"),
        );
        const belongsToPinnedScene = Boolean(
          heading.closest("[data-pin-scene]"),
        );
        if (belongsToPinnedScene) return;

        lines.forEach((line, lineIndex) => {
          const fromLeft = (headingIndex + lineIndex) % 2 === 0;
          gsap.fromTo(
            line,
            {
              xPercent: fromLeft ? -112 : 112,
              yPercent: 30,
              autoAlpha: 0,
              rotate: fromLeft ? -2 : 2,
            },
            {
              xPercent: 0,
              yPercent: 0,
              autoAlpha: 1,
              rotate: 0,
              duration: 1.02,
              delay: lineIndex * 0.1,
              ease: "expo.out",
              scrollTrigger: {
                trigger: heading,
                start: "top 92%",
                once: true,
              },
            },
          );

          gsap.fromTo(
            line,
            { backgroundPosition: "135% 50%" },
            {
              backgroundPosition: "-135% 50%",
              ease: "none",
              scrollTrigger: {
                trigger: heading,
                start: "top 94%",
                end: "bottom 28%",
                scrub: 0.65,
              },
            },
          );
        });
      });

      if (desktopPinned) {
        gsap.utils
          .toArray<HTMLElement>("[data-pin-scene]")
          .forEach((scene, sceneIndex) => {
            const lines = scene.querySelectorAll<HTMLElement>(
              ".motionLineInner",
            );
            const details = scene.querySelectorAll<HTMLElement>(
              "[data-scene-step]",
            );

            const sceneTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: scene,
                start: "top top",
                end: () => `+=${Math.min(window.innerHeight * 0.82, 860)}`,
                pin: true,
                scrub: 0.72,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            });

            sceneTimeline
              .fromTo(
                lines,
                {
                  xPercent: (index) =>
                    (sceneIndex + index) % 2 === 0 ? -112 : 112,
                  yPercent: 28,
                  autoAlpha: 0,
                  rotate: (index) =>
                    (sceneIndex + index) % 2 === 0 ? -2 : 2,
                  backgroundPosition: "135% 50%",
                },
                {
                  xPercent: 0,
                  yPercent: 0,
                  autoAlpha: 1,
                  rotate: 0,
                  backgroundPosition: "38% 50%",
                  stagger: 0.08,
                  duration: 0.36,
                  ease: "power4.out",
                },
              )
              .fromTo(
                details,
                { y: 42, autoAlpha: 0 },
                {
                  y: 0,
                  autoAlpha: 1,
                  stagger: 0.07,
                  duration: 0.22,
                  ease: "power3.out",
                },
                0.2,
              )
              .to(
                lines,
                {
                  backgroundPosition: "-135% 50%",
                  duration: 0.38,
                  ease: "none",
                },
                0.36,
              )
              .to({}, { duration: 0.18 });
          });
      } else {
        gsap.utils
          .toArray<HTMLElement>("[data-pin-scene]")
          .forEach((scene, sceneIndex) => {
            const lines = scene.querySelectorAll<HTMLElement>(
              ".motionLineInner",
            );
            const details = scene.querySelectorAll<HTMLElement>(
              "[data-scene-step]",
            );

            const sceneTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: scene,
                start: "top top",
                end: () => `+=${Math.min(window.innerHeight * 0.74, 660)}`,
                pin: true,
                scrub: 0.7,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            });

            sceneTimeline
              .fromTo(
                lines,
                {
                  xPercent: (index) =>
                    (sceneIndex + index) % 2 === 0 ? -92 : 92,
                  yPercent: 28,
                  scale: 1.12,
                  autoAlpha: 0,
                  rotate: (index) =>
                    (sceneIndex + index) % 2 === 0 ? -1.5 : 1.5,
                  backgroundPosition: "135% 50%",
                  filter: "drop-shadow(0 0 0 rgba(175,39,17,0))",
                },
                {
                  xPercent: 0,
                  yPercent: 0,
                  scale: 1,
                  autoAlpha: 1,
                  rotate: 0,
                  backgroundPosition: "36% 50%",
                  filter: "drop-shadow(0 0 10px rgba(175,39,17,.34))",
                  stagger: 0.075,
                  duration: 0.4,
                  ease: "power4.out",
                },
              )
              .fromTo(
                details,
                {
                  x: (index) => (index % 2 === 0 ? -22 : 22),
                  y: 30,
                  autoAlpha: 0,
                },
                {
                  x: 0,
                  y: 0,
                  autoAlpha: 1,
                  stagger: 0.06,
                  duration: 0.24,
                  ease: "power3.out",
                },
                0.22,
              )
              .to(
                lines,
                {
                  backgroundPosition: "-135% 50%",
                  filter: "drop-shadow(0 0 0 rgba(175,39,17,0))",
                  duration: 0.38,
                  ease: "none",
                },
                0.42,
              )
              .to({}, { duration: 0.14 });
          });
      }

      gsap.utils
        .toArray<HTMLElement>(".workRowReact")
        .forEach((row, index) => {
          gsap.fromTo(
            row,
            {
              xPercent: index % 2 === 0 ? -20 : 20,
              y: 22,
              autoAlpha: 0,
              skewX: index % 2 === 0 ? -4 : 4,
            },
            {
              xPercent: 0,
              y: 0,
              autoAlpha: 1,
              skewX: 0,
              duration: 0.82,
              delay: index * 0.06,
              ease: "expo.out",
              scrollTrigger: { trigger: row, start: "top 97%", once: true },
            },
          );
        });

      const cardSelector = [
        ".featuredWorkCard",
        ".labGridReact figure",
        ".categoryCard",
        ".videoArchiveCard",
        ".awardsShowcaseFooter a",
      ].join(",");
      gsap.utils.toArray<HTMLElement>(cardSelector).forEach((card, index) => {
        const direction = index % 3 === 0 ? -1 : index % 3 === 2 ? 1 : 0;
        gsap.fromTo(
          card,
          {
            x: direction * 150,
            y: 90,
            autoAlpha: 0,
            rotateY: direction * 11,
            scale: 0.9,
          },
          {
            x: 0,
            y: 0,
            autoAlpha: 1,
            rotateY: 0,
            scale: 1,
            duration: 0.92,
            delay: (index % 6) * 0.075,
            ease: "expo.out",
            scrollTrigger: {
              trigger: card,
              start: "top 97%",
              once: true,
            },
          },
        );
      });

      gsap.utils
        .toArray<HTMLElement>(".motionArchiveCard")
        .forEach((card, index) => {
          gsap.fromTo(
            card,
            {
              y: 72,
              autoAlpha: 0,
              scale: 0.94,
              clipPath: "inset(18% 0 0 0)",
            },
            {
              y: 0,
              autoAlpha: 1,
              scale: 1,
              clipPath: "inset(0% 0 0 0)",
              duration: 1,
              delay: index * 0.1,
              ease: "expo.out",
              scrollTrigger: {
                trigger: card,
                start: "top 96%",
                once: true,
              },
            },
          );
        });

      gsap.utils
        .toArray<HTMLElement>(
          ".videoOrientationHeader, .categoryOrientationGroup > header",
        )
        .forEach((header) => {
          gsap.fromTo(
            header,
            { scaleX: 0.12, opacity: 0, transformOrigin: "left center" },
            {
              scaleX: 1,
              opacity: 1,
              duration: 0.9,
              ease: "expo.out",
              scrollTrigger: {
                trigger: header,
                start: "top 91%",
                once: true,
              },
            },
          );
        });

      if (document.querySelector(".manifestReact")) {
        gsap.fromTo(
          ".manifestReact em",
          { color: "#85857d" },
          {
            color: "#AF2711",
            stagger: 0.18,
            scrollTrigger: {
              trigger: ".manifestReact",
              start: "top 72%",
              end: "center 42%",
              scrub: 0.6,
            },
          },
        );
      }

      if (document.querySelector(".awardsRail")) {
        const awardsTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: ".awardsShowcaseReact",
            start: "top 82%",
            once: true,
          },
        });
        awardsTimeline
          .fromTo(
            ".awardsShowcaseIntro > *",
            { x: 110, autoAlpha: 0 },
            {
              x: 0,
              autoAlpha: 1,
              stagger: 0.09,
              duration: 0.72,
              ease: "power4.out",
            },
            0.18,
          )
          .fromTo(
            ".awardWorkCard, .awardsRailMore",
            {
              x: 240,
              y: 70,
              autoAlpha: 0,
              rotateY: -10,
              scale: 0.9,
            },
            {
              x: 0,
              y: 0,
              autoAlpha: 1,
              rotateY: 0,
              scale: 1,
              stagger: 0.11,
              duration: 1.05,
              ease: "expo.out",
            },
            0.28,
          );
      }

      if (document.querySelector(".motionArchiveGrid")) {
        gsap.to(".motionArchiveCard video", {
          scale: 1.1,
          yPercent: 3,
          ease: "none",
          scrollTrigger: {
            trigger: ".motionArchiveGrid",
            start: "top bottom",
            end: "bottom top",
            scrub: 0.9,
          },
        });
      }
    });

    const refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      window.removeEventListener("popstate", markHistoryTraversal);
      window.removeEventListener("scroll", trackHomePosition);
      window.removeEventListener("click", captureHomeBeforeNavigation, true);
      cancelAnimationFrame(animationFrame);
      cancelAnimationFrame(refreshFrame);
      cancelAnimationFrame(restoreFrame);
      context.revert();
      lenis.destroy();
    };
  }, [pathname]);

  return null;
}
