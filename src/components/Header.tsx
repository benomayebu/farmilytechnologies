"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Container from "@/components/ui/Container";
import { CloseIcon, MenuIcon } from "@/components/icons";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/solution", label: "Solution" },
  { href: "/about", label: "About" },
  { href: "/research", label: "Research" },
  { href: "/contact", label: "Contact" },
];

const MENU_ID = "mobile-menu";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Close the menu whenever the route changes. Adjusting state during render
  // (instead of in an effect) is React's recommended pattern for this.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape closes the menu and hands focus back to the button that opened it.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

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
          {/* Source is 579x640; width/height are the largest size it is shown
              at (64px tall), keeping that ratio, so Next serves a 1x/2x file
              sized for the header instead of the full PNG. */}
          <Image
            src="/logo.png"
            alt="FARMILY"
            width={58}
            height={64}
            preload
            className="h-14 w-auto sm:h-16"
          />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-9 md:flex">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative rounded-sm py-1 text-[15px] font-medium transition-colors active:opacity-60 ${
                  active ? "text-ink" : "text-ink/70 hover:text-ink"
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
          className="hidden rounded-full border border-ink/25 px-5 py-2.5 text-sm font-medium text-ink transition-all duration-200 hover:border-ink hover:bg-ink/5 active:scale-[0.97] md:inline-flex"
        >
          Talk to us
        </Link>

        <button
          ref={menuButtonRef}
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls={MENU_ID}
          onClick={() => setOpen((v) => !v)}
          className="-mr-2 p-2 text-ink transition-transform duration-150 active:scale-90 md:hidden"
        >
          {open ? <CloseIcon className="h-7 w-7" /> : <MenuIcon className="h-7 w-7" />}
        </button>
      </Container>

      {/* `inert` while closed: the panel is only collapsed visually, so without
          it its links would still be reachable with Tab. */}
      <div
        id={MENU_ID}
        inert={!open}
        className={`grid border-line bg-paper transition-[grid-template-rows] duration-300 ease-[var(--ease-out)] md:hidden ${
          open ? "grid-rows-[1fr] border-t" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <nav aria-label="Main">
            <Container className="flex flex-col gap-1 py-4">
              {NAV.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname?.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-2 py-3 text-base font-medium text-ink/80 transition-colors active:bg-ink/10 hover:bg-ink/5 hover:text-ink"
                  >
                    {item.label}
                  </Link>
                );
              })}
            </Container>
          </nav>
        </div>
      </div>
    </header>
  );
}
