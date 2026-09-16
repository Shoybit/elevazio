import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { footerColumns, legalLinks } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { BackToTop } from "@/components/layout/BackToTop";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ScrollTextReveal } from "@/components/ui/ScrollTextReveal";

const CTA_HEADING = "Your perfect home is closer than you think.";

const CTA_SUBHEAD =
  "Whether you’re discovering one of our signature homes or imagining something entirely your own, we bring your vision to life with purpose and distinction.";

const FOOTER_BLURB =
  "We create transformative spaces that inspire bold ideas, shape experiences, and stand the test of time.";

/* ============================================================================
   SITE FOOTER

   A server component. The only interactive part is `BackToTop`, split out as
   its own client island so the whole footer does not ship as client JS, and
   so the copyright year is resolved once on the server instead of risking a
   hydration mismatch at a year boundary.
   ============================================================================ */

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden">
      {/* ======================================================================
          FULL FOOTER BACKGROUND
      ====================================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          -z-20
        "
      >
        <Image
          src="/images/hero/bg_footer.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="
            object-cover
            object-center
          "
        />

        {/* Main dark overlay */}
        <div
          className="
            absolute
            inset-0
            bg-accent/40
          "
        />

        {/* Bottom cinematic darkening */}
        <div
          className="
            absolute
            inset-x-0
            bottom-0
            h-[55%]
            bg-linear-to-t
            from-black/55
            via-black/20
            to-transparent
          "
        />

        {/* Very subtle lime atmosphere */}
        <div
          className="
            absolute
            -bottom-40
            -right-40
            size-140
            rounded-full
            bg-primary/8
            blur-[120px]
          "
        />
      </div>

      {/* ======================================================================
          CTA SECTION
      ====================================================================== */}

      <section
        aria-labelledby="cta-heading"
        className="
          relative
          isolate
          flex
          min-h-168
          flex-col
          overflow-hidden
          bg-transparent
          pb-60
          pt-28
          sm:min-h-176
          sm:pb-68
          sm:pt-32
          lg:min-h-184
          lg:pb-72
          lg:pt-36
        "
      >
        {/* Ghosted brand */}
        <span
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-[7%]
            -z-10
            select-none
            text-center
            font-display
            text-[clamp(6rem,22vw,20rem)]
            font-bold
            leading-none
            tracking-tight
            text-white/10
          "
        >
          {siteConfig.name}
        </span>

        {/* CTA CONTENT */}
        <Container
          className="
            flex
            flex-1
            flex-col
            items-center
            justify-center
            text-center
          "
        >
          <Reveal amount={0.4}>
            <ScrollTextReveal
              text={CTA_HEADING}
              as="h2"
              id="cta-heading"
              className="
                max-w-[18ch]
                justify-center
                font-display
                text-h2
                text-white
              "
            />
          </Reveal>

          <Reveal
            delay={0.12}
            className="
              mt-6
              max-w-152
            "
            amount={0.3}
          >
            <p
              className="
                text-body-sm
                text-white/80
              "
            >
              {CTA_SUBHEAD}
            </p>
          </Reveal>
        </Container>

        {/* ====================================================================
            QUOTE BADGE
            Preserved but disabled as in your current version.
        ==================================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-30
            flex
            justify-center
            lg:bottom-34
          "
        >
          {/*
          <Link
            href="/contact"
            className="
              pointer-events-auto
              flex
              size-28
              flex-col
              items-center
              justify-center
              rounded-full
              bg-accent/90
              px-3
              text-center
              font-display
              text-body-sm
              font-semibold
              leading-tight
              text-white
              shadow-[0_24px_60px_-24px_rgba(0,0,0,0.65)]
              backdrop-blur-xl
              transition-all
              duration-500
              hover:bg-primary
              hover:text-accent
              sm:size-32
              sm:text-h6
            "
          >
            Get Your
            <br />
            Free
            <br />
            Quote
          </Link>
          */}
        </div>
      </section>

      {/* ======================================================================
          GLASS FOOTER CARD
      ====================================================================== */}

      <div
        className="
          relative
          z-10
          -mt-20
          pb-5
          lg:-mt-22
        "
      >
        <Container tone="shell">
          <div
            className="
              relative
              overflow-hidden
              rounded-footer
              border
              border-primary/30
              bg-black/30
              px-6
              pb-8
              pt-12
              shadow-[0_30px_100px_-30px_rgba(0,0,0,0.7)]
              backdrop-blur-2xl
              backdrop-saturate-150
              sm:px-10
              sm:pt-14
              lg:px-16
            "
          >
            {/* ==================================================================
                GLASS TOP EDGE
            ================================================================== */}

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                inset-x-0
                top-0
                h-px
                bg-linear-to-r
                from-transparent
                via-primary/60
                to-transparent
              "
            />

            {/* ==================================================================
                SOFT WHITE GLASS LIGHT
            ================================================================== */}

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                -left-32
                -top-32
                size-72
                rounded-full
                bg-white/8
                blur-3xl
              "
            />

            {/* ==================================================================
                SOFT LIME GLASS LIGHT
            ================================================================== */}

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                -bottom-40
                -right-32
                size-80
                rounded-full
                bg-primary/12
                blur-3xl
              "
            />

            {/* ==================================================================
                INNER GLASS SHEEN
            ================================================================== */}

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                inset-0
                bg-linear-to-br
                from-white/6
                via-transparent
                to-transparent
              "
            />

            {/* ==================================================================
                MAIN FOOTER GRID
            ================================================================== */}

            <div
              className="
                relative
                grid
                gap-12
                lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,1.1fr)]
              "
            >
              {/* =================================================================
                  BRAND
              ================================================================= */}

              <div>
                <Link
                  href="/"
                  aria-label={`${siteConfig.name} — home`}
                  className="inline-block"
                >
                  <Image
                    src="/images/brand/elevazio-wordmark-inverse.png"
                    alt={siteConfig.name}
                    width={180}
                    height={48}
                    sizes="163px"
                    className="h-10 w-auto object-contain"
                  />
                </Link>

                <p
                  className="
                    mt-6
                    max-w-76
                    text-body-sm
                    text-white/80
                  "
                >
                  {FOOTER_BLURB}
                </p>
              </div>

              {/* =================================================================
                  NAVIGATION
              ================================================================= */}

              <div
                className="
                  grid
                  gap-10
                  sm:grid-cols-2
                "
              >
                {footerColumns.map((column) => (
                  <nav key={column.title} aria-label={column.title}>
                    <h2
                      className="
                        mb-5
                        font-display
                        text-colhead
                        text-white
                      "
                    >
                      {column.title}
                    </h2>

                    <ul
                      className="
                        flex
                        flex-col
                        gap-3.5
                      "
                    >
                      {column.links.map((link) => (
                        <li key={link.label}>
                          <Link
                            href={link.href}
                            className="
                              group/link
                              inline-flex
                              items-center
                              gap-1
                              font-display
                              text-body-sm
                              font-semibold
                              text-white/65
                              transition-colors
                              duration-300
                              hover:text-primary
                            "
                          >
                            {link.label}

                            <ArrowUpRight
                              aria-hidden="true"
                              className="
                                size-3.5
                                -translate-x-1
                                opacity-0
                                transition-all
                                duration-300
                                ease-out-expo
                                group-hover/link:translate-x-0
                                group-hover/link:opacity-100
                              "
                            />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
                ))}
              </div>

              {/* =================================================================
                  CONTACT
              ================================================================= */}

              <div
                className="
                  flex
                  flex-col
                  gap-4
                  lg:items-end
                  lg:text-right
                "
              >
                <a
                  href={siteConfig.phoneHref}
                  className="
                    font-display
                    text-h5
                    text-white
                    decoration-primary
                    decoration-2
                    underline-offset-8
                    transition-colors
                    duration-300
                    hover:text-primary
                  "
                >
                  {siteConfig.phone}
                </a>

                <a
                  href={`mailto:${siteConfig.email}`}
                  className="
                    break-all
                    font-display
                    text-h5
                    text-white
                    decoration-primary
                    decoration-2
                    underline-offset-8
                    transition-colors
                    duration-300
                    hover:text-primary
                  "
                >
                  {siteConfig.email}
                </a>

                <ul
                  className="
                    mt-3
                    flex
                    flex-wrap
                    items-center
                    gap-2
                    text-caption
                    text-white/50
                    lg:justify-end
                  "
                >
                  {siteConfig.social.map((item, index) => (
                    <li
                      key={item.label}
                      className="
                        flex
                        items-center
                        gap-2
                      "
                    >
                      {index > 0 ? (
                        <span aria-hidden="true" className="text-white/25">
                          &middot;
                        </span>
                      ) : null}

                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="
                          transition-colors
                          duration-300
                          hover:text-primary
                        "
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ==================================================================
                BOTTOM FOOTER BAR
            ================================================================== */}

            <div
              className="
                relative
                mt-12
                flex
                flex-col-reverse
                items-center
                gap-5
                border-t
                border-white/15
                pt-7
                sm:flex-row
                sm:justify-between
              "
            >
              <p
                className="
                  text-caption
                  text-white/50
                "
              >
                &copy; {year} {siteConfig.name}. All rights reserved.
              </p>

              <ul
                className="
                  flex
                  flex-wrap
                  items-center
                  justify-center
                  gap-x-6
                  gap-y-2
                "
              >
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="
                        text-caption
                        text-white/50
                        underline-offset-4
                        transition-colors
                        duration-300
                        hover:text-primary
                        hover:underline
                      "
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </div>

      {/* ======================================================================
          BACK TO TOP
      ====================================================================== */}

      <BackToTop />
    </footer>
  );
}
