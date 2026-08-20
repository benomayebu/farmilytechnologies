import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "@/components/icons";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-teal text-paper hover:bg-teal-deep",
  secondary: "bg-ink text-paper hover:bg-ink-soft",
  ghost:
    "bg-transparent text-ink border border-ink/25 hover:border-ink hover:bg-ink/5",
};

export default function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: ButtonProps) {
  const isExternal = href.startsWith("http") || href.startsWith("mailto:");
  const classes = `group inline-flex items-center gap-2.5 rounded-full px-6 py-3.5 text-[15px] font-medium tracking-wide transition-all duration-200 active:scale-[0.97] ${variants[variant]} ${className}`;

  const content = (
    <>
      {children}
      <ArrowRight className="h-4 w-4 shrink-0 -translate-x-0.5 transition-transform duration-200 group-hover:translate-x-0.5" />
    </>
  );

  if (isExternal) {
    return (
      <a href={href} className={classes} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
