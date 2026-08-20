"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Container from "@/components/ui/Container";
import { CloseIcon, MenuIcon } from "@/components/icons";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/solution", label: "Solution" },
  { href: "/about", label: "About" },
  { href: "/research", label: "Research" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`material-header sticky top-0 z-50 ${scrolled ? "is-scrolled" : ""}`}
    >

      <Container className="flex h-20 items-center justify-between">
        <Link
          href="/"
          className="flex items-center"
          onClick={() => setOpen(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="FARMILY" className="h-14 w-auto sm:h-16" />
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative py-1 text-[15px] font-medium transition-colors active:opacity-60 ${
                  active ? "text-ink" : "text-ink/60 hover:text-ink"
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute -bottom-1 left-0 h-[3px] w-full bg-wheat" />
                )}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/contact"
          className="hidden rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-all duration-200 hover:bg-ink-soft active:scale-[0.97] md:inline-flex"
        >
          Talk to us
        </Link>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="text-ink transition-transform duration-150 active:scale-90 md:hidden"
        >
          {open ? <CloseIcon className="h-7 w-7" /> : <MenuIcon className="h-7 w-7" />}
        </button>
      </Container>

      <div
        className={`grid border-line bg-paper transition-[grid-template-rows] duration-300 ease-out md:hidden ${
          open ? "grid-rows-[1fr] border-t" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <Container className="flex flex-col gap-1 py-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3 text-base font-medium text-ink/80 transition-colors active:bg-ink/10 hover:bg-ink/5 hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </Container>
        </div>
      </div>
    </header>
  );
}
