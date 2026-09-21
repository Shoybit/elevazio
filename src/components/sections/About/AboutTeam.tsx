import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { ScrollTextReveal } from "@/components/ui/ScrollTextReveal";
import { team } from "@/config/team";

/** Executive team grid, reusing the homepage's staggered rhythm. */
export function AboutTeam() {
  return (
    <section
      id="team"
      className="scroll-mt-28 bg-surface-warm py-15 sm:py-25 lg:py-37.5"
    >
      <Container>
        <Reveal amount={0.4}>
          <Eyebrow>leadership</Eyebrow>
        </Reveal>
        <Reveal delay={0.08} className="mt-6 max-w-136" amount={0.3}>
          <ScrollTextReveal
            text="Global executive leadership"
            as="h2"
            className="font-display text-h2"
          />
        </Reveal>

        <ul className="mt-12 grid grid-cols-1 gap-x-7.5 gap-y-12 sm:grid-cols-2 md:grid-cols-3 lg:mt-16 lg:gap-y-20">
          {team.map((member, index) => (
            <Reveal
              as="li"
              key={member.name}
              delay={index * 0.06}
              className="group md:even:translate-y-15"
            >
              <div className="relative aspect-4/5 overflow-hidden rounded-xl bg-canvas">
                <Image
                  src={member.image}
                  alt={`${member.name}, ${member.role}`}
                  fill
                  sizes="(max-width: 639px) 92vw, (max-width: 767px) 46vw, 30vw"
                  className="object-cover object-top transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.06]"
                />
              </div>
              <h3 className="mt-5 font-display text-h5 leading-[1.2]">
                {member.name}
              </h3>
              <p className="mt-1 text-body-sm text-ink-light">{member.role}</p>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/** Closing call to action for careers enquiries. */
export function AboutCareers() {
  return (
    <section
      id="careers"
      className="scroll-mt-28 py-15 sm:py-25 lg:py-37.5"
    >
      <Container>
        <Reveal className="flex flex-col items-start gap-8 rounded-xl bg-accent p-8 text-canvas sm:p-12 lg:flex-row lg:items-center lg:justify-between lg:p-16">
          <div className="max-w-xl">
            <h2 className="font-display text-h3 text-primary">
              Build the next landmark with us
            </h2>
            <p className="mt-4 text-body-sm text-canvas/60">
              We hire architects, engineers, quantity surveyors and site
              managers across every office. Send us your portfolio and we will
              come back within a week.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href="/contact" size="md" icon>
              Join the team
            </Button>
            <Link
              href="/projects"
              className="inline-flex h-13 items-center gap-2 rounded-full border border-canvas/25 px-7 font-display text-base font-semibold text-canvas transition-colors duration-500 hover:border-primary hover:text-primary"
            >
              See our work
              <ArrowUpRight aria-hidden className="size-4" />
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
