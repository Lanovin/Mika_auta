"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollRevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    // Use rAF so we don't compete with the browser's initial layout / paint work
    let cancelled = false;
    const observers: IntersectionObserver[] = [];

    const setup = () => {
      if (cancelled) return;
      const elements = Array.from(document.querySelectorAll<HTMLElement>(".reveal-on-scroll:not(.revealed)"));

      if (elements.length === 0) {
        return;
      }

      // Reveal elements already in the viewport immediately (no animation flicker on fast loads)
      const observer = new IntersectionObserver(
        (entries, currentObserver) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }
            entry.target.classList.add("revealed");
            currentObserver.unobserve(entry.target);
          });
        },
        {
          threshold: 0.16,
          rootMargin: "0px 0px -6% 0px",
        }
      );

      elements.forEach((element) => observer.observe(element));
      observers.push(observer);
    };

    // Defer setup until after first paint to keep main thread free for LCP
    const id = window.requestAnimationFrame(() => window.requestAnimationFrame(setup));

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(id);
      observers.forEach((o) => o.disconnect());
    };
  }, [pathname]);

  return null;
}