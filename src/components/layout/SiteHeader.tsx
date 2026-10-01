"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { navigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Brand } from "@/components/ui/Brand";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

/**
 * Desktop navigation item.
 *
 * The active/hover cue is a hairline that wipes in from the left rather than a
 * filled pill, which keeps the bar reading as one continuous plane.
 */
function DesktopNavItem({
  item,
  isActive,
}: {
  item: (typeof navigation)[number];
  isActive: boolean;
}) {
  return (
    <li>
      <Link
        href={item.href}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "group relative flex items-center px-4 py-6 font-display text-[0.9375rem] font-medium tracking-[-0.01em] transition-colors duration-300 hover:text-canvas xl:px-5",
          isActive ? "text-canvas" : "text-canvas/70",
        )}
      >
        {item.label}
        <span
          aria-hidden
          className={cn(
            "absolute bottom-4.5 left-4 h-px bg-primary transition-[width] duration-500 ease-out-expo xl:left-5",
            isActive
              ? "w-[calc(100%-2rem)] xl:w-[calc(100%-2.5rem)]"
              : "w-0 group-hover:w-[calc(100%-2rem)] xl:group-hover:w-[calc(100%-2.5rem)]",
          )}
        />
      </Link>
    </li>
  );
}

/** Full-screen mobile navigation with focus management. */
function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const items = navigation.filter(
    (item) => !(item.href === "/" && pathname === "/"),
  );

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { body } = document;
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    const previousPadding = body.style.paddingRight;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";
    if (scrollBarWidth > 0) body.style.paddingRight = `${scrollBarWidth}px`;

    const focusables = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((el) => el.offsetParent !== null);

    const focusTimer = window.setTimeout(() => focusables()[0]?.focus(), 60);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const focusableItems = focusables();
      if (focusableItems.length === 0) return;
      const first = focusableItems[0];
      const last = focusableItems[focusableItems.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
      // Focus is trapped while the dialog is open, so it is still inside the
      // panel at this point (and stays there through the exit animation).
      // Restoring unconditionally is what hands focus back to the trigger; the
      // `isConnected` guard only skips the case where the trigger itself is
      // gone, which would throw.
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={panelRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-90 flex flex-col overflow-y-auto bg-accent text-canvas lg:hidden"
        >
          <div className="flex items-center justify-between px-5 py-5">
            <Link
              href="/"
              onClick={onClose}
              className="relative z-10"
              aria-label={`${siteConfig.name} — home`}
            >
              <Brand variant="light" className="h-6" />
            </Link>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation menu"
              className="relative z-10 flex size-10 items-center justify-center rounded-full border border-canvas/20 text-canvas transition-colors duration-300 hover:border-primary hover:text-primary"
            >
              <X aria-hidden className="size-4.5" />
            </button>
          </div>

          <nav aria-label="Mobile" className="flex-1 px-5 pt-4">
            <ul className="flex flex-col">
              {items.map((item, index) => (
                <motion.li
                  key={item.label}
                  data-motion-transform=""
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.18 + index * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="border-b border-canvas/10"
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className="flex items-center justify-between py-5 font-display text-[1.75rem] font-bold leading-none tracking-tight text-canvas"
                  >
                    {item.label}
                    <ArrowUpRight aria-hidden className="size-5 text-primary" />
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>

          <div className="mt-10 px-5 pb-10">
            <a
              href={siteConfig.phoneHref}
              className="block font-display text-2xl font-bold text-primary"
            >
              {siteConfig.phone}
            </a>
            {/* The panel is `bg-accent` (black), so the email needs a
                light-on-dark tone. `text-ink-light` is tuned for the light
                surfaces and would sit at roughly 3.7:1 here. */}
            <a
              href={`mailto:${siteConfig.email}`}
              className="mt-1 block text-canvas/60"
            >
              {siteConfig.email}
            </a>
            <Button
              href="/contact"
              onClick={onClose}
              className="mt-7 w-full"
              size="md"
            >
              Get In Touch
            </Button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [route, setRoute] = useState<string | null>(null);
  const pathname = usePathname();

  // Stable identity, so `MobileMenu`'s scroll-lock / focus-trap effect is not
  // torn down and rebuilt on every unrelated header render.
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const openMenu = useCallback(() => setMenuOpen(true), []);

  // Derive state from the route instead of syncing it in an effect: store the
  // rendered route and only close the menu once it actually changes.
  if (route !== pathname) {
    setRoute(pathname);
    if (menuOpen) setMenuOpen(false);
  }

  // `Home` is omitted on the landing page, where it would link to the URL the
  // visitor is already on.
  const items = navigation.filter(
    (item) => !(item.href === "/" && pathname === "/"),
  );

  return (
    <header className="absolute inset-x-0 top-0 z-80">
      <Container tone="shell" className="pt-4 lg:pt-6">
        <div className="flex h-14 items-center justify-between gap-2 rounded-full border border-canvas/12 bg-accent/45 pl-4 pr-1.5 backdrop-blur-md lg:h-18 lg:gap-4 lg:pl-6 lg:pr-2">
          <div className="flex min-w-0 flex-1 items-center justify-between gap-2 lg:flex-none">
            <Link
              href="/"
              aria-label={`${siteConfig.name} — home`}
              className="flex shrink-0 items-center gap-5"
            >
              <Brand variant="light" priority className="h-5.5 lg:h-8" />
              <span
                aria-hidden
                className="hidden h-7 w-px bg-canvas/15 lg:block"
              />
            </Link>

            <button
              type="button"
              onClick={openMenu}
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-accent transition-colors duration-300 hover:bg-primary-hover lg:hidden"
            >
              <Menu aria-hidden className="size-4.5" />
            </button>
          </div>

          <nav
            aria-label="Primary"
            className="hidden lg:flex lg:items-center"
          >
            <ul className="-ml-4 flex items-center xl:-ml-3">
              {items.map((item) => (
                <DesktopNavItem
                  key={item.label}
                  item={item}
                  isActive={pathname === item.href}
                />
              ))}
            </ul>
          </nav>

          <div className="hidden shrink-0 items-center gap-5 pl-2 xl:flex">
            <span className="font-display text-[0.8125rem] font-medium text-canvas/45">
              Call us:
            </span>
            <a
              href={siteConfig.phoneHref}
              className="relative font-display text-[0.9375rem] font-medium text-canvas/85 transition-colors duration-300 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-[width] after:duration-500 hover:text-canvas hover:after:w-full"
            >
              {siteConfig.phone}
            </a>
          </div>

          <div className="hidden shrink-0 lg:block">
            <Button
              href="/contact"
              size="sm"
              icon
              iconTone="bg-accent text-primary"
              className="mr-0.5"
            >
              Get In Touch
            </Button>
          </div>
        </div>
      </Container>

      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </header>
  );
}
