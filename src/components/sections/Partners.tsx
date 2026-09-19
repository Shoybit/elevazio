import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";

const marks = [
  {
    name: "Home Build Construction",
    image: "/images/clients/northline_logo.png",
  },
  {
    name: "Home & Garden",
    image: "/images/clients/elevon_logo.png",
  },
  {
    name: "Architecture",
    image: "/images/clients/urbana_logo.png",
  },
  {
    name: "Brick Company",
    image: "/images/clients/stonnerbridge_logo.png",
  },
  {
    name: "Construction",
    image: "/images/clients/nexora_logo.png",
  },
  {
    name: "Architect",
    image: "/images/clients/altura_logo.png",
  },
  {
    name: "Home Build Construction",
    image: "/images/clients/rivermont_logo.png",
  },
  {
    name: "Home & Garden",
    image: "/images/clients/lanewood_logo.png",
  }
];

export function Partners() {
  const marqueeItems = [...marks, ...marks];

  return (
    <section
      id="partners"
      aria-labelledby="partners-heading"
      className="relative overflow-hidden bg-surface-warm py-20 sm:py-28 lg:py-36"
    >
      {/* Top architectural divider */}
      <div
        aria-hidden
        className="mx-auto mb-14 h-px w-[calc(100%-3rem)] max-w-360 bg-ink/10 sm:mb-16 lg:mb-20"
      />

      <div className="mx-auto max-w-360 px-6 sm:px-8 lg:px-10">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <Reveal amount={0.4}>
            <p className="mb-5 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-ink-light">
              Our Partners
            </p>
          </Reveal>

          <Reveal delay={0.08} amount={0.35}>
            <h2
              id="partners-heading"
              className="font-display text-4xl leading-[0.95] tracking-[-0.04em] text-ink sm:text-5xl lg:text-6xl"
            >
              We&rsquo;re proud to partner
              <br className="hidden sm:block" /> with industry leaders.
            </h2>
          </Reveal>
        </div>

        {/* Logo marquee */}
        <Reveal
          delay={0.15}
          amount={0.2}
          className="mt-14 sm:mt-16 lg:mt-20"
        >
          <div className="group relative overflow-hidden">
            {/* Left fade */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 bg-linear-to-r from-surface-warm to-transparent sm:w-24"
            />

            {/* Right fade */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 bg-linear-to-l from-surface-warm to-transparent sm:w-24"
            />

            {/*
              The track is the logo list twice over. `translateX(-50%)` only
              lands back on the first copy if the trailing padding equals the
              gap, otherwise the loop restarts half a gap out of alignment and
              visibly jumps. `duration` is set inline rather than through a
              custom property: a `var()` referenced from a `@theme` token is
              resolved in that token's context, so a per-element
              `--marquee-duration` never reached the shorthand and every strip
              silently fell back to 30s.
            */}
            <ul
              className="
                flex w-max shrink-0 items-center
                gap-4 pr-4
                animate-marquee
                motion-reduce:animate-none
                group-hover:[animation-play-state:paused]
                group-focus-within:[animation-play-state:paused]
                sm:gap-5 sm:pr-5
              "
              style={{ animationDuration: "36s" }}
            >
              {marqueeItems.map((mark, index) => {
                const isDuplicate = index >= marks.length;

                return (
                  <li
                    key={`${mark.name}-${index}`}
                    aria-hidden={isDuplicate}
                    className="group/logo shrink-0"
                  >
                    <div
                      className="
                        relative flex
                        h-28 w-44
                        items-center justify-center
                        overflow-hidden
                        rounded-2xl
                        border border-ink/10
                        bg-white/70
                        px-7
                        transition-all
                        duration-500
                        ease-out-expo
                        hover:border-primary
                        hover:bg-primary
                        hover:shadow-[0_18px_50px_rgba(0,0,0,0.08)]
                        sm:h-32 sm:w-52
                        sm:px-8
                        lg:h-36 lg:w-56
                      "
                    >
                      {/* Subtle hover accent */}
                      <span
                        aria-hidden
                        className="
                          pointer-events-none
                          absolute -right-8 -top-8
                          size-20
                          rounded-full
                          bg-primary/20
                          opacity-0
                          transition-all
                          duration-500
                          ease-out-expo
                          group-hover/logo:scale-150
                          group-hover/logo:opacity-100
                        "
                      />

                      {/* Logo */}
                      <Image
                        src={mark.image}
                        alt={isDuplicate ? "" : mark.name}
                        width={220}
                        height={100}
                        sizes="(max-width: 639px) 176px, (max-width: 1023px) 208px, 224px"
                        className="
                          relative z-10
                          h-auto
                          max-h-18
                          w-auto
                          max-w-full
                          object-contain
                          grayscale
                          transition-all
                          duration-500
                          ease-out-expo
                          group-hover/logo:scale-[1.04]
                          group-hover/logo:grayscale-0
                        "
                      />

                      {/* Bottom lime line */}
                      <span
                        aria-hidden
                        className="
                          absolute bottom-0 left-1/2
                          h-0.5 w-0
                          -translate-x-1/2
                          bg-ink
                          transition-all
                          duration-500
                          ease-out-expo
                          group-hover/logo:w-1/3
                        "
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>

        {/* Bottom detail */}
        <div className="mt-10 flex items-center justify-center gap-3 sm:mt-12">
          <span aria-hidden className="h-px w-8 bg-ink/15" />
          <span aria-hidden className="size-1.5 rounded-full bg-primary" />
          <span aria-hidden className="h-px w-8 bg-ink/15" />
        </div>
      </div>
    </section>
  );
}