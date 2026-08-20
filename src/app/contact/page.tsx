import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact — FARMILY",
  description:
    "Whether you're a distributor curious about piloting FARMILY, or an investor who wants to learn more — we'd like to hear from you.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Let's talk.">
        Whether you&apos;re a distributor curious about piloting FARMILY, or
        an investor who wants to learn more — we&apos;d like to hear from
        you.
      </PageHero>

      <section>
        <Container className="grid gap-14 py-16 sm:py-20 md:grid-cols-[2fr_1fr] md:gap-20">
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal delay={100} className="text-sm">
            <p className="font-display text-lg text-ink">Prefer email?</p>
            <a
              href="mailto:benjamin.omayebu@farmilytechnologies.com"
              className="mt-2 inline-block text-teal-deep underline decoration-teal-deep/40 underline-offset-4 transition-colors hover:text-teal"
            >
              benjamin.omayebu@farmilytechnologies.com
            </a>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
