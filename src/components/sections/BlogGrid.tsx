import Image from "next/image";
import Link from "next/link";
import { posts } from "@/config/team";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { ScrollTextReveal } from "@/components/ui/ScrollTextReveal";

const HEADING = "Discover fresh ideas and trends.";

export function BlogGrid() {
  const marqueePosts = [...posts, ...posts];

  return (
    <section
      id="news"
      aria-labelledby="news-heading"
      className="
        relative
        overflow-hidden
        py-15
        sm:py-25
        lg:py-37.5
      "
    >
      <Container>
        {/* ================================================================
            HEADER
        ================================================================ */}
        <div
          className="
            flex
            flex-col
            items-start
            gap-6
            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >
          <div className="flex flex-col items-start gap-6">
            <Reveal amount={0.4}>
              <Eyebrow>Articles &amp; insights</Eyebrow>
            </Reveal>

            <Reveal delay={0.08} className="max-w-136" amount={0.3}>
              <ScrollTextReveal
                text={HEADING}
                as="h2"
                id="news-heading"
                className="font-display text-h2"
              />
            </Reveal>
          </div>

          <Reveal delay={0.16} amount={0.3}>
            <Button href="/news" variant="primary" size="md" icon>
              View all
            </Button>
          </Reveal>
        </div>

        {/* ================================================================
            MARQUEE
        ================================================================ */}
        <div
          className="
            group
            relative
            mt-12
            overflow-hidden
            sm:mt-14
            lg:mt-16
          "
        >
          {/*
            Pure-CSS marquee, matching the partner strip below. Driving it from
            JS meant `animation-play-state` could not pause it (that property
            has no effect on a JS-driven loop), so hovering did nothing. As a
            CSS animation it runs on the compositor, honours
            `prefers-reduced-motion` for free, and `group-hover` genuinely
            pauses it so a card can be read.

            `group` sits on the clipping wrapper, not on the track: Tailwind
            compiles `group-hover:` to `.group:hover &`, which needs the
            marked element to be an *ancestor*. `group-focus-within` is included
            so keyboard users get the same pause, since they never hover.

            `pr-*` matches the gap so `translateX(-50%)` lands exactly back on
            the first copy; `duration` is inline because a `var()` reached
            through a `@theme` token is resolved in that token's context, not
            the element's.
          */}
          <div
            className="
              flex
              w-max
              gap-5
              pr-5
              animate-marquee
              motion-reduce:animate-none
              group-hover:[animation-play-state:paused]
              group-focus-within:[animation-play-state:paused]
              sm:gap-6 sm:pr-6
              lg:gap-7.5 lg:pr-7.5
            "
            style={{ animationDuration: "42s" }}
          >
            {marqueePosts.map((post, index) => {
              const isDuplicate = index >= posts.length;

              return (
                <article
                  key={`${post.slug}-${index}`}
                  // The second copy exists only to make the loop seamless.
                  // Without this, screen readers announce every article twice
                  // and keyboard users tab through twelve links instead of six.
                  aria-hidden={isDuplicate}
                  className="
                    group
                    w-70
                    shrink-0
                    sm:w-[20rem]
                    md:w-84
                    lg:w-88
                    xl:w-92
                  "
                >
                {/* ======================================================
                    IMAGE
                ====================================================== */}
                <Link
                  href={`/news#${post.slug}`}
                  tabIndex={isDuplicate ? -1 : undefined}
                  className="
                    relative
                    block
                    aspect-[0.86]
                    overflow-hidden
                    rounded-md
                    bg-surface
                  "
                >
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    loading="lazy"
                    sizes="
                      (max-width: 639px) 280px,
                      (max-width: 767px) 320px,
                      (max-width: 1023px) 336px,
                      368px
                    "
                    className="
                      object-cover
                      object-center
                    "
                  />

                  {/* Subtle overlay only — no image zoom */}
                  <span
                    aria-hidden
                    className="
                      absolute
                      inset-0
                      bg-black/0
                      transition-colors
                      duration-500
                      group-hover:bg-black/4
                    "
                  />

                  {/* CATEGORY */}
                  <span
                    className="
                      absolute
                      left-4
                      top-4
                      rounded-full
                      bg-canvas
                      px-4
                      py-2
                      font-display
                      text-[0.62rem]
                      font-semibold
                      uppercase
                      tracking-[0.08em]
                      text-accent
                      shadow-sm
                      sm:left-5
                      sm:top-5
                    "
                  >
                    {post.category}
                  </span>
                </Link>

                {/* ======================================================
                    CONTENT
                ====================================================== */}
                <div className="pt-5 sm:pt-6">
                  {/* META */}
                  <p
                    className="
                      flex
                      items-center
                      gap-3
                      text-caption
                      text-ink-light
                    "
                  >
                    <time dateTime={post.date}>{post.date}</time>

                    <span
                      aria-hidden
                      className="
                        size-1
                        shrink-0
                        rounded-full
                        bg-line
                      "
                    />

                    <span>{post.readTime}</span>
                  </p>

                  {/* TITLE */}
                  <h3
                    className="
                      mt-3
                      font-display
                      text-h5
                      leading-[1.15]
                    "
                  >
                    <Link
                      href={`/news#${post.slug}`}
                      tabIndex={isDuplicate ? -1 : undefined}
                      className="
                        transition-colors
                        duration-300
                        hover:text-primary-hover
                      "
                    >
                      {post.title}
                    </Link>
                  </h3>
                </div>
              </article>
              );
            })}
          </div>
        </div>

        {/* ================================================================
            BOTTOM LINE
        ================================================================ */}
        <div
          className="
            mt-12
            hidden
            items-center
            gap-6
            lg:flex
          "
        ></div>
      </Container>
    </section>
  );
}
