"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { differentiators } from "@/config/differentiators";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { ScrollTextReveal } from "@/components/ui/ScrollTextReveal";

const HEADING = "Built Different. Built to Last.";

export function Difference() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section
      ref={ref}
      id="difference"
      aria-labelledby="difference-heading"
      className="overflow-x-clip py-15 sm:py-25 lg:py-37.5"
    >
      <Container className="flex flex-col gap-10 md:flex-row md:items-stretch md:gap-12 lg:gap-20">
        <div className="relative min-h-88 flex-1 overflow-hidden rounded-xl sm:min-h-120">
          <motion.div
            aria-hidden
            data-motion-transform=""
            style={{ y: imageY }}
            className="absolute inset-y-[-8%] inset-x-0"
          >
            <Image
              src="/images/projects/developer-01.jpg"
              alt="Construction team reviewing plans on site"
              fill
              loading="lazy"
              sizes="(max-width: 1023px) 100vw, 45vw"
              className="object-fit"
            />
          </motion.div>
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-t from-accent/35 to-transparent"
          />
        </div>

        <div className="flex flex-1 flex-col lg:py-4">
          <Reveal amount={0.4}>
            <Eyebrow>Our commitment</Eyebrow>
          </Reveal>

          <Reveal delay={0.06} className="mt-6" amount={0.3}>
            <ScrollTextReveal
              text={HEADING}
              as="h2"
              id="difference-heading"
              className="font-display text-h2"
            />
          </Reveal>

          <Reveal delay={0.14} amount={0.3}>
            <p className="mt-6 max-w-136 text-body-sm text-ink-light">
              Elevazio brings together the scale of a national developer with the care of a trusted local partner.
              Decades of experience have shown us that lasting value is shaped long before the first foundation is laid.
            </p>
          </Reveal>

          <ul className="mt-9 flex flex-col lg:mt-11">
            {differentiators.map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal
                  as="li"
                  key={item.title}
                  delay={index * 0.08}
                  className="group flex items-start gap-5 border-t border-line py-6 first:border-t-0 first:pt-0 sm:gap-7 sm:py-7"
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-soft text-accent transition-colors duration-500 group-hover:bg-primary sm:size-14">
                    <Icon aria-hidden className="size-5 sm:size-6" strokeWidth={1.5} />
                  </span>
                  <div>
                    <h3 className="font-display text-h6 leading-[1.2]">
                      {item.title}
                    </h3>
                    <p className="mt-2 max-w-120 text-body-sm text-ink-light">
                      {item.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}
