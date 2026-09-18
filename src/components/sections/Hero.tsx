"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { heroFeatures } from "@/config/stats";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { TextReveal } from "@/components/ui/TextReveal";

const TITLE = "Envisioning Tomorrow. Shaping What’s Next.";

/**
 * One of the three hero feature cards.
 *
 * `Reveal` owns the entrance transform, so every hover transition lives on the
 * inner <article> — a CSS transform on the same element would be overridden by
 * the inline transform motion writes.
 */
function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof heroFeatures)[number];
  index: number;
}) {
  const Icon = feature.icon;
  return (
    <Reveal
      as="li"
      direction="up"
      delay={0.12 + index * 0.08}
      className="group h-full sm:last:col-span-2 lg:last:col-span-1"
    >
      <article className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-canvas/12 bg-accent/50 p-6 transition-[transform,border-color,background-color] duration-500 ease-out-expo hover:-translate-y-1 hover:border-primary/40 hover:bg-accent/65 sm:p-7">
        {/* Architectural still bled in behind a concave sweep. Only the inner
            edge is feathered, so the photo still reads as a crisp panel. */}
        {feature.image ? (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 hidden w-[34%] [clip-path:ellipse(85%_100%_at_100%_50%)] lg:block"
          >
            <Image
              src={feature.image}
              alt=""
              fill
              loading="lazy"
              sizes="(max-width: 1023px) 0px, 17vw"
              className="object-cover opacity-85 transition-[opacity,transform] duration-700 ease-out-expo group-hover:scale-105 group-hover:opacity-100"
            />
            <span className="absolute inset-y-0 left-0 w-2/5 bg-linear-to-r from-accent to-transparent" />
          </span>
        ) : null}

        <div className="relative flex items-center gap-4">
          <span className="font-display text-caption tabular-nums tracking-[0.18em] text-canvas/45">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            aria-hidden
            className="h-px flex-1 bg-canvas/15 transition-colors duration-500 group-hover:bg-primary/45"
          />
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-canvas/12 bg-accent/70 transition-[border-color,background-color,transform] duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:border-primary/45 group-hover:bg-accent">
            <Icon
              aria-hidden
              className="size-4 text-primary transition-transform duration-500 ease-out-expo group-hover:scale-110"
              strokeWidth={1.5}
            />
          </span>
        </div>

        <h3 className="relative mt-6 max-w-52 font-display text-h6 text-canvas transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5">
          {feature.title}
        </h3>

        <span
          aria-hidden
          className="relative mt-3.5 block h-px w-8 origin-left bg-primary transition-transform duration-500 ease-out-expo group-hover:scale-x-150"
        />

        <p className="relative mt-4 max-w-66 text-caption leading-[1.6] text-canvas/60">
          {feature.description}
        </p>
      </article>
    </Reveal>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-168 flex-col overflow-hidden bg-accent pb-0 lg:min-h-208"
    >
      {/* Background plate + parallax drift */}
      <motion.div
        aria-hidden
        data-motion-transform=""
        className="absolute inset-0 -z-20"
        style={{ y: imageY, scale: 1.1 }}
      >
        <Image
          src="/images/hero/hero_bg_demo.jpg"
          alt=""
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-accent/40" />

      <motion.div
        data-motion-transform=""
        style={{ y: contentY }}
        className="relative z-10 flex flex-1 flex-col"
      >
        <Container className="pt-37.5 lg:pt-61.25">
          <Reveal className="mx-auto mb-5 max-w-227.5 text-center" amount={0.1}>
            <TextReveal
              text={TITLE}
              as="h1"
              active
              className="justify-center font-display text-display text-canvas"
            />
          </Reveal>

          <Reveal
            delay={0.45}
            amount={0.1}
            className="mx-auto mb-16 max-w-192.5 text-center sm:mb-31.25"
          >
            <p className="text-[1.375rem] font-semibold leading-normal text-canvas/60">
              We are a top 20 builder and developer shaping the future through bold ideas,
              lasting places, and meaningful impact in the communities we serve.
            </p>
          </Reveal>
        </Container>

        <Container>
          <div className="flex flex-col items-center gap-7 border-t border-canvas/40 py-10 sm:py-15 md:flex-row md:items-end md:justify-between md:gap-10">
            <Reveal direction="right" amount={0.2}>
              <h2 className="max-w-165 font-display text-h4 text-canvas">
                We create landmark projects that deliver
                lasting value to investors and communities.
              </h2>
            </Reveal>
            <Reveal direction="left" delay={0.1} amount={0.2}>
              <Button href="/services" variant="light" size="md" icon className="shrink-0">
                View Services
              </Button>
            </Reveal>
          </div>

          <ul
            id="hero-features"
            className="grid grid-cols-1 gap-3.5 pb-18 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5 lg:pb-25"
          >
            {heroFeatures.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
          </ul>
        </Container>
      </motion.div>

      {/* Curved white lip that hands off into the next section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-12.5 rounded-t-[3.125rem] bg-canvas sm:h-13.75 sm:rounded-t-[3.4375rem]"
      />
    </section>
  );
}
