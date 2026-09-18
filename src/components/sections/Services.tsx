"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";

import { services } from "@/config/services";

import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { ScrollTextReveal } from "@/components/ui/ScrollTextReveal";
import { cn } from "@/lib/utils";

const HEADING = "Explore some of the services we offer.";

const WIDE_FROM = 3;

const IMAGE_CLASS =
  "h-[13.5rem] w-[20rem] xl:h-[14.5rem] xl:w-[21.5rem] 2xl:h-[15.5rem] 2xl:w-[23rem]";

function ServiceCard({
  service,
  index,
}: {
  service: (typeof services)[number];
  index: number;
}) {
  const isWide = index >= WIDE_FROM;

  return (
    <li
      className={cn(
        "group relative",
        isWide ? "lg:col-span-3" : "lg:col-span-2",
      )}
    >
      <Reveal
        delay={index * 0.06}
        amount={0.2}
        className={cn(
          "relative h-92 overflow-hidden",
          "rounded-tr-4xl rounded-br-4xl rounded-bl-4xl",
          "bg-surface",
          "sm:h-96",
          "xl:h-100",
        )}
      >
        {/* -----------------------------------------------------------
            LIME BACKGROUND

            The lime starts exactly from the center of the ring and
            expands smoothly across the entire card.

            On mouse leave it collapses back into the ring.
            ----------------------------------------------------------- */}

        <span
          aria-hidden
          className="
            pointer-events-none
            absolute
            inset-0
            z-0
            bg-primary
            [clip-path:circle(0%_at_calc(100%-2.825rem)_2.825rem)]
            transition-[clip-path]
            duration-1300
            ease-[cubic-bezier(0.22,1,0.36,1)]
            group-hover:[clip-path:circle(160%_at_calc(100%-2.825rem)_2.825rem)]
          "
        />

        {/* -----------------------------------------------------------
            BUILDING IMAGE
            ----------------------------------------------------------- */}

        <Link
          href={service.href}
          aria-label={`${service.title} — learn more`}
          className="
            absolute
            bottom-0
            left-0
            z-10
            block
          "
        >
          <Image
            src={service.image}
            alt=""
            width={368}
            height={245}
            loading="lazy"
            sizes="
              (max-width: 1023px) 320px,
              (max-width: 1279px) 320px,
              (max-width: 1535px) 344px,
              368px
            "
            className={cn(
              IMAGE_CLASS,
              "object-contain object-bottom-left",
              "transition-transform",
              "duration-850",
              "ease-[cubic-bezier(0.22,1,0.36,1)]",
              "group-hover:scale-[1.035]",
            )}
          />
        </Link>

        {/* -----------------------------------------------------------
            TITLE
            ----------------------------------------------------------- */}

        <div
          className="
            relative
            z-20
            px-8
            pt-8
            sm:px-9
            sm:pt-9
            xl:px-10
            xl:pt-10
          "
        >
          <h3
            className="
              max-w-[18rem]
              font-display
              text-[1.75rem]
              font-medium
              leading-[0.96]
              tracking-[-0.045em]
              text-accent
              transition-colors
              duration-500
              ease-[cubic-bezier(0.22,1,0.36,1)]
              xl:text-[1.9rem]
            "
          >
            {service.title}
          </h3>
        </div>

        {/* -----------------------------------------------------------
            CORNER NOTCH
            ----------------------------------------------------------- */}

        {/* <CornerNotch className="bg-surface-warm" /> */}

        {/* -----------------------------------------------------------
            TOP-RIGHT RING

            The ring stays above the lime animation.
            ----------------------------------------------------------- */}

        <span
          aria-hidden
          className="
            absolute
            right-4
            top-4
            z-30
            flex
            size-[3.65rem]
            items-center
            justify-center
            rounded-full
            bg-primary
            transition-all
            duration-500
            ease-[cubic-bezier(0.22,1,0.36,1)]
            group-hover:scale-105
            group-hover:bg-black
          "
        >
          <ArrowUpRight
            strokeWidth={1.8}
            className="
              size-[1.2rem]
              text-accent
              transition-all
              duration-500
              ease-[cubic-bezier(0.22,1,0.36,1)]
              group-hover:rotate-45
              group-hover:text-primary
            "
          />
        </span>
      </Reveal>
    </li>
  );
}

export function Services() {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const glowY = useTransform(
    scrollYProgress,
    [0, 1],
    ["-10%", "10%"],
  );

  return (
    <section
      ref={ref}
      id="services"
      aria-labelledby="services-heading"
      className="
        relative
        overflow-hidden
        bg-surface-warm
        py-18
        sm:py-26
        lg:py-32
        xl:py-36
      "
    >
      {/* -------------------------------------------------------------
          BACKGROUND GLOW
          ------------------------------------------------------------- */}

      <motion.div
        aria-hidden
        style={{ y: glowY }}
        className="
          pointer-events-none
          absolute
          right-[-12%]
          top-[-8%]
          size-128
          rounded-full
          bg-primary/15
          blur-[7rem]
        "
      />

      {/* -------------------------------------------------------------
          DECORATIVE STRIPES
          ------------------------------------------------------------- */}

      <div
        aria-hidden
        className="
          diagonal-stripes
          pointer-events-none
          absolute
          -left-20
          top-0
          hidden
          h-64
          w-152
          opacity-60
          lg:block
        "
      />

      <div
        aria-hidden
        className="
          diagonal-stripes
          pointer-events-none
          absolute
          -bottom-20
          -left-24
          hidden
          h-64
          w-136
          opacity-60
          lg:block
        "
      />

      <Container className="relative">
        {/* -----------------------------------------------------------
            SECTION HEADER
            ----------------------------------------------------------- */}

        <div className="flex flex-col items-center text-center">
          <Reveal amount={0.4}>
            <Eyebrow>what we offer</Eyebrow>
          </Reveal>

          <Reveal
            delay={0.08}
            amount={0.3}
            className="mt-6 max-w-190"
          >
            <ScrollTextReveal
              text={HEADING}
              as="h2"
              id="services-heading"
              className="justify-center font-display text-h2"
            />
          </Reveal>
        </div>

        {/* -----------------------------------------------------------
            SERVICE GRID

            Top:
            2 + 2 + 2

            Bottom:
            3 + 3
            ----------------------------------------------------------- */}

        <ul
          className="
            mt-12
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            lg:mt-16
            lg:grid-cols-6
            lg:gap-6
            xl:gap-7
          "
        >
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
            />
          ))}
        </ul>

        {/* -----------------------------------------------------------
            FOOTER COPY
            ----------------------------------------------------------- */}

        <Reveal
          delay={0.2}
          className="
            mx-auto
            mt-10
            max-w-176
            text-center
            text-caption
            text-ink-light
            lg:mt-14
          "
        >
          Explore the full spectrum of our services and unlock possibilities
          that will redefine your property portfolio.
        </Reveal>
      </Container>
    </section>
  );
}