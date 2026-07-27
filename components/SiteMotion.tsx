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
    const transformedHeadings: Array<{
      heading: HTMLElement;
      html: string;
    }> = [];
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
      const mobileSelectedMotion = matchMedia("(max-width: 760px)").matches;
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
              refreshPriority: 1000,
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
              refreshPriority: 1000,
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
        ".labReact h2",
        ".journalReact h2",
        ".contactReact h2",
        ".caseTeaserContent h2",
        ".categoryHeader h1",
        ".videoArchiveReact > header h2",
      ].join(",");

      gsap.utils.toArray<HTMLElement>(headingSelector).forEach((heading, headingIndex) => {
        if (!heading.dataset.motionLines) {
          transformedHeadings.push({
            heading,
            html: heading.innerHTML,
          });
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
          heading.closest(
            "[data-pin-scene], [data-experiment-scene], [data-case-teaser-scene]",
          ),
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

      const experimentScene = document.querySelector<HTMLElement>(
        "[data-experiment-scene]",
      );
      if (experimentScene) {
        const experimentStage = document.querySelector<HTMLElement>(
          "[data-experiment-stage]",
        );
        const experimentLines =
          experimentScene.querySelectorAll<HTMLElement>(".motionLineInner");
        const experimentLabel =
          experimentScene.querySelector<HTMLElement>("small");
        const experimentCopy =
          experimentScene.querySelector<HTMLElement>("p");

        gsap.set(experimentLines, {
          xPercent: -125,
          yPercent: 18,
          scale: 1.16,
          skewX: -6,
          autoAlpha: 0,
          backgroundPosition: "135% 50%",
          filter: "blur(10px)",
        });
        gsap.set(experimentLabel, { x: -32, autoAlpha: 0 });
        gsap.set(experimentCopy, { x: 38, y: 24, autoAlpha: 0 });

        const experimentTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: experimentStage ?? experimentScene,
            start: "top top",
            end: "bottom bottom",
            scrub: desktopPinned ? 0.82 : 0.72,
            invalidateOnRefresh: true,
            refreshPriority: 100,
          },
        });

        experimentTimeline
          .to({}, { duration: 0.2 })
          .to(
            experimentLines,
            {
              xPercent: 0,
              yPercent: 0,
              scale: 1,
              skewX: 0,
              autoAlpha: 1,
              backgroundPosition: "36% 50%",
              filter: "blur(0px)",
              stagger: 0.16,
              duration: 0.42,
              ease: "power4.out",
            },
            0.2,
          )
          .to(
            experimentLabel,
            {
              x: 0,
              autoAlpha: 1,
              duration: 0.18,
              ease: "power3.out",
            },
            0.28,
          )
          .to(
            experimentCopy,
            {
              x: 0,
              y: 0,
              autoAlpha: 1,
              duration: 0.24,
              ease: "power3.out",
            },
            0.68,
          )
          .to(
            experimentLines,
            {
              backgroundPosition: "-135% 50%",
              duration: 0.28,
              ease: "none",
            },
            0.7,
          )
          .to({}, { duration: 0.34 });
      }

      if (desktopPinned) {
        gsap.utils
          .toArray<HTMLElement>(
            "[data-pin-scene]:not(.manifestReact):not(.workReact):not(.caseTeaserReact)",
          )
          .forEach((scene, sceneIndex) => {
            const lines = scene.querySelectorAll<HTMLElement>(
              ".motionLineInner",
            );
            const details = scene.querySelectorAll<HTMLElement>(
              "[data-scene-step]",
            );
            const lineStart = (index: number) =>
              (sceneIndex + index) % 2 === 0 ? -112 : 112;
            const entranceAt = scene.classList.contains("contactReact")
              ? 0.22
              : 0.2;

            gsap.set(lines, {
              xPercent: lineStart,
              yPercent: 28,
              autoAlpha: 0,
              rotate: (index) =>
                (sceneIndex + index) % 2 === 0 ? -2 : 2,
              backgroundPosition: "135% 50%",
            });
            gsap.set(details, { y: 42, autoAlpha: 0 });

            const sceneTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: scene.parentElement ?? scene,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.72,
                invalidateOnRefresh: true,
                refreshPriority: sceneIndex === 0 ? 90 : 50 - sceneIndex * 10,
              },
            });

            sceneTimeline
              .to(
                lines,
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
                entranceAt,
              )
              .to(
                details,
                {
                  y: 0,
                  autoAlpha: 1,
                  stagger: 0.07,
                  duration: 0.22,
                  ease: "power3.out",
                },
                entranceAt + 0.2,
              )
              .to(
                lines,
                {
                  backgroundPosition: "-135% 50%",
                  duration: 0.38,
                  ease: "none",
                },
                entranceAt + 0.36,
              )
              .to({}, { duration: 0.3 });
          });
      } else {
        gsap.utils
          .toArray<HTMLElement>(
            "[data-pin-scene]:not(.manifestReact):not(.workReact):not(.caseTeaserReact)",
          )
          .forEach((scene, sceneIndex) => {
            const lines = scene.querySelectorAll<HTMLElement>(
              ".motionLineInner",
            );
            const details = scene.querySelectorAll<HTMLElement>(
              "[data-scene-step]",
            );
            const lineStart = (index: number) =>
              (sceneIndex + index) % 2 === 0 ? -92 : 92;
            const entranceAt = scene.classList.contains("contactReact")
              ? 0.22
              : 0.2;

            gsap.set(lines, {
              xPercent: lineStart,
              yPercent: 28,
              scale: 1.12,
              autoAlpha: 0,
              rotate: (index) =>
                (sceneIndex + index) % 2 === 0 ? -1.5 : 1.5,
              backgroundPosition: "135% 50%",
              filter: "drop-shadow(0 0 0 rgba(175,39,17,0))",
            });
            gsap.set(details, {
              x: (index) => (index % 2 === 0 ? -22 : 22),
              y: 30,
              autoAlpha: 0,
            });

            const sceneTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: scene.parentElement ?? scene,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.7,
                invalidateOnRefresh: true,
                refreshPriority: sceneIndex === 0 ? 90 : 50 - sceneIndex * 10,
              },
            });

            sceneTimeline
              .to(
                lines,
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
                entranceAt,
              )
              .to(
                details,
                {
                  x: 0,
                  y: 0,
                  autoAlpha: 1,
                  stagger: 0.06,
                  duration: 0.24,
                  ease: "power3.out",
                },
                entranceAt + 0.22,
              )
              .to(
                lines,
                {
                  backgroundPosition: "-135% 50%",
                  filter: "drop-shadow(0 0 0 rgba(175,39,17,0))",
                  duration: 0.38,
                  ease: "none",
                },
                entranceAt + 0.42,
              )
              .to({}, { duration: 0.28 });
          });
      }

      const manifestScene =
        document.querySelector<HTMLElement>(".manifestReact");
      if (manifestScene) {
        const manifestStage = manifestScene.parentElement ?? manifestScene;
        const manifestLines =
          manifestScene.querySelectorAll<HTMLElement>(".motionLineInner");
        const manifestEmphasis =
          manifestScene.querySelectorAll<HTMLElement>("em");
        const manifestDetails =
          manifestScene.querySelectorAll<HTMLElement>("[data-scene-step]");

        gsap.set(manifestLines, {
          xPercent: (index) => (index % 2 === 0 ? -112 : 112),
          yPercent: 24,
          scale: 1.08,
          autoAlpha: 0,
          rotate: (index) => (index % 2 === 0 ? -2 : 2),
          backgroundPosition: "135% 50%",
        });
        gsap.set(manifestDetails, { y: 34, autoAlpha: 0 });
        gsap.set(manifestEmphasis, {
          color: "#85857d",
          webkitTextFillColor: "#85857d",
        });

        gsap.timeline({
          scrollTrigger: {
            trigger: manifestStage,
            start: "top top",
            end: "bottom bottom",
            scrub: desktopPinned ? 0.82 : 0.72,
            invalidateOnRefresh: true,
            refreshPriority: 95,
          },
        })
          .to({}, { duration: 0.22 })
          .to(
            manifestLines,
            {
              xPercent: 0,
              yPercent: 0,
              scale: 1,
              autoAlpha: 1,
              rotate: 0,
              backgroundPosition: "38% 50%",
              stagger: 0.16,
              duration: 0.34,
              ease: "power4.out",
            },
            0.22,
          )
          .to(
            manifestEmphasis,
            {
              color: "#AF2711",
              webkitTextFillColor: "#AF2711",
              stagger: 0.14,
              duration: 0.22,
              ease: "power2.out",
            },
            0.6,
          )
          .to(
            manifestDetails,
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.18,
              ease: "power3.out",
            },
            0.64,
          )
          .to(
            manifestLines,
            {
              backgroundPosition: "-135% 50%",
              duration: 0.34,
              ease: "none",
            },
            0.7,
          )
          .to({}, { duration: 0.32 });
      }

      const workScene = document.querySelector<HTMLElement>(".workReact");
      if (workScene) {
        const workLines =
          workScene.querySelectorAll<HTMLElement>(".motionLineInner");
        const workCounter =
          workScene.querySelector<HTMLElement>(":scope > div > small");
        const workRows = Array.from(
          workScene.querySelectorAll<HTMLElement>(".workRowReact"),
        );

        gsap.set(workLines, {
          xPercent: -72,
          yPercent: 24,
          scale: 1.1,
          autoAlpha: 0,
          backgroundPosition: "135% 50%",
        });
        gsap.set(workCounter, { x: -24, autoAlpha: 0 });
        gsap.set(workRows, {
          xPercent: (index) => (index % 2 === 0 ? -26 : 26),
          y: 30,
          autoAlpha: 0,
          skewX: (index) => (index % 2 === 0 ? -4 : 4),
        });

        const workTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: workScene.parentElement ?? workScene,
            start: "top top",
            end: "bottom bottom",
            scrub: desktopPinned ? 0.82 : 0.72,
            invalidateOnRefresh: true,
            refreshPriority: 80,
          },
        });

        workTimeline
          .to({}, { duration: 0.18 })
          .to(
            workLines,
            {
              xPercent: 0,
              yPercent: 0,
              scale: 1,
              autoAlpha: 1,
              backgroundPosition: "38% 50%",
              duration: 0.2,
              ease: "power4.out",
            },
            0.18,
          )
          .to(
            workCounter,
            {
              x: 0,
              autoAlpha: 1,
              duration: 0.12,
              ease: "power3.out",
            },
            0.27,
          );

        workRows.forEach((row, index) => {
          const title = row.querySelector<HTMLElement>("strong");
          const at = 0.36 + index * 0.24;

          workTimeline
            .to(
              row,
              {
                xPercent: 0,
                y: 0,
                autoAlpha: 1,
                skewX: 0,
                duration: 0.2,
                ease: "expo.out",
              },
              at,
            )
            .fromTo(
              title,
              { color: "#d63a20" },
              {
                color: "#f1efe8",
                duration: 0.22,
                ease: "power2.out",
              },
              at + 0.08,
            );
        });

        workTimeline
          .to(
            workLines,
            {
              backgroundPosition: "-135% 50%",
              duration: 0.22,
              ease: "none",
            },
            0.96,
          )
          .to({}, { duration: 0.34 });
      }

      const selectedMotionStage = document.querySelector<HTMLElement>(
        "[data-selected-motion-stage]",
      );
      const selectedMotionScene = document.querySelector<HTMLElement>(
        "[data-selected-motion-scene]",
      );
      if (
        selectedMotionStage &&
        selectedMotionScene &&
        mobileSelectedMotion
      ) {
        const mobileSelectedWords =
          selectedMotionScene.querySelectorAll<HTMLElement>(".featuredTypeRail span");
        const mobileSelectedArrows =
          selectedMotionScene.querySelectorAll<HTMLElement>(".featuredTypeRail i");

        gsap.set(mobileSelectedWords, {
          backgroundPosition: "145% 50%",
          filter: "drop-shadow(0 0 0 rgba(175,39,17,0))",
        });
        gsap.set(mobileSelectedArrows, {
          color: "#f1efe8",
          rotate: -14,
        });

        const mobileSelectedTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: selectedMotionStage,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.55,
            invalidateOnRefresh: true,
          },
        });

        mobileSelectedTimeline
          .to(
            mobileSelectedWords,
            {
              backgroundPosition: "-145% 50%",
              filter: "drop-shadow(0 0 18px rgba(175,39,17,.28))",
              duration: 0.78,
              ease: "none",
            },
            0,
          )
          .to(
            mobileSelectedArrows,
            {
              color: "#d43a22",
              rotate: 0,
              duration: 0.34,
              ease: "power2.out",
            },
            0.18,
          )
          .to(
            mobileSelectedWords,
            {
              filter: "drop-shadow(0 0 0 rgba(175,39,17,0))",
              duration: 0.22,
            },
            0.78,
          );
      }
      if (
        selectedMotionStage &&
        selectedMotionScene &&
        !mobileSelectedMotion
      ) {
        const selectedLabel =
          selectedMotionScene.querySelector<HTMLElement>("header small");
        const selectedRail =
          selectedMotionScene.querySelector<HTMLElement>(".featuredTypeRail");
        const selectedWords =
          selectedMotionScene.querySelectorAll<HTMLElement>(".featuredTypeRail span");
        const selectedArrows =
          selectedMotionScene.querySelectorAll<HTMLElement>(".featuredTypeRail i");
        const selectedToolbar =
          selectedMotionScene.querySelector<HTMLElement>(".featuredWorksToolbar");
        const selectedWorksTrack =
          selectedMotionScene.querySelector<HTMLElement>(".featuredWorksGrid");
        const selectedCards =
          selectedMotionScene.querySelectorAll<HTMLElement>(".featuredWorkCard");

        gsap.set(selectedLabel, { x: -34, autoAlpha: 0 });
        gsap.set(selectedRail, {
          y: 34,
          scale: 1.035,
          autoAlpha: 0,
        });
        gsap.set(selectedWords, {
          backgroundPosition: "145% 50%",
          filter: "drop-shadow(0 0 0 rgba(175,39,17,0))",
        });
        gsap.set(selectedArrows, {
          color: "#f1efe8",
          rotate: -18,
          scale: 0.7,
          autoAlpha: 0,
        });
        gsap.set(selectedToolbar, { y: 20, autoAlpha: 0 });
        gsap.set(selectedCards, { y: 80, autoAlpha: 0, scale: 0.92 });

        const selectedMotionTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: selectedMotionStage,
            start: "top top",
            end: "bottom bottom",
            scrub: desktopPinned ? 0.82 : 0.72,
            invalidateOnRefresh: true,
          },
        });

        selectedMotionTimeline
          .to({}, { duration: 0.14 })
          .to(
            selectedLabel,
            {
              x: 0,
              autoAlpha: 1,
              duration: 0.14,
              ease: "power3.out",
            },
            0.14,
          )
          .to(
            selectedRail,
            {
              y: 0,
              scale: 1,
              autoAlpha: 1,
              duration: 0.2,
              ease: "power4.out",
            },
            0.14,
          )
          .to(
            selectedWords,
            {
              backgroundPosition: "-145% 50%",
              filter: "drop-shadow(0 0 18px rgba(175,39,17,.28))",
              duration: 0.62,
              ease: "none",
            },
            0.32,
          )
          .to(
            selectedArrows,
            {
              color: "#d43a22",
              rotate: 0,
              scale: 1,
              autoAlpha: 1,
              stagger: 0.08,
              duration: 0.22,
              ease: "back.out(1.8)",
            },
            0.42,
          )
          .to(
            selectedToolbar,
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.16,
              ease: "power3.out",
            },
            0.26,
          )
          .to(
            selectedCards,
            {
              y: 0,
              autoAlpha: 1,
              scale: 1,
              stagger: 0.035,
              duration: 0.24,
              ease: "expo.out",
            },
            0.46,
          )
          .to(
            selectedWorksTrack,
            {
              xPercent: desktopPinned ? -49 : 0,
              duration: 0.58,
              ease: "none",
            },
            0.58,
          )
          .to(
            selectedWords,
            {
              filter: "drop-shadow(0 0 0 rgba(175,39,17,0))",
              duration: 0.18,
            },
            0.98,
          )
          .to({}, { duration: 0.28 });
      }

      const awardsIntroStage =
        document.querySelector<HTMLElement>("[data-awards-intro-stage]");
      const awardsIntroScene =
        document.querySelector<HTMLElement>("[data-awards-intro-scene]");
      if (awardsIntroStage && awardsIntroScene) {
        const awardsTitle =
          awardsIntroScene.querySelector<HTMLElement>("h2");
        const awardsLabel =
          awardsIntroScene.querySelector<HTMLElement>("small");
        const awardsCopy =
          awardsIntroScene.querySelectorAll<HTMLElement>("p, b");

        gsap.set(awardsTitle, {
          xPercent: 108,
          autoAlpha: 0,
          skewX: 8,
          backgroundPosition: "170% 50%",
        });
        gsap.set(awardsLabel, { x: 70, autoAlpha: 0 });
        gsap.set(awardsCopy, { y: 34, autoAlpha: 0 });

        gsap.timeline({
          scrollTrigger: {
            trigger: awardsIntroStage,
            start: "top top",
            end: "bottom bottom",
            scrub: desktopPinned ? 0.82 : 0.72,
            invalidateOnRefresh: true,
          },
        })
          .to({}, { duration: 0.18 })
          .to(
            awardsTitle,
            {
              xPercent: 0,
              autoAlpha: 1,
              skewX: 0,
              backgroundPosition: "35% 50%",
              duration: 0.46,
              ease: "power4.out",
            },
            0.18,
          )
          .to(
            awardsLabel,
            { x: 0, autoAlpha: 1, duration: 0.18, ease: "power3.out" },
            0.34,
          )
          .to(
            awardsCopy,
            {
              y: 0,
              autoAlpha: 1,
              stagger: 0.08,
              duration: 0.24,
              ease: "power3.out",
            },
            0.68,
          )
          .to(
            awardsTitle,
            {
              backgroundPosition: "-120% 50%",
              duration: 0.34,
              ease: "none",
            },
            0.76,
          )
          .to({}, { duration: 0.34 });
      }

      const caseTeaserStage =
        document.querySelector<HTMLElement>("[data-case-teaser-stage]");
      const caseTeaserScene =
        document.querySelector<HTMLElement>("[data-case-teaser-scene]");
      if (caseTeaserStage && caseTeaserScene) {
        const caseLines =
          caseTeaserScene.querySelectorAll<HTMLElement>(".motionLineInner");
        const caseDetails =
          caseTeaserScene.querySelectorAll<HTMLElement>("[data-scene-step]");

        gsap.set(caseLines, {
          xPercent: desktopPinned ? -112 : -92,
          yPercent: 28,
          scale: desktopPinned ? 1 : 1.12,
          autoAlpha: 0,
          rotate: desktopPinned ? -2 : -1.5,
          backgroundPosition: "135% 50%",
          filter: "drop-shadow(0 0 0 rgba(175,39,17,0))",
        });
        gsap.set(caseDetails, {
          x: (index) => (index % 2 === 0 ? -22 : 22),
          y: 30,
          autoAlpha: 0,
        });

        const caseTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: caseTeaserStage,
            start: "top top",
            end: "bottom bottom",
            scrub: desktopPinned ? 0.72 : 0.7,
            invalidateOnRefresh: true,
          },
        });

        caseTimeline
          .to({}, { duration: 0.2 })
          .to(
            caseLines,
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
            0.2,
          )
          .to(
            caseDetails,
            {
              x: 0,
              y: 0,
              autoAlpha: 1,
              stagger: 0.07,
              duration: 0.22,
              ease: "power3.out",
            },
            0.52,
          )
          .to(
            caseLines,
            {
              backgroundPosition: "-135% 50%",
              filter: "drop-shadow(0 0 0 rgba(175,39,17,0))",
              duration: 0.38,
              ease: "none",
            },
            0.68,
          )
          .to({}, { duration: 0.34 });
      }

      const cardSelector = [
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

      if (document.querySelector(".awardsRail")) {
        const awardsTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: ".awardsRail",
            start: "top 88%",
            once: true,
          },
        });
        awardsTimeline
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
            0,
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
      transformedHeadings.forEach(({ heading, html }) => {
        if (!heading.isConnected) return;
        heading.innerHTML = html;
        heading.removeAttribute("data-motion-lines");
        heading.classList.remove("motionHeading");
      });
      lenis.destroy();
    };
  }, [pathname]);

  return null;
}
