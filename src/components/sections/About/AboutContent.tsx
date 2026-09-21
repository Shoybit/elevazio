import { Award, Target, Trophy } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Counter } from "@/components/ui/Counter";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { ScrollTextReveal } from "@/components/ui/ScrollTextReveal";
import { differentiators } from "@/config/differentiators";
import { introPillars, stats } from "@/config/stats";

const milestones = [
  { year: "1998", note: "Founded as a two-person development partnership." },
  { year: "2006", note: "First 500,000 sq ft mixed-use scheme delivered." },
  { year: "2014", note: "In-house architecture and construction divisions formed." },
  { year: "2021", note: "Reached 1,500 employees across 85 offices." },
  { year: "2025", note: "248 projects delivered, zero lost-time incidents." },
];

const awards = [
  {
    year: "2025",
    name: "Developer of the Year — Residential",
    body: "National Property Awards",
  },
  {
    year: "2024",
    name: "Best Mixed-Use Scheme",
    body: "Urban Land Institute Awards",
  },
  {
    year: "2023",
    name: "Sustainable Development Commendation",
    body: "Green Building Council",
  },
  {
    year: "2022",
    name: "Highest Safety Record, Top 25 Builder",
    body: "National Construction Board",
  },
];

function awardIcon(index: number) {
  if (index === 0) return Trophy;
  if (index === awards.length - 1) return Target;
  return Award;
}

/** Core values plus the two supporting statements. */
export function AboutPrinciples() {
  return (
    <section
      id="values"
      className="py-[3.75rem] sm:py-[6.25rem] lg:py-[9.375rem]"
    >
      <Container>
        <div className="flex flex-col items-start gap-6">
          <Reveal amount={0.4}>
            <Eyebrow>what we stand for</Eyebrow>
          </Reveal>
          <Reveal delay={0.08} className="max-w-[34rem]" amount={0.3}>
            <ScrollTextReveal
              text="Principles we do not compromise on"
              as="h2"
              className="font-display text-h2"
            />
          </Reveal>
        </div>

        <ul className="mt-12 grid gap-4 md:grid-cols-3 lg:mt-16 lg:gap-[1.875rem]">
          {differentiators.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal
                as="li"
                key={item.title}
                delay={index * 0.08}
                className="group flex h-full flex-col rounded-xl border border-line bg-canvas p-7 transition-[transform,box-shadow] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-45px_rgba(0,0,0,0.5)] sm:p-10"
              >
                <span className="mb-6 flex size-14 items-center justify-center rounded-full bg-primary-soft transition-colors duration-500 group-hover:bg-primary">
                  <Icon aria-hidden className="size-6" strokeWidth={1.5} />
                </span>
                <h3 className="font-display text-h5 leading-[1.2]">
                  {item.title}
                </h3>
                <p className="mt-3 text-body-sm text-ink-light">
                  {item.description}
                </p>
              </Reveal>
            );
          })}
        </ul>

        <div className="mt-14 grid gap-10 border-t border-line pt-12 md:grid-cols-2 lg:mt-20">
          {introPillars.map((pillar, index) => (
            <Reveal key={pillar.title} delay={index * 0.1}>
              <p className="font-display text-h6 leading-[1.23]">
                {pillar.title}
              </p>
              <p className="mt-3 max-w-[30rem] text-body-sm text-ink-light">
                {pillar.description}
              </p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

/** The three headline counters. */
export function AboutNumbers() {
  return (
    <section
      aria-label="Elevazio in numbers"
      className="bg-surface-warm py-[3.75rem] sm:py-[6.25rem] lg:py-[9.375rem]"
    >
      <Container>
        <ul className="grid gap-6 sm:grid-cols-3 lg:gap-[1.875rem]">
          {stats.map((stat) => (
            <li key={stat.label} className="rounded-lg bg-canvas p-8">
              <p className="eyebrow mb-4 text-ink-light">{stat.label}</p>
              <p className="font-display text-stat">
                <Counter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-body-sm text-ink-light">{stat.caption}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/** Company timeline alongside the awards list. */
export function AboutTrackRecord() {
  return (
    <section className="py-[3.75rem] sm:py-[6.25rem] lg:py-[9.375rem]">
      <Container className="grid gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <Reveal amount={0.4}>
            <Eyebrow>our journey</Eyebrow>
          </Reveal>
          <Reveal delay={0.08} className="mt-6" amount={0.3}>
            <h2 className="max-w-[24rem] font-display text-h2">
              Milestones that shaped the firm
            </h2>
          </Reveal>
          <ol className="mt-10">
            {milestones.map((item, index) => (
              <Reveal
                as="li"
                key={item.year}
                delay={index * 0.07}
                className="flex gap-6 border-t border-line py-5 first:border-t-0 first:pt-0"
              >
                <span className="font-display text-h5 text-primary">
                  {item.year}
                </span>
                <p className="max-w-[22rem] text-body-sm text-ink">
                  {item.note}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>

        <div id="awards" className="scroll-mt-28">
          <Reveal amount={0.4}>
            <Eyebrow>recognition</Eyebrow>
          </Reveal>
          <Reveal delay={0.08} className="mt-6" amount={0.3}>
            <h2 className="max-w-[24rem] font-display text-h2">
              Awards &amp; accreditation
            </h2>
          </Reveal>
          <ul className="mt-10 flex flex-col gap-4">
            {awards.map((award, index) => {
              const Icon = awardIcon(index);
              return (
                <Reveal
                  as="li"
                  key={award.name}
                  delay={index * 0.07}
                  className="group flex items-start gap-5 rounded-lg bg-surface p-6 transition-colors duration-500 hover:bg-surface-warm"
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-canvas text-accent">
                    <Icon aria-hidden className="size-5" strokeWidth={1.5} />
                  </span>
                  <div>
                    <p className="eyebrow text-ink-light">{award.year}</p>
                    <p className="mt-1 font-display text-h6 leading-[1.2]">
                      {award.name}
                    </p>
                    <p className="mt-1 text-body-sm text-ink-light">
                      {award.body}
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
