import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Check } from "lucide-react";

import { PageShell } from "@/components/layout/PageShell";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { ScrollTextReveal } from "@/components/ui/ScrollTextReveal";

import { services } from "@/config/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Real estate development, project management, investment, construction management and architecture — delivered by one in-house team from site acquisition to handover.",
  alternates: {
    canonical: "/services",
  },
};

const deliverables: Record<string, string[]> = {
  development: [
    "Site acquisition and feasibility studies",
    "Entitlements, rezoning and community consultation",
    "Massing studies and unit-mix optimisation",
    "Phased delivery programmes",
  ],

  management: [
    "Single-threaded project management",
    "Cost, schedule and risk reporting",
    "Procurement and contract administration",
    "Handover, defects and warranty",
  ],

  investment: [
    "Disciplined capital deployment",
    "Joint-venture and forward-funding structures",
    "Land and forward-flip advisory",
    "Transparent investor reporting",
  ],

  construction: [
    "In-house supervision on every site",
    "Safety-first sequencing and zero-incident programmes",
    "Subcontractor prequalification",
    "Quality control and snagging",
  ],

  architecture: [
    "Concept, design development and technical design",
    "Urban planning and landscape integration",
    "Building performance and daylight analysis",
    "Interior and amenity design",
  ],
};

export default function ServicesPage() {
  return (
    <PageShell
      eyebrow="what we offer"
      title="One team from first sketch to final handover"
      intro="Five disciplines under one roof. That means fewer hand-offs, clearer accountability and a building that performs the way it was drawn."
      image="/images/blog/blog_01.jpg"
      imageAlt="Architectural study of a residential tower"
    >
      {/* ======================================================================
          SERVICE INTRO
      ====================================================================== */}

      <section
        className="
          relative
          overflow-hidden
          py-16
          sm:py-24
          lg:py-32
        "
      >
        <Container>
          <div
            className="
              grid
              gap-10
              lg:grid-cols-[1fr_auto]
              lg:items-end
            "
          >
            <Reveal amount={0.35}>
              <div className="max-w-3xl">
                <Eyebrow>our disciplines</Eyebrow>

                <h2
                  className="
                    mt-6
                    max-w-4xl
                    font-display
                    text-h2
                  "
                >
                  Everything required to move an idea from possibility to
                  reality.
                </h2>
              </div>
            </Reveal>

            <Reveal
              delay={0.1}
              amount={0.35}
              className="lg:pb-1"
            >
              <a
                href="#services"
                className="
                  group
                  inline-flex
                  items-center
                  gap-3
                  font-display
                  text-body-sm
                  font-semibold
                  text-ink-light
                  transition-colors
                  duration-300
                  hover:text-accent
                "
              >
                Explore services

                <span
                  className="
                    flex
                    size-9
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-line
                    transition-all
                    duration-500
                    group-hover:border-primary
                    group-hover:bg-primary
                  "
                >
                  <ArrowDownRight
                    aria-hidden
                    className="
                      size-4
                      transition-transform
                      duration-500
                      group-hover:translate-y-0.5
                      group-hover:translate-x-0.5
                    "
                  />
                </span>
              </a>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ======================================================================
          SERVICE LIST
      ====================================================================== */}

      <section
        id="services"
        className="
          scroll-mt-20
          overflow-x-clip
          pb-20
          sm:pb-28
          lg:pb-40
        "
      >
        <Container>
          <div className="flex flex-col">
            {services.map((service, index) => {
              const isReverse = index % 2 === 1;

              return (
                <article
                  key={service.id}
                  id={service.id}
                  className="
                    group/service
                    relative
                    scroll-mt-28
                    border-t
                    border-line
                    py-14
                    sm:py-20
                    lg:py-28
                  "
                >
                  {/* ==========================================================
                      SERVICE HEADER
                  ========================================================== */}

                  <div
                    className="
                      mb-10
                      flex
                      items-center
                      justify-between
                      gap-6
                      lg:mb-14
                    "
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className="
                          font-display
                          text-caption
                          font-semibold
                          tracking-[0.12em]
                          text-ink-light
                        "
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span
                        aria-hidden
                        className="
                          h-px
                          w-8
                          bg-primary
                          sm:w-12
                        "
                      />

                      <span
                        className="
                          font-display
                          text-caption
                          font-semibold
                          uppercase
                          tracking-[0.08em]
                          text-ink-light
                        "
                      >
                        {service.title}
                      </span>
                    </div>

                    <span
                      aria-hidden
                      className="
                        hidden
                        font-display
                        text-[clamp(3rem,8vw,7rem)]
                        font-bold
                        leading-none
                        text-line/40
                        lg:block
                      "
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* ==========================================================
                      CONTENT
                  ========================================================== */}

                  <div
                    className="
                      grid
                      items-center
                      gap-10
                      lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]
                      lg:gap-20
                    "
                  >
                    {/* IMAGE */}

                    <Reveal
                      direction={isReverse ? "left" : "right"}
                      className={isReverse ? "lg:order-2" : undefined}
                    >
                      <Link
                        href="/contact"
                        className="
                          group/image
                          relative
                          block
                          overflow-hidden
                          rounded-xl
                          bg-surface-warm
                        "
                      >
                        <div
                          className="
                            relative
                            aspect-[1.08]
                            overflow-hidden
                          "
                        >
                          <Image
                            src={service.image}
                            alt=""
                            fill
                            sizes="
                              (max-width: 1023px) 92vw,
                              52vw
                            "
                            className="
                              object-contain
                              p-8
                              transition-transform
                              duration-[1.2s]
                              ease-out-expo
                              group-hover/image:scale-[1.035]
                            "
                          />

                          {/* Image overlay */}
                          <div
                            aria-hidden
                            className="
                              absolute
                              inset-0
                              bg-black/0
                              transition-colors
                              duration-700
                              group-hover/image:bg-black/3
                            "
                          />

                          {/* Corner action */}
                          <span
                            className="
                              absolute
                              bottom-5
                              right-5
                              flex
                              size-11
                              items-center
                              justify-center
                              rounded-full
                              bg-canvas
                              text-accent
                              opacity-0
                              shadow-lg
                              transition-all
                              duration-500
                              ease-out-expo
                              group-hover/image:translate-x-0
                              group-hover/image:opacity-100
                            "
                          >
                            <ArrowUpRight
                              aria-hidden
                              className="
                                size-4
                                transition-transform
                                duration-500
                                group-hover/image:translate-x-0.5
                                group-hover/image:-translate-y-0.5
                              "
                            />
                          </span>
                        </div>
                      </Link>
                    </Reveal>

                    {/* COPY */}

                    <Reveal
                      direction={isReverse ? "right" : "left"}
                      delay={0.08}
                      className={isReverse ? "lg:order-1" : undefined}
                    >
                      <div className="max-w-xl">
                        <h2
                          className="
                            font-display
                            text-h3
                            leading-[1.05]
                          "
                        >
                          {service.title}
                        </h2>

                        <p
                          className="
                            mt-5
                            max-w-136
                            text-body
                            leading-relaxed
                            text-ink-light
                          "
                        >
                          {service.summary}
                        </p>

                        {/* Deliverables */}
                        <ul
                          className="
                            mt-8
                            flex
                            flex-col
                            gap-3
                            border-t
                            border-line
                            pt-7
                          "
                        >
                          {deliverables[service.id]?.map((item) => (
                            <li
                              key={item}
                              className="
                                group/item
                                flex
                                items-start
                                gap-3
                              "
                            >
                              <span
                                className="
                                  mt-0.5
                                  flex
                                  size-5
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-full
                                  bg-primary/15
                                "
                              >
                                <Check
                                  aria-hidden
                                  className="
                                    size-3
                                    text-accent
                                  "
                                  strokeWidth={2.5}
                                />
                              </span>

                              <span
                                className="
                                  text-body-sm
                                  text-ink
                                  transition-colors
                                  duration-300
                                  group-hover/item:text-accent
                                "
                              >
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>

                        {/* CTA */}
                        <Button
                          href="/contact"
                          variant="outline"
                          size="md"
                          icon
                          className="mt-9"
                        >
                          Discuss a project
                        </Button>
                      </div>
                    </Reveal>
                  </div>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ======================================================================
          HOW WE WORK
      ====================================================================== */}

      <section
        className="
          relative
          overflow-hidden
          bg-accent
          py-20
          sm:py-28
          lg:py-40
        "
      >
        {/* Background detail */}
        <div
          aria-hidden
          className="
            pointer-events-none
            absolute
            -right-40
            top-1/2
            size-140
            -translate-y-1/2
            rounded-full
            bg-primary/10
            blur-[100px]
          "
        />

        <Container>
          <div
            className="
              relative
              grid
              gap-14
              lg:grid-cols-[0.8fr_1.2fr]
              lg:gap-24
            "
          >
            {/* LEFT */}

            <Reveal amount={0.35}>
              <div>
                <Eyebrow tone="canvas">
                  how we work
                </Eyebrow>

                <h2
                  className="
                    mt-6
                    max-w-xl
                    font-display
                    text-h2
                    text-canvas
                  "
                >
                  One connected process. Fewer compromises.
                </h2>

                <p
                  className="
                    mt-6
                    max-w-md
                    text-body
                    leading-relaxed
                    text-canvas/60
                  "
                >
                  By keeping development, design, investment, construction
                  and management connected, decisions stay aligned from the
                  beginning through completion.
                </p>
              </div>
            </Reveal>

            {/* RIGHT */}

            <div className="flex flex-col">
              {[
                {
                  number: "01",
                  title: "Understand",
                  text: "We establish the opportunity, constraints and ambitions before defining the right path forward.",
                },
                {
                  number: "02",
                  title: "Shape",
                  text: "Our disciplines work together to develop the design, programme and commercial strategy.",
                },
                {
                  number: "03",
                  title: "Deliver",
                  text: "A connected team carries the project through construction, quality control and handover.",
                },
              ].map((step, index) => (
                <Reveal
                  key={step.number}
                  delay={index * 0.08}
                  amount={0.25}
                >
                  <div
                    className="
                      grid
                      gap-5
                      border-t
                      border-white/15
                      py-7
                      sm:grid-cols-[4rem_1fr]
                      sm:gap-8
                      sm:py-9
                    "
                  >
                    <span
                      className="
                        font-display
                        text-caption
                        font-semibold
                        tracking-[0.12em]
                        text-primary
                      "
                    >
                      {step.number}
                    </span>

                    <div>
                      <h3
                        className="
                          font-display
                          text-h4
                          text-canvas
                        "
                      >
                        {step.title}
                      </h3>

                      <p
                        className="
                          mt-3
                          max-w-xl
                          text-body-sm
                          leading-relaxed
                          text-canvas/55
                        "
                      >
                        {step.text}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ======================================================================
          FINAL CTA
      ====================================================================== */}

      <section
        className="
          relative
          overflow-hidden
          bg-surface-warm
          py-20
          sm:py-28
          lg:py-40
        "
      >
        <Container>
          <div className="flex flex-col items-center text-center">
            <Reveal amount={0.4}>
              <Eyebrow>next step</Eyebrow>
            </Reveal>

            <Reveal
              delay={0.08}
              className="mt-6 max-w-180"
              amount={0.3}
            >
              <ScrollTextReveal
                text="Tell us what you are planning"
                as="h2"
                className="
                  justify-center
                  font-display
                  text-h2
                "
              />
            </Reveal>

            <Reveal
              delay={0.12}
              className="mt-6 max-w-xl"
              amount={0.3}
            >
              <p
                className="
                  text-body
                  leading-relaxed
                  text-ink-light
                "
              >
                Whether you have a site, an investment opportunity or simply
                an idea worth exploring, let’s start the conversation.
              </p>
            </Reveal>

            <Reveal
              delay={0.18}
              className="mt-8"
              amount={0.3}
            >
              <Button
                href="/contact"
                size="lg"
                icon
              >
                Book a consultation
              </Button>
            </Reveal>

            <Reveal
              delay={0.22}
              className="mt-7"
              amount={0.3}
            >
              <Link
                href="/projects"
                className="
                  group
                  inline-flex
                  items-center
                  gap-2
                  font-display
                  text-body-sm
                  font-semibold
                  transition-colors
                  duration-300
                  hover:text-primary-hover
                "
              >
                Or browse delivered projects

                <ArrowUpRight
                  aria-hidden
                  className="
                    size-4
                    transition-transform
                    duration-300
                    group-hover:translate-x-0.5
                    group-hover:-translate-y-0.5
                  "
                />
              </Link>
            </Reveal>
          </div>
        </Container>
      </section>
    </PageShell>
  );
}