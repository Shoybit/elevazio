"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/**
 * Floating "back to top" control.
 *
 * Isolated from the footer (which is a server component) so the whole footer
 * does not have to ship as client JS for one button.
 *
 * The scroll listener is passive and only schedules work inside a single rAF,
 * so a fast trackpad flick costs one `setState` per frame at most instead of
 * one per scroll event.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      setVisible(window.scrollY > window.innerHeight);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
        })
      }
      aria-label="Scroll back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-6 right-6 z-70 flex size-12 items-center justify-center rounded-full bg-primary text-accent shadow-[0_18px_40px_-18px_rgba(0,0,0,0.5)] transition-all duration-500 ease-out-expo hover:bg-primary-hover ${
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <ArrowUp aria-hidden="true" className="size-5" />
    </button>
  );
}
