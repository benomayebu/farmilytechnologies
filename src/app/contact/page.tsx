import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact | FARMILY",
  description:
    "A distributor thinking about a pilot, or an investor who wants to learn more? We'd like to hear from you.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Let's talk.">
        A distributor thinking about a pilot, or an investor who wants to
        learn more? We&apos;d like to hear from you.
      </PageHero>

      <section>
        <Container className="grid gap-14 section-compact md:grid-cols-[2fr_1fr] md:gap-20">
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal delay={100} className="text-small">
            <h2 className="font-display text-lg text-ink">Prefer email?</h2>
            <a
              href="mailto:benjamin.omayebu@farmilytechnologies.com"
              className="mt-2 inline-block py-3 text-teal-deep underline [overflow-wrap:anywhere] decoration-teal-deep/40 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
            >
              benjamin.omayebu@farmilytechnologies.com
            </a>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
