import type { Metadata } from "next";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { posts } from "@/config/team";

export const metadata: Metadata = {
  title: "News & Insights",
  description:
    "Field notes, market briefings and design writing from the Elevazio development, investment and architecture teams.",
  alternates: { canonical: "/news" },
};

export default function NewsPage() {
  const categories = Array.from(new Set(posts.map((post) => post.category)));
  const [lead, ...rest] = posts;

  return (
    <PageShell
      eyebrow="Articles & insights"
      title="Notes from the site, the studio and the market"
      intro="Written by the people doing the work — updates on delivery, design decisions and the numbers behind the deals."
      image="/images/blog/blog_06.jpg"
      imageAlt="Colourful residential architecture"
    >
      <section className="overflow-x-clip py-15 sm:py-25 lg:py-37.5">
        <Container>
          <Reveal amount={0.4}>
            <p className="eyebrow text-ink-light">Browse by topic</p>
          </Reveal>
          <ul className="mt-5 flex flex-wrap gap-2.5 cursor-pointer">
            {categories.map((category) => (
              <li key={category}>
                <span className="inline-flex items-center rounded-full border border-line px-5 py-2 font-display text-body-sm font-semibold transition-colors duration-300 hover:border-primary hover:bg-primary hover:text-canvas">
                  {category}
                </span>
              </li>
            ))}
          </ul>

          <Reveal
            id={lead.slug}
            className="mt-12 grid scroll-mt-28 gap-8 rounded-xl bg-surface p-6 sm:p-9 md:grid-cols-2 md:items-center lg:mt-16 lg:gap-14"
          >
            <div className="relative aspect-4/3 overflow-hidden rounded-lg bg-canvas">
              <Image
                src={lead.image}
                alt={lead.title}
                fill
                sizes="(max-width: 767px) 92vw, 46vw"
                className="object-cover"
              />
            </div>
            <div>
              <p className="flex items-center gap-3 text-caption text-ink-light">
                <span className="rounded-full bg-primary px-3.5 py-1 text-eyebrow font-semibold uppercase text-accent">
                  {lead.category}
                </span>
                <time dateTime={lead.date}>{lead.date}</time>
                <span aria-hidden className="size-1 rounded-full bg-line" />
                {lead.readTime}
              </p>
              <h2 className="mt-5 font-display text-h3">{lead.title}</h2>
              <p className="mt-4 max-w-lg text-body text-ink-light">
                {lead.excerpt}
              </p>
              <p className="mt-7 inline-flex items-center gap-2 border-b border-line pb-1 font-display text-body-sm font-semibold">
                Read the briefing
                <ArrowUpRight aria-hidden className="size-4" />
              </p>
            </div>
          </Reveal>

          <ul className="mt-12 grid grid-cols-1 gap-x-7.5 gap-y-12 md:grid-cols-2 lg:mt-16 lg:gap-y-16">
            {rest.map((post, index) => (
              <Reveal
                as="li"
                key={post.slug}
                id={post.slug}
                delay={index * 0.07}
                className="group flex scroll-mt-28 gap-6 border-t border-line pt-8"
              >
                <div className="relative aspect-square w-28 shrink-0 overflow-hidden rounded-lg bg-surface sm:w-36">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 639px) 112px, 144px"
                    className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-105"
                  />
                </div>
                <div>
                  <p className="flex items-center gap-3 text-caption text-ink-light">
                    <time dateTime={post.date}>{post.date}</time>
                    <span aria-hidden className="size-1 rounded-full bg-line" />
                    {post.readTime}
                  </p>
                  <h3 className="mt-2 font-display text-h5 leading-[1.2]">
                    {post.title}
                  </h3>
                  <p className="mt-3 max-w-120 text-body-sm text-ink-light">
                    {post.excerpt}
                  </p>
                  <p className="mt-4 inline-flex items-center gap-1 font-display text-body-sm font-semibold text-ink-light transition-colors duration-300 group-hover:text-primary-hover">
                    Read more
                    <ArrowUpRight aria-hidden className="size-3.5" />
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.1} className="mt-16 flex flex-col items-center text-center" amount={0.3}>
            <Eyebrow>stay in the loop</Eyebrow>
            <h2 className="mt-6 max-w-136 font-display text-h3">
              Get the next briefing by email
            </h2>
            <p className="mt-4 max-w-lg text-body-sm text-ink-light">
              One email a month: what we built, what we learned and what we are
              watching next. No noise.
            </p>
            <Button href="/contact" size="md" icon className="mt-8">
              Subscribe via the contact form
            </Button>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 font-display text-body-sm font-semibold text-ink-light transition-colors duration-300 hover:text-primary-hover"
            >
              Back to the homepage
              <ArrowUpRight aria-hidden className="size-4" />
            </Link>
          </Reveal>
        </Container>
      </section>
    </PageShell>
  );
}
