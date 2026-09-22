import type { Metadata } from "next";
import { Mail, MapPin, Phone, ArrowUpRight } from "lucide-react";

import { PageShell } from "@/components/layout/PageShell";
import { Contact } from "@/components/sections/Contact";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to an Elevazio specialist about residential, commercial or mixed-use development. Call, email or send an enquiry.",
  alternates: { canonical: "/contact" },
};

const channels = [
  {
    icon: Phone,
    label: "Call us",
    value: siteConfig.phone,
    href: siteConfig.phoneHref,
  },
  {
    icon: Mail,
    label: "Email us",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
  },
  {
    icon: MapPin,
    label: "Head office",
    value: `${siteConfig.address.street}, ${siteConfig.address.city}, ${siteConfig.address.region} ${siteConfig.address.postalCode}`,
    href: null,
  },
];

const officeHours = [
  {
    term: "Monday – Friday",
    detail: "08:30 – 18:00",
  },
  {
    term: "Saturday",
    detail: "10:00 – 14:00",
  },
  {
    term: "Sunday",
    detail: "Site visits by appointment",
  },
];

export default function ContactPage() {
  return (
    <PageShell
      eyebrow="quick enquiry"
      title="Let’s talk about your site, budget and timeline"
      intro="Every enquiry is read by a development lead, not a form queue. Expect a reply within one business day."
      image="/images/hero/contact_bg.jpg"
      imageAlt="Elevazio office and team"
    >
      <section className="overflow-x-clip py-15 sm:py-25 lg:py-37.5">
        <Container>
          {/* Contact channels */}
          <div className="grid gap-5 md:grid-cols-3 lg:gap-7.5">
            {channels.map((channel, index) => {
              const Icon = channel.icon;

              const content = (
                <>
                  {/* Icon */}
                  <div
                    className="
                      flex size-14 items-center justify-center
                      rounded-full
                      bg-primary-soft
                      text-accent
                      transition-all
                      duration-500
                      ease-out-expo
                      group-hover:bg-primary
                      group-hover:text-accent
                    "
                  >
                    <Icon
                      aria-hidden
                      className="size-5.5"
                      strokeWidth={1.5}
                    />
                  </div>

                  {/* Label */}
                  <p className="mt-7 font-display text-caption font-semibold uppercase tracking-[0.08em] text-ink-light">
                    {channel.label}
                  </p>

                  {/* Value */}
                  <p
                    className="
                      mt-2
                      wrap-break-word
                      font-display
                      text-h6
                      leading-tight
                      text-accent
                      transition-colors
                      duration-300
                      group-hover:text-primary-hover
                    "
                  >
                    {channel.value}
                  </p>

                  {/* Arrow */}
                  {channel.href && (
                    <span
                      className="
                        absolute
                        bottom-7
                        right-7
                        flex size-10
                        items-center justify-center
                        rounded-full
                        border border-line
                        text-accent
                        transition-all
                        duration-500
                        ease-out-expo
                        group-hover:border-primary
                        group-hover:bg-primary
                        group-hover:rotate-45
                        sm:bottom-9
                        sm:right-9
                      "
                    >
                      <ArrowUpRight
                        aria-hidden
                        className="size-4"
                      />
                    </span>
                  )}
                </>
              );

              return (
                <Reveal
                  as="article"
                  key={channel.label}
                  delay={index * 0.08}
                  amount={0.3}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-xl
                    border
                    border-line
                    bg-canvas
                    p-7
                    transition-[transform,box-shadow,border-color]
                    duration-700
                    ease-out-expo
                    hover:-translate-y-1
                    hover:border-primary/40
                    hover:shadow-[0_30px_70px_-45px_rgba(0,0,0,0.55)]
                    sm:p-9
                  "
                >
                  {/* Subtle hover surface */}
                  <span
                    aria-hidden
                    className="
                      pointer-events-none
                      absolute
                      -right-24
                      -top-24
                      size-48
                      rounded-full
                      bg-primary/0
                      blur-3xl
                      transition-all
                      duration-700
                      ease-out-expo
                      group-hover:bg-primary/12
                    "
                  />

                  {channel.href ? (
                    <a
                      href={channel.href}
                      className="relative block"
                      aria-label={`${channel.label}: ${channel.value}`}
                    >
                      {content}
                    </a>
                  ) : (
                    <div className="relative">{content}</div>
                  )}
                </Reveal>
              );
            })}
          </div>

          {/* Office hours */}
          <Reveal
            delay={0.1}
            amount={0.3}
            className="mt-20 lg:mt-28"
          >
            <div className="grid gap-8 lg:grid-cols-[0.7fr_1.8fr] lg:gap-16">
              <div>
                <Eyebrow>office hours</Eyebrow>

                <p className="mt-6 max-w-sm text-body-sm leading-relaxed text-ink-light">
                  Our team is available throughout the week for development
                  enquiries, project discussions and scheduled site visits.
                </p>
              </div>

              <dl className="grid gap-0 border-t border-line sm:grid-cols-3">
                {officeHours.map((row, index) => (
                  <div
                    key={row.term}
                    className="
                      border-b
                      border-line
                      py-6
                      sm:border-b-0
                      sm:border-r
                      sm:px-6
                      sm:first:pl-0
                      sm:last:border-r-0
                      sm:last:pr-0
                    "
                  >
                    <span className="mb-4 block font-display text-caption font-semibold uppercase tracking-[0.08em] text-ink-light">
                      0{index + 1}
                    </span>

                    <dt className="font-display text-h6 leading-[1.2]">
                      {row.term}
                    </dt>

                    <dd className="mt-2 text-body-sm text-ink-light">
                      {row.detail}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Main enquiry form */}
      <Contact />
    </PageShell>
  );
}