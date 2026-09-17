import Image from "next/image";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

export interface PageHeroProps {
  eyebrow: string;
  title: string;
  intro?: string;
  image: string;
  imageAlt: string;
  className?: string;
}

/**
 * Shared masthead for the inner pages: a darkened photographic plate with the
 * same white-pill header treatment as the homepage.
 */
export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  imageAlt,
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative isolate flex min-h-112 items-end overflow-hidden bg-accent pb-14 pt-37.5 sm:min-h-128 sm:pb-20 lg:min-h-144 lg:pb-24",
        className,
      )}
    >
      <div aria-hidden className="absolute inset-0 -z-20">
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-accent/55" />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-linear-to-t from-accent/70 to-transparent"
      />

      <Container>
        <Reveal amount={0.3}>
          <Eyebrow tone="canvas">{eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.08} className="mt-6 max-w-208" amount={0.3}>
          <h1 className="font-display text-h2 text-canvas">{title}</h1>
        </Reveal>
        {intro ? (
          <Reveal delay={0.16} className="mt-6 max-w-2xl" amount={0.3}>
            <p className="text-body-sm text-canvas/70">{intro}</p>
          </Reveal>
        ) : null}
      </Container>
    </section>
  );
}
