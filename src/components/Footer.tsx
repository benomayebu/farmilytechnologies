import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/solution", label: "Solution" },
  { href: "/about", label: "About" },
  { href: "/research", label: "Research" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink text-paper">
      <Container className="flex flex-col gap-10 py-14 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <Link href="/" className="flex items-center">
            {/* 579x640 source, shown 48px tall. */}
            <Image
              src="/logo.png"
              alt="FARMILY"
              width={43}
              height={48}
              className="h-12 w-auto invert"
            />
          </Link>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3 text-small">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="py-3 text-paper/70 transition-colors hover:text-paper"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="text-small">
          <p className="text-paper/60">Get in touch</p>
          <a
            href="mailto:benjamin.omayebu@farmilytechnologies.com"
            className="mt-1 inline-block py-3 text-paper [overflow-wrap:anywhere] transition-colors hover:text-wheat"
          >
            benjamin.omayebu@farmilytechnologies.com
          </a>
        </div>
      </Container>

      <div className="border-t border-paper/10">
        <Container className="flex flex-col gap-3 py-5 text-xs text-paper/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Farmily Technologies. Built by a team of one, looking for first pilot partners.
          </p>
          <div className="flex gap-5">
            <Link href="/privacy" className="py-3 transition-colors hover:text-paper/80">
              Privacy Policy
            </Link>
            <Link href="/terms" className="py-3 transition-colors hover:text-paper/80">
              Terms of Use
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
