"use client";

import Image from "next/image";
import { useId, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";

import { services } from "@/config/services";
import { siteConfig } from "@/config/site";

import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ScrollTextReveal } from "@/components/ui/ScrollTextReveal";

import { cn } from "@/lib/utils";

const HEADING = "Let's build something remarkable.";

type Status = "idle" | "sent";

/* ==========================================================================
   FIELD
========================================================================== */

const fieldClass = `
  h-14
  w-full
  border-0
  border-b
  border-black/20
  bg-transparent
  px-0
  text-body-sm
  text-accent
  outline-none
  transition-colors
  duration-300
  placeholder:text-black/30
  focus:border-primary
  disabled:opacity-60
  sm:h-15
`;

/* ==========================================================================
   CONTACT
========================================================================== */

export function Contact() {
  const formId = useId();
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sent");
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="
        relative
        isolate
        overflow-hidden
        bg-accent
        py-16
        sm:py-24
        lg:py-32
      "
    >
      {/* ====================================================================
          BACKGROUND IMAGE
      ==================================================================== */}

      <div aria-hidden className="absolute inset-0 -z-20">
        <Image
          src="/images/hero/contact_bg.jpg"
          alt=""
          fill
          loading="lazy"
          sizes="100vw"
          className="
            object-cover
            object-center
          "
        />
      </div>

      {/* ====================================================================
          BACKGROUND OVERLAY
      ==================================================================== */}

      <div
        aria-hidden
        className="
          absolute
          inset-0
          -z-10
          bg-accent/45
        "
      />

      <div
        aria-hidden
        className="
          pointer-events-none
          absolute
          inset-0
          -z-10
          bg-linear-to-r
          from-accent/95
          via-accent/75
          to-accent/35
        "
      />

      {/* ====================================================================
          SUBTLE ARCHITECTURAL FRAME
      ==================================================================== */}

      <div
        aria-hidden
        className="
          pointer-events-none
          absolute
          bottom-0
          left-[3.5%]
          top-0
          hidden
          w-px
          bg-white/10
          lg:block
        "
      />

      <div
        aria-hidden
        className="
          pointer-events-none
          absolute
          bottom-0
          right-[3.5%]
          top-0
          hidden
          w-px
          bg-white/10
          lg:block
        "
      />

      {/* ====================================================================
          CONTENT
      ==================================================================== */}

      <Container className="relative">
        <div
          className="
            grid
            grid-cols-1
            gap-12
            lg:grid-cols-[0.82fr_1.18fr]
            lg:items-center
            lg:gap-16
            xl:grid-cols-[0.78fr_1.22fr]
            xl:gap-20
          "
        >
          {/* ================================================================
              LEFT SIDE
          ================================================================ */}

          <div
            className="
              relative
              flex
              min-h-120
              flex-col
              justify-between
              lg:min-h-145
            "
          >
            {/* --------------------------------------------------------------
                CONTACT LABEL
            -------------------------------------------------------------- */}

            <Reveal amount={0.3}>
              <div className="flex items-center gap-4">
                <span
                  aria-hidden
                  className="
                    h-px
                    w-22
                    bg-primary
                    sm:w-24
                  "
                />

                <span
                  className="
                    text-[0.6rem]
                    font-medium
                    uppercase
                    tracking-[0.28em]
                    text-white
                  "
                >
                  Contact
                </span>                
              </div>
            </Reveal>

            {/* --------------------------------------------------------------
                MAIN HEADING
            -------------------------------------------------------------- */}

            <div className="mt-12 lg:mt-0">
              <Reveal delay={0.08} amount={0.25} className="max-w-145">
                <ScrollTextReveal
                  text={HEADING}
                  as="h2"
                  id="contact-heading"
                  className="
                    font-display
                    text-[clamp(3.25rem,6.1vw,6.8rem)]
                    text-primary
                    leading-[0.88]
                    tracking-[-0.055em]
                  "
                />
              </Reveal>

              <Reveal delay={0.14} amount={0.3} className="mt-9 max-w-105">
                <p
                  className="
                    text-sm
                    leading-7
                    text-white/65
                    sm:text-base
                  "
                >
                  Have a project in mind? Tell us what you&apos;re building,
                  transforming, or imagining. We&apos;ll help turn the idea into
                  something considered, functional, and distinctive.
                </p>
              </Reveal>
            </div>

            {/* --------------------------------------------------------------
                CONTACT DETAILS
            -------------------------------------------------------------- */}

            <Reveal delay={0.2} amount={0.25} className="mt-12 lg:mt-0">
              <div
                className="
                  grid
                  max-w-120
                  grid-cols-2
                  border-t
                  border-white/25
                  pt-6
                "
              >
                <div>
                  <p
                    className="
                      text-[0.56rem]
                      font-semibold
                      uppercase
                      tracking-[0.22em]
                      text-white/50
                    "
                  >
                    Studio
                  </p>

                  <p className="mt-3 text-sm text-white">TORONTO · CANADA</p>
                </div>

                <div>
                  <p
                    className="
                      text-[0.56rem]
                      font-semibold
                      uppercase
                      tracking-[0.22em]
                      text-white/50
                    "
                  >
                    Email
                  </p>

                  <a
                    href="mailto:hello@elevazio.com"
                    className="
                      mt-3
                      inline-block
                      text-sm
                      text-white
                      transition-colors
                      duration-300
                      hover:text-primary
                    "
                  >
                    hello@elevazio.com
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          {/* ================================================================
              RIGHT FORM
          ================================================================ */}

          <Reveal delay={0.1} amount={0.2} className="relative">
            {/* --------------------------------------------------------------
                LIME BACK SHAPE
            -------------------------------------------------------------- */}

            <div
              aria-hidden
              className="
                absolute
                -right-4
                -top-4
                h-28
                w-1/3
                bg-primary
                sm:-right-5
                sm:-top-5
                sm:h-32
              "
              style={{
                clipPath: "polygon(25% 0, 100% 0, 100% 100%, 0 65%)",
              }}
            />

            {/* --------------------------------------------------------------
                FORM PANEL
            -------------------------------------------------------------- */}

            <div
              className="
                relative
                overflow-hidden
                bg-canvas
                px-7
                pb-9
                pt-8
                text-accent
                sm:px-10
                sm:pb-10
                sm:pt-10
                lg:px-12
                lg:pb-11
                lg:pt-10
                xl:px-14
                xl:pb-12
              "
              style={{
                clipPath: "polygon(0 0, 100% 0, 100% 92%, 96% 100%, 0 100%)",
              }}
            >
              {/* ------------------------------------------------------------
                  FORM HEADER
              ------------------------------------------------------------ */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-b
                  border-black/15
                  pb-6
                "
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="
                      h-1.5
                      w-1.5
                      rounded-full
                      bg-primary
                    "
                  />

                  <span
                    className="
                      text-[0.6rem]
                      font-semibold
                      uppercase
                      tracking-[0.24em]
                    "
                  >
                    Quick inquiry
                  </span>
                </div>

                <span
                  className="
                    text-[0.55rem]
                    font-medium
                    uppercase
                    tracking-[0.2em]
                    text-black/35
                  "
                >
                  ELEVAZIO
                </span>
              </div>

              {/* ------------------------------------------------------------
                  FORM
              ------------------------------------------------------------ */}

              {/* ==========================================================
                  FORM
              ========================================================== */}

              <form onSubmit={handleSubmit} className="relative mt-9">
                <fieldset disabled={status === "sent"} className="contents">
                  {/* ========================================================
                      TOP FIELDS
                  ======================================================== */}

                  <div
                    className="
                      grid
                      gap-x-10
                      gap-y-7
                      sm:grid-cols-2
                    "
                  >
                    <Field
                      id={`${formId}-name`}
                      name="name"
                      label="Your name"
                      placeholder="John Doe"
                      autoComplete="name"
                      required
                      disabled={status === "sent"}
                    />

                    <Field
                      id={`${formId}-email`}
                      name="email"
                      type="email"
                      label="Email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                      disabled={status === "sent"}
                    />

                    <Field
                      id={`${formId}-phone`}
                      name="phone"
                      type="tel"
                      label="Phone number"
                      placeholder="+1 (800) 555-1234"
                      autoComplete="tel"
                      required
                      disabled={status === "sent"}
                    />

                    {/* ------------------------------------------------------
                        SERVICE SELECT
                    ------------------------------------------------------ */}

                    <div className="relative">
                      <label
                        htmlFor={`${formId}-service`}
                        className="
                          block
                          text-[0.58rem]
                          font-semibold
                          uppercase
                          tracking-[0.18em]
                          text-black/50
                        "
                      >
                        Project type
                      </label>

                      <select
                        id={`${formId}-service`}
                        name="service"
                        disabled={status === "sent"}
                        defaultValue=""
                        required
                        className={cn(
                          fieldClass,
                          "appearance-none pr-10",
                          "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 12 8%22 fill=%22none%22><path d=%22M1 1l5 5 5-5%22 stroke=%22%238A8A8A%22 stroke-width=%221.6%22/></svg>')]",
                          "bg-size-[0.75rem]",
                          "bg-position-[right_0.25rem_center]",
                          "bg-no-repeat",
                        )}
                      >
                        <option value="" disabled>
                          Select a service
                        </option>

                        {services.map((service) => (
                          <option key={service.id} value={service.id}>
                            {service.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* ========================================================
                      MESSAGE
                  ======================================================== */}

                  <div className="mt-8">
                    <label
                      htmlFor={`${formId}-message`}
                      className="
                        block
                        text-[0.58rem]
                        font-semibold
                        uppercase
                        tracking-[0.18em]
                        text-black/50
                      "
                    >
                      Tell us about your project
                    </label>

                    <textarea
                      id={`${formId}-message`}
                      name="message"
                      rows={3}
                      disabled={status === "sent"}
                      placeholder="A few words about your project..."
                      className="
                        mt-3
                        min-h-20
                        w-full
                        resize-none
                        border-0
                        border-b
                        border-black/20
                        bg-transparent
                        px-0
                        pb-4
                        text-body-sm
                        text-accent
                        outline-none
                        transition-colors
                        duration-300
                        placeholder:text-black/30
                        focus:border-primary
                        disabled:opacity-60
                      "
                    />
                  </div>

                  {/* ========================================================
                      BOTTOM
                  ======================================================== */}

                  <div
                    className="
                      mt-8
                      flex
                      flex-col
                      items-center
                      gap-5
                      sm:flex-row
                      sm:justify-end
                    "
                  >
                    <p
                      className="
                        order-2
                        text-body-sm
                        text-ink
                        sm:order-1
                        sm:mr-auto
                        sm:max-w-88
                      "
                    >
                      We&apos;re looking forward to connecting with you!
                      <br />
                      Required fields are marked <span aria-hidden>*</span>
                      <span className="sr-only">with an asterisk</span>
                    </p>

                    {/* ======================================================
                        EXISTING BUTTON — DO NOT CHANGE
                    ====================================================== */}

                    <button
                      type="submit"
                      disabled={status === "sent"}
                      className="group/submit order-1 relative inline-flex h-13 w-full items-center rounded-full bg-primary pl-8 pr-16 font-display text-base font-semibold text-accent transition-[background-color,transform] duration-500 ease-out-expo hover:-translate-y-0.5 hover:bg-primary-hover disabled:translate-y-0 disabled:cursor-not-allowed sm:order-2 sm:w-auto"
                    >
                      {status === "sent" ? (
                        <>
                          <Check aria-hidden className="size-4" />
                          Request received
                        </>
                      ) : (
                        "Get A Call Back"
                      )}

                      <span
                        aria-hidden
                        className="absolute right-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full bg-canvas text-accent"
                      >
                        {status === "sent" ? (
                          <Check className="size-4" />
                        ) : (
                          <>
                            <ArrowRight className="absolute size-4 translate-x-[-180%] transition-transform duration-500 ease-out-expo group-hover/submit:translate-x-0" />

                            <ArrowRight className="size-4 translate-x-0 transition-transform duration-500 ease-out-expo group-hover/submit:translate-x-[180%]" />
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                </fieldset>

                {/* ==========================================================
                    SUCCESS MESSAGE
                ========================================================== */}

                <AnimatePresence>
                  {status === "sent" ? (
                    <motion.p
                      role="status"
                      initial={{
                        opacity: 0,
                        y: 8,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                      }}
                      className="
                        mt-6
                        rounded-lg
                        bg-surface
                        px-6
                        py-4
                        text-center
                        text-body-sm
                        text-ink
                      "
                    >
                      Thank you — a specialist will call you back within one
                      business day. For anything urgent, ring{" "}
                      <a
                        href={siteConfig.phoneHref}
                        className="
                          font-semibold
                          text-accent
                          underline
                          decoration-primary
                          decoration-2
                          underline-offset-4
                        "
                      >
                        {siteConfig.phone}
                      </a>
                      .
                    </motion.p>
                  ) : null}
                </AnimatePresence>
              </form>

              {/* ------------------------------------------------------------
                  BOTTOM LIME EDGE
              ------------------------------------------------------------ */}

              <div
                aria-hidden
                className="
                  absolute
                  bottom-0
                  left-0
                  h-1
                  w-[45%]
                  bg-primary
                "
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

/* ==========================================================================
   FIELD COMPONENT
========================================================================== */

interface FieldProps {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;
}

function Field({
  id,
  name,
  label,
  placeholder,
  type = "text",
  autoComplete,
  required,
  disabled,
}: FieldProps) {
  return (
    <div className="relative">
      <label
        htmlFor={id}
        className="
          block
          text-[0.58rem]
          font-semibold
          uppercase
          tracking-[0.18em]
          text-black/50
        "
      >
        {label}
        {required ? " *" : ""}
      </label>

      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        disabled={disabled}
        className={cn(fieldClass, "mt-1")}
      />
    </div>
  );
}
