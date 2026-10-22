"use client";

import { useEffect } from "react";

/** Content is visible without JavaScript; only offscreen marketing sections reveal. */
export function MotionObserver() {
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
      }
    }, { threshold: 0.08 });
    for (const element of elements) {
      if (element.getBoundingClientRect().top > window.innerHeight) {
        element.classList.add("will-reveal");
        observer.observe(element);
      }
    }
    return () => {
      observer.disconnect();
      elements.forEach((element) => element.classList.remove("will-reveal"));
    };
  }, []);
  return null;
}
