"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight, MapPin } from "lucide-react";
import { projects } from "@/config/projects";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { ScrollTextReveal } from "@/components/ui/ScrollTextReveal";

const HEADING = "Bold design, lasting legacy";

/**
 * One panel of the stacked gallery. Panels are pinned to the top of the
 * viewport so the next project slides over the previous one; the last panel is
 * in normal flow so the section ends cleanly.
 */
function ProjectPanel({
  project,
  isLast,
  index,
}: {
  project: (typeof projects)[number];
  isLast: boolean;
  index: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["12%", "-12%"]);

  return (
    <article
      ref={ref}
      className={`flex min-h-svh flex-col overflow-hidden bg-accent lg:flex-row ${
        isLast ? "relative" : "sticky top-0"
      }`}
    >
      {/* Media */}
      <div className="relative min-h-[52svh] flex-1 lg:order-2 lg:min-h-0 lg:w-1/2">
        <motion.div
          data-motion-transform=""
          className="absolute inset-0"
          style={{ y: imageY, scale: 1.08 }}
        >
          <Image
            src={project.image}
            alt={`${project.title} — ${project.location}`}
            fill
            priority={index === 0}
            loading={index === 0 ? undefined : "lazy"}
            sizes="(max-width: 1023px) 100vw, 50vw"
            className="object-fit"
          />
        </motion.div>
        {/* Softens the seam where the next panel slides over this one. */}
        {/* <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-accent to-transparent"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-accent via-accent/25 to-transparent lg:bg-linear-to-r lg:from-accent lg:via-accent/20 lg:to-transparent"
        /> */}
      </div>

      {/* Copy */}
      <div className="relative flex flex-col justify-end py-10 lg:order-1 lg:w-1/2 lg:justify-center lg:py-0">
        <Container className="w-full">
          <motion.div
            data-motion-transform=""
            style={{ y: copyY }}
            className="max-w-136"
          >
            <Reveal direction="up" amount={0.15}>
              <Link
                href="/projects"
                className="group flex items-center gap-5 sm:gap-7"
                aria-label={`View ${project.title}`}
              >
                <span className="text-outline-dark font-display text-[5.5rem] font-bold leading-[0.78] tracking-[-0.04em] sm:text-[8rem] lg:text-[9.5rem]">
                  {project.index}
                </span>
                <span className="flex flex-1 flex-col gap-2">
                  <span className="font-display text-h4-tight text-canvas">
                    {project.title}
                  </span>
                  <span className="flex items-center gap-1.5 text-body-sm text-canvas/55">
                    <MapPin aria-hidden className="size-4 shrink-0 text-primary" />
                    {project.location} · {project.year}
                  </span>
                  <span className="mt-2 inline-flex w-fit items-center gap-2 border-b border-canvas/25 pb-1 font-display text-body-sm font-semibold text-canvas transition-colors duration-500 group-hover:border-primary group-hover:text-primary">
                    View project
                    <ArrowUpRight
                      aria-hidden
                      className="size-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </span>
                </span>
              </Link>
            </Reveal>
          </motion.div>
        </Container>
      </div>
    </article>
  );
}

export function ProjectsShowcase() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="relative bg-accent pb-15 text-canvas sm:pb-25 lg:pb-37.5"
    >
      <Container className="pt-15 sm:pt-25 lg:pt-37.5">
        <div className="flex flex-col items-start gap-6 lg:max-w-125">
          <Reveal amount={0.4}>
            <Eyebrow tone="canvas">selected projects</Eyebrow>
          </Reveal>
          <Reveal delay={0.08} amount={0.3}>
            <ScrollTextReveal
              text={HEADING}
              as="h2"
              id="projects-heading"
              className="font-display text-h2 text-canvas"
            />
          </Reveal>
        </div>
      </Container>

      <div className="relative mt-10 lg:mt-20">
        {projects.map((project, index) => (
          <ProjectPanel
            key={project.id}
            project={project}
            index={index}
            isLast={index === projects.length - 1}
          />
        ))}
      </div>
    </section>
  );
}
