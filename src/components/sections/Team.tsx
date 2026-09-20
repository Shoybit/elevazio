import Image from "next/image";

import { team } from "@/config/team";

import { Container } from "@/components/ui/Container";

import { Eyebrow } from "@/components/ui/Eyebrow";

import { Reveal } from "@/components/ui/Reveal";

import { ScrollTextReveal } from "@/components/ui/ScrollTextReveal";

const HEADING = "Global executive leadership";

export function Team() {
  return (
    <section
      id="team"
      aria-labelledby="team-heading"
      className="relative overflow-hidden py-15 sm:py-25 lg:py-37.5"
    >
      <Container>
        {/* ================================================================
            HEADING
        ================================================================ */}
        <div className="flex flex-col items-center text-center">
          <Reveal amount={0.4}>
            <Eyebrow>meet the team</Eyebrow>
          </Reveal>

          <Reveal
            delay={0.08}
            className="mt-6 max-w-160"
            amount={0.3}
          >
            <ScrollTextReveal
              text={HEADING}
              as="h2"
              id="team-heading"
              className="justify-center font-display text-h2"
            />
          </Reveal>
        </div>

        {/* ================================================================
            TEAM GRID
        ================================================================ */}
        <ul
          className="
            mt-14
            grid
            grid-cols-1
            gap-x-5
            gap-y-14
            sm:grid-cols-2
            sm:gap-x-6
            sm:gap-y-16
            md:grid-cols-3
            md:gap-x-6
            md:gap-y-20
            lg:mt-20
            lg:gap-x-7.5
            lg:gap-y-24
          "
        >
          {team.map((member, index) => (
            <Reveal
              as="li"
              key={member.name}
              delay={index * 0.06}
              className="group md:even:translate-y-15"
            >
              <article className="relative">
                {/* ==========================================================
                    CARD
                ========================================================== */}
                <div
                  className="
                    relative
                    aspect-4/5
                    overflow-hidden
                    bg-[#F4F1E9]
                  "
                >
                  {/* ========================================================
                      ORIGINAL IMAGE

                      No zoom.
                      No transform.
                      Stays completely still.
                  ======================================================== */}
                  <Image
                    src={member.image}
                    alt={`${member.name}, ${member.role}`}
                    fill
                    loading="lazy"
                    sizes="
                      (max-width: 639px) 92vw,
                      (max-width: 767px) 46vw,
                      30vw
                    "
                    className="
                      absolute
                      inset-0
                      z-0
                      object-cover
                      object-top
                    "
                  />

                  {/* ========================================================
                      MASKED PERSON IMAGE

                      Only opacity changes.
                      This creates a clean two-image transition without
                      movement or zoom.
                  ======================================================== */}
                  <Image
                    src={member.maskImage}
                    alt=""
                    aria-hidden="true"
                    fill
                    loading="lazy"
                    sizes="
                      (max-width: 639px) 92vw,
                      (max-width: 767px) 46vw,
                      30vw
                    "
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      z-10
                      object-cover
                      object-top
                      opacity-0
                      transition-opacity
                      duration-[800ms]
                      ease-[cubic-bezier(0.22,1,0.36,1)]
                      group-hover:opacity-100
                    "
                  />

                  {/* ========================================================
                      CAPTION BAR

                      Shape:
                      LEFT = HIGH
                      RIGHT = LOW

                      /----------------
                     /                 |
                    /__________________|

                      polygon:
                      left-top  = 0 0
                      right-top = 100% 22%
                  ======================================================== */}
                  <div
                    className="
                      absolute
                      inset-x-0
                      bottom-0
                      z-20
                      min-h-25
                      overflow-hidden
                      bg-[#F7F4EC]/94
                      px-7
                      pb-6
                      pt-7
                      backdrop-blur-[10px]
                      transition-colors
                      duration-[700ms]
                      ease-[cubic-bezier(0.22,1,0.36,1)]
                      group-hover:bg-[#E9F24F]
                      sm:px-8
                      sm:pb-7
                      sm:pt-8
                      lg:px-10
                      lg:pb-8
                      lg:pt-9
                    "
                    style={{
                      clipPath:
                        "polygon(0 0, 100% 22%, 100% 100%, 0 100%)",
                    }}
                  >
                    {/* ======================================================
                        SMALL ACCENT LINE
                    ====================================================== */}
                    {/* <span
                      aria-hidden
                      className="
                        absolute
                        left-7
                        top-[36%]
                        h-px
                        w-0
                        bg-black
                        transition-[width]
                        duration-700
                        ease-[cubic-bezier(0.22,1,0.36,1)]
                        group-hover:w-8
                        sm:left-8
                        lg:left-10
                      "
                    /> */}

                    {/* ======================================================
                        CAPTION CONTENT
                    ====================================================== */}
                    <div className="relative z-10">
                      <p
                        className="
                          text-[0.58rem]
                          font-semibold
                          uppercase
                          tracking-[0.18em]
                          text-ink-light
                          transition-colors
                          duration-600
                          ease-out
                          group-hover:text-black/65
                        "
                      >
                        {member.role}
                      </p>

                      <h3
                        className="
                          mt-1
                          font-display
                          text-h6
                          leading-tight
                          text-ink
                          transition-colors
                          duration-600
                          ease-out
                          group-hover:text-black
                        "
                      >
                        {member.name}
                      </h3>
                    </div>
                  </div>

                  {/* ========================================================
                      BOTTOM ACCENT
                  ======================================================== */}
                  <span
                    aria-hidden
                    className="
                      pointer-events-none
                      absolute
                      bottom-0
                      left-0
                      z-30
                      h-0.75
                      w-0
                      bg-black
                      transition-[width]
                      duration-700
                      ease-[cubic-bezier(0.22,1,0.36,1)]
                      group-hover:w-full
                    "
                  />
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}