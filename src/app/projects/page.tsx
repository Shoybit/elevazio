import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Counter } from "@/components/ui/Counter";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { projects } from "@/config/projects";
import { stats } from "@/config/stats";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "A selection of Elevazio developments: apartment buildings, residential estates, mixed-use towers and office buildings across North America.",
  alternates: { canonical: "/projects" },
};

const categoryById: Record<string, string> = {
  "apartment-building": "Residential",
  "eden-estate": "Residential",
  "councill-square": "Mixed use",
  "office-building": "Commercial",
};

export default function ProjectsPage() {  return (
    <PageShell
      eyebrow="selected projects"
      title="Landmark developments, delivered and lived in"
      intro="Every scheme below was designed, built and handed over by the same Elevazio team — and is still performing to spec today."
      image="/images/blog/blog_04.jpg"
      imageAlt="Elevazio residential development"
    >
      <section className="overflow-x-clip py-15 sm:py-25 lg:py-37.5">
        <Container>
          <ul className="grid grid-cols-1 gap-x-7.5 gap-y-14 sm:grid-cols-2 lg:gap-y-20">
            {projects.map((project, index) => (
              <Reveal
                as="li"
                key={project.id}
                id={project.id}
                delay={index * 0.08}
                className="group scroll-mt-28 sm:even:translate-y-15"
              >
                <Link href="/contact" className="block">
                  <span className="relative block aspect-4/3 overflow-hidden rounded-xl bg-surface">
                    <Image
                      src={project.image}
                      alt={`${project.title} — ${project.location}`}
                      fill
                      sizes="(max-width: 639px) 92vw, (max-width: 1023px) 46vw, 30vw"
                      className="object-cover transition-transform duration-[1.4s] ease-out-expo group-hover:scale-105"
                    />
                    <span className="absolute left-5 top-5 rounded-full bg-canvas/95 px-4 py-1.5 text-eyebrow font-semibold uppercase">
                      {categoryById[project.id]}
                    </span>
                    <span className="absolute bottom-5 right-5 flex size-11 items-center justify-center rounded-full bg-primary text-accent transition-transform duration-500 ease-out-expo group-hover:rotate-45">
                      <ArrowUpRight aria-hidden className="size-4" />
                    </span>
                  </span>
                  <span className="mt-6 flex items-start justify-between gap-4">
                    <span className="flex flex-col gap-1.5">
                      <span className="font-display text-h5 leading-[1.2]">
                        {project.title}
                      </span>
                      <span className="flex items-center gap-1.5 text-body-sm text-ink-light">
                        <MapPin aria-hidden className="size-4 text-primary" />
                        {project.location} · {project.year}
                      </span>
                    </span>
                    <span className="text-outline-dark font-display text-[3rem] font-bold leading-none">
                      {project.index}
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-accent py-15 text-canvas sm:py-25 lg:py-37.5">
        <Container>
          <div className="flex flex-col items-center text-center">
            <Reveal amount={0.4}>
              <Eyebrow tone="canvas">the numbers</Eyebrow>
            </Reveal>
            <ul className="mt-10 grid w-full gap-8 sm:grid-cols-3 lg:gap-7.5">
              {stats.map((stat) => (
                <li key={stat.label}>
                  <p className="eyebrow text-canvas/55">{stat.label}</p>
                  <p className="mt-3 font-display text-stat text-primary">
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-2 text-body-sm text-canvas/55">
                    {stat.caption}
                  </p>
                </li>
              ))}
            </ul>
            <Reveal delay={0.16} className="mt-12" amount={0.3}>
              <Button href="/contact" size="lg" icon>
                Start Your Project
              </Button>
            </Reveal>
          </div>
        </Container>
      </section>
    </PageShell>
  );
}
