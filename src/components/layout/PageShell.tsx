import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { StructuredData } from "@/components/layout/StructuredData";
import { PageHero } from "@/components/sections/PageHero";
import { cn } from "@/lib/utils";
export interface PageShellProps {
  eyebrow: string;
  title: string;
  intro?: string;
  image: string;
  imageAlt: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

/**
 * Consistent frame for every inner page: SEO block, masthead, content and
 * footer. Keeps each route down to its own content.
 */
export function PageShell({
  eyebrow,
  title,
  intro,
  image,
  imageAlt,
  children,
  contentClassName,
}: PageShellProps) {
  return (
    <>
      <StructuredData />
      <SiteHeader />
      <main id="main">
        <PageHero
          eyebrow={eyebrow}
          title={title}
          intro={intro}
          image={image}
          imageAlt={imageAlt}
        />
        <div className={cn("bg-canvas", contentClassName)}>{children}</div>
      </main>
      <SiteFooter />
    </>
  );
}
