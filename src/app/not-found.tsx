import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex min-h-[70svh] items-center bg-accent pt-32">
        <Container className="flex flex-col items-start gap-6">
          <p className="font-display text-[6rem] font-bold leading-none text-primary sm:text-[10rem]">
            404
          </p>
          <h1 className="font-display text-h2 text-canvas">
            This page has been sold off-plan
          </h1>
          <p className="max-w-[34rem] text-body text-canvas/60">
            The address you requested doesn&rsquo;t exist. Head back to the
            homepage or talk to our team about what&rsquo;s coming next.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href="/" size="md">
              Back to homepage
            </Button>
            <Button href="/contact" variant="outline" size="md" className="border-canvas/30 text-canvas hover:border-primary">
              Contact us
            </Button>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
