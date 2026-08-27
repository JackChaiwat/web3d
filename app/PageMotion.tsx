"use client";

import { useEffect } from "react";

const revealSelector = [
  ".detail-year",
  ".detail-story > *",
  ".detail-stat-row article",
  ".detail-feature-image",
  ".detail-feature-copy > *",
  ".service-page-list article",
  ".service-visual-card",
  ".certification-grid article",
  ".quality-process-band > *",
  ".news-page-heading > *",
  ".news-page-card",
  ".contact-page-hero > *",
  ".contact-page-grid article",
  ".contact-cta-band span",
  ".detail-footer > *",
].join(",");

export function PageMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".detail-page-shell");
    if (!root) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const elements = Array.from(root.querySelectorAll<HTMLElement>(revealSelector));

    elements.forEach((element, index) => {
      element.classList.add("motion-reveal");
      element.style.setProperty("--reveal-order", String(index % 4));
    });

    if (reducedMotion) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    elements.forEach((element) => observer.observe(element));

    let frame = 0;
    let scrollFrame = 0;
    const onPointerMove = (event: PointerEvent) => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        const x = event.clientX / Math.max(window.innerWidth, 1) - 0.5;
        const y = event.clientY / Math.max(window.innerHeight, 1) - 0.5;
        root.style.setProperty("--page-px", x.toFixed(3));
        root.style.setProperty("--page-py", y.toFixed(3));
        frame = 0;
      });
    };

    const updateScroll = () => {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      root.style.setProperty("--page-scroll", Math.min(1, window.scrollY / max).toFixed(4));
      root.querySelector(".page-topbar")?.classList.toggle("is-scrolled", window.scrollY > 42);
      scrollFrame = 0;
    };

    const onScroll = () => {
      if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScroll);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    updateScroll();
    root.classList.add("motion-ready");

    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
    };
  }, []);

  return null;
}
