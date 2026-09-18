import Image from "next/image";
import { Check } from "lucide-react";
import { introPillars, stats } from "@/config/stats";
import { Container } from "@/components/ui/Container";
import { Counter } from "@/components/ui/Counter";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { ScrollTextReveal } from "@/components/ui/ScrollTextReveal";

const HEADING =
  "A leading privately held real estate investment and management firm worldwide.";

function StatCard({
  stat,
  index,
}: {
  stat: (typeof stats)[number];
  index: number;
}) {
  return (
    <Reveal
      as="li"
      delay={index * 0.08}
      className="flex min-h-[12.5rem] min-w-0 flex-col justify-between rounded-lg bg-surface px-5 py-6 transition-colors duration-500 hover:bg-surface-warm sm:min-h-[13.5rem] sm:px-10 sm:py-8 xl:min-h-[17.5rem] xl:py-10 2xl:min-h-[21.875rem]"
    >
      <h3 className="border-b border-line pb-4 text-eyebrow font-semibold uppercase text-accent">
        {stat.label}
      </h3>
      <p className="mt-4">
        <Counter
          value={stat.value}
          suffix={stat.suffix}
          className="font-display text-stat text-accent"
        />
      </p>
      <p className="mt-2 text-body-sm text-ink-light">{stat.caption}</p>
    </Reveal>
  );
}

export function Intro() {
  return (
    <section
      id="about"
      aria-labelledby="intro-heading"
      className="overflow-x-clip pt-[4.5rem] sm:pt-[6.25rem] lg:pt-[7.5rem]"
    >
      {/* Statement + supporting pillars */}
      <Container className="pb-[3.75rem] sm:pb-[5rem] lg:pb-[6.25rem]">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:items-start md:gap-[1.875rem]">
          <div className="flex items-start">
            <Eyebrow>who we are</Eyebrow>
          </div>

          <div>
            <Reveal amount={0.2}>
              <ScrollTextReveal
                text={HEADING}
                as="h2"
                id="intro-heading"
                className="font-display text-h2"
              />
            </Reveal>

            <ul className="mt-9 grid gap-x-[4.375rem] gap-y-7 sm:mt-12 sm:grid-cols-2">
              {introPillars.map((pillar, index) => (
                <Reveal
                  as="li"
                  key={pillar.title}
                  delay={0.1 + index * 0.1}
                  className="flex gap-4"
                >
                  <Check
                    aria-hidden
                    className="mt-1 size-6 shrink-0 text-primary"
                    strokeWidth={2}
                  />
                  <div>
                    <p className="font-display text-h6 leading-[1.23]">
                      {pillar.title}
                    </p>
                    <p className="mt-3 text-body-sm text-ink-light">
                      {pillar.description}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </Container>

      {/* Media plate + counters */}
      <Container className="pb-[3.75rem] sm:pb-[5rem] lg:pb-[9.375rem]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-[1.875rem]">
          <Reveal
            direction="right"
            className="flex min-w-0 flex-col lg:w-[calc((100%-1.875rem)*0.45)] lg:shrink-0 xl:w-[calc((100%-1.875rem)*0.485)]"
          >
            <div className="relative aspect-4/5 overflow-hidden rounded-xl bg-surface sm:aspect-3/2 lg:aspect-auto lg:h-full lg:min-h-[21.875rem]">
              <Image
                src="/images/projects/apartment-01-d.jpg"
                alt="Contemporary residential tower with landscaped terraces"
                fill
                loading="lazy"
                sizes="(max-width: 1023px) 100vw, 45vw"
                className="object-fit transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] hover:scale-105"
              />
            </div>
          </Reveal>

          <ul className="grid min-w-0 flex-1 grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-[1.875rem]">
            {stats.map((stat, index) => (
              <StatCard key={stat.label} stat={stat} index={index} />
            ))}
            <Reveal
              as="li"
              delay={0.24}
              className="relative min-h-[12.5rem] overflow-hidden rounded-lg sm:min-h-[10.9375rem]"
            >
              <Image
                src="/images/projects/apartment-02-d.jpg"
                alt="Residents walking through a landscaped courtyard"
                fill
                loading="lazy"
                sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 24vw"
                className="object-fit transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] hover:scale-105"
              />
            </Reveal>
          </ul>
        </div>
      </Container>
    </section>
  );
}
