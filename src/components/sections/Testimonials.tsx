"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { clientNote, testimonials } from "@/config/differentiators";
import { Container } from "@/components/ui/Container";
import { CircularText } from "@/components/icons/Graphics";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const RING_TEXT = "What Our Clients Say · What Our Clients Say ·";
const AUTOPLAY_MS = 7000;

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  /**
   * Autoplay is suspended while the visitor is reading or interacting with the
   * carousel, and while the tab is hidden. A rotating quote that keeps
   * advancing under a keyboard user is not operable (WCAG 2.2.2), and a
   * background tab does not need the animation running either.
   */
  const [suspended, setSuspended] = useState(false);
  const reduceMotion = useReducedMotion();
  const total = testimonials.length;
  const suspendRef = useRef(false);

  const goTo = useCallback(
    (next: number, dir: 1 | -1) => {
      setDirection(dir);
      setIndex(((next % total) + total) % total);
    },
    [total],
  );

  // Mirrored into a ref so the interval callback can read the current value
  // without being torn down and restarted on every hover.
  useEffect(() => {
    suspendRef.current = suspended;
  }, [suspended]);

  useEffect(() => {
    if (reduceMotion) return;

    const onVisibility = () => setSuspended(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    onVisibility();

    const timer = setInterval(() => {
      if (suspendRef.current) return;
      setDirection(1);
      setIndex((current) => (current + 1) % total);
    }, AUTOPLAY_MS);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      clearInterval(timer);
    };
  }, [total, reduceMotion]);

  const active = testimonials[index];

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="relative isolate overflow-hidden bg-linear-to-b from-canvas to-surface-warm py-15 sm:py-25 lg:py-37.5"
      onMouseEnter={() => setSuspended(true)}
      onMouseLeave={() => setSuspended(false)}
      // `focusin`/`focusout` cover keyboard users, who never produce :hover.
      // `focusout` bubbles from any descendant, so only resume once focus has
      // genuinely left the carousel.
      onFocus={() => setSuspended(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setSuspended(false);
        }
      }}
    >
      <h2 id="testimonials-heading" className="sr-only">
        What our clients say
      </h2>

      <Container className="flex flex-col items-center">
        {/* Rotating ring around a circular photograph, straddling the top of the
            warm panel the way it does in the reference. */}
        <div className="relative">
          <motion.div
            aria-hidden
            data-motion-transform=""
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="pointer-events-none absolute left-1/2 top-1/2 size-38 -translate-x-1/2 -translate-y-1/2 sm:size-44 lg:size-50"
          >
            <CircularText text={RING_TEXT} className="size-full" />
          </motion.div>

          <div className="relative size-22 overflow-hidden rounded-full ring-1 ring-line sm:size-24 lg:size-28">
            <Image
              src={active.avatar}
              alt=""
              fill
              sizes="112px"
              className="object-cover"
            />
          </div>
        </div>

        {/* Quote with the pager flanking it, as in the reference. */}
        <div className="relative mt-10 flex w-full items-center justify-center gap-6 lg:mt-14 lg:gap-16">
          <button
            type="button"
            onClick={() => goTo(index - 1, -1)}
            aria-label="Previous testimonial"
            className="hidden size-14 shrink-0 items-center justify-center rounded-full bg-canvas text-accent shadow-[0_10px_30px_-18px_rgba(0,0,0,0.5)] transition-colors duration-300 hover:bg-primary sm:flex"
          >
            <ArrowLeft aria-hidden className="size-5" />
          </button>

          <div className="flex min-h-64 w-full max-w-240 items-center justify-center lg:min-h-56">
            <AnimatePresence mode="wait" initial={false}>
              <motion.figure
                key={active.name}
                custom={direction}
                data-motion-transform=""
                initial={{ opacity: 0, x: direction * 48 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -48 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex w-full flex-col items-center text-center"
              >
                <blockquote className="font-display text-quote">
                  {active.quote}
                </blockquote>
                <figcaption className="mt-8 flex flex-col items-center">
                  <span className="relative pb-3 font-display text-h6">
                    {active.name}
                    <span
                      aria-hidden
                      className="absolute inset-x-1 bottom-0 h-px bg-primary"
                    />
                  </span>
                  <span className="mt-3 text-body-sm text-ink-light">
                    {active.role}
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={() => goTo(index + 1, 1)}
            aria-label="Next testimonial"
            className="hidden size-14 shrink-0 items-center justify-center rounded-full bg-canvas text-accent shadow-[0_10px_30px_-18px_rgba(0,0,0,0.5)] transition-colors duration-300 hover:bg-primary sm:flex"
          >
            <ArrowRight aria-hidden className="size-5" />
          </button>
        </div>

        {/* Pager for narrow viewports, where the flanking arrows are hidden. */}
        <div className="mt-8 flex items-center gap-6 sm:hidden">
          <button
            type="button"
            onClick={() => goTo(index - 1, -1)}
            aria-label="Previous testimonial"
            className="flex size-12 items-center justify-center rounded-full bg-canvas text-accent shadow-[0_10px_30px_-18px_rgba(0,0,0,0.5)] transition-colors duration-300 hover:bg-primary"
          >
            <ArrowLeft aria-hidden className="size-5" />
          </button>
          <ul className="flex items-center gap-2">
            {testimonials.map((item, i) => (
              <li key={item.name}>
                <button
                  type="button"
                  onClick={() => goTo(i, i > index ? 1 : -1)}
                  aria-label={`Show testimonial from ${item.name}`}
                  aria-current={i === index ? "true" : undefined}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-500",
                    i === index
                      ? "w-8 bg-primary"
                      : "w-1.5 bg-line hover:bg-ink-light",
                  )}
                />
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => goTo(index + 1, 1)}
            aria-label="Next testimonial"
            className="flex size-12 items-center justify-center rounded-full bg-canvas text-accent shadow-[0_10px_30px_-18px_rgba(0,0,0,0.5)] transition-colors duration-300 hover:bg-primary"
          >
            <ArrowRight aria-hidden className="size-5" />
          </button>
        </div>
      </Container>

      <Container className="mt-12 lg:mt-16">
        <Reveal amount={0.3}>
          <p className="eyebrow text-center text-ink-light">{clientNote}</p>
        </Reveal>
      </Container>
    </section>
  );
}
