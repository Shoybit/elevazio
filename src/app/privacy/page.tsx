import type { Metadata } from "next";
import { Mail, ShieldCheck } from "lucide-react";

import { PageShell } from "@/components/layout/PageShell";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Elevazio collects, uses and protects personal information submitted through this website.",
  alternates: { canonical: "/privacy" },
};

const sections = [
  {
    number: "01",
    heading: "What we collect",
    body: [
      "When you submit an enquiry we record the name, email address, phone number and the service you are interested in. Our newsletter form records an email address only.",
      "We also collect anonymous, aggregated usage statistics such as which pages are visited and roughly where visitors are located. These statistics cannot be traced back to an individual.",
    ],
  },
  {
    number: "02",
    heading: "Why we collect it",
    body: [
      "Enquiry details are used solely to respond to your request, prepare a quotation and — where you have asked for it — send the monthly briefing. We do not sell your data, and we do not share it with advertisers.",
    ],
  },
  {
    number: "03",
    heading: "How long we keep it",
    body: [
      "Enquiry records are retained for 24 months from the last interaction so we can pick up a conversation where it left off. Newsletter subscriptions are kept until you unsubscribe, which you can do from any email we send.",
    ],
  },
  {
    number: "04",
    heading: "Your rights",
    body: [
      `You can ask us at any time for a copy of the information we hold about you, ask us to correct it, or ask us to delete it. Write to ${siteConfig.email} and we will respond within 30 days.`,
      "If you are in the EEA or UK you also have the right to complain to your local supervisory authority.",
    ],
  },
  {
    number: "05",
    heading: "Cookies",
    body: [
      "This site sets no advertising or third-party tracking cookies. A single first-party preference is stored if you dismiss the privacy notice, and nothing else is persisted in the browser.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <PageShell
      eyebrow="legal"
      title="Privacy policy"
      intro={`Last updated 1 March 2025. This policy explains how ${siteConfig.legalName} handles information submitted through this website.`}
      image="/images/blog/blog_08.jpg"
      imageAlt="Elevazio development site"
    >
      <section className="py-15 sm:py-25 lg:py-37.5">
        <Container>
          {/* Introduction */}
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.5fr)] lg:gap-20">
            <Reveal amount={0.4}>
              <Eyebrow>the detail</Eyebrow>
            </Reveal>

            <Reveal delay={0.08} amount={0.3}>
              <div className="flex max-w-3xl items-start gap-5">
                <span
                  className="
                    hidden size-14 shrink-0 items-center justify-center rounded-full bg-primary-soft text-accent sm:flex"
                >
                  <ShieldCheck
                    aria-hidden
                    className="size-6"
                    strokeWidth={1.5}
                  />
                </span>

                <p className="font-display text-h4 leading-[1.08] text-accent">
                  Your information should be handled with the same care we
                  bring to every project.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Privacy sections */}
          <div className="mt-16 border-t border-line lg:mt-24">
            {sections.map((section, index) => (
              <Reveal
                key={section.heading}
                delay={index * 0.04}
                amount={0.2}
              >
                <article
                  className="grid gap-6 border-b border-line py-10 sm:py-12 lg:grid-cols-[8rem_minmax(0,1fr)] lg:gap-10 lg:py-14"
                >
                  {/* Number */}
                  <div className="font-display text-caption font-semibold uppercase tracking-[0.12em] text-ink-light">
                    {section.number}
                  </div>

                  {/* Content */}
                  <div className="max-w-3xl">
                    <h2 className="font-display text-h4 leading-[1.08] text-accent">
                      {section.heading}
                    </h2>

                    <div className="mt-5 space-y-4">
                      {section.body.map((paragraph, paragraphIndex) => (
                        <p
                          key={`${section.heading}-${paragraphIndex}`}
                          className="text-body leading-relaxed text-ink-light"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          {/* Privacy contact */}
          <Reveal
            delay={0.1}
            amount={0.3}
            className="
              mt-12 overflow-hidden rounded-xl border border-line bg-surface-warm p-7 sm:p-9 lg:flex
              lg:items-center lg:justify-between lg:gap-12
            "
          >
            <div className="flex items-start gap-5">
              <span
                className="
                  flex size-12 shrink-0 items-center justify-center
                  rounded-full bg-primary text-accent
                "
              >
                <Mail
                  aria-hidden
                  className="size-5"
                  strokeWidth={1.5}
                />
              </span>

              <div>
                <p className="font-display text-body-sm font-semibold text-accent">
                  Questions about your information?
                </p>

                <p className="mt-1 max-w-xl text-body-sm leading-relaxed text-ink-light">
                  Contact us if you would like to request access, correction or
                  deletion of the information we hold about you.
                </p>
              </div>
            </div>

            <a
              href={`mailto:${siteConfig.email}`}
              className="mt-6 inline-flex shrink-0 items-center font-display text-caption font-semibold
                uppercase tracking-[0.08em] text-accent underline decoration-primary decoration-2
                underline-offset-4 transition-colors duration-300 hover:text-primary lg:mt-0
              "
            >
              {siteConfig.email}
            </a>
          </Reveal>
        </Container>
      </section>
    </PageShell>
  );
}