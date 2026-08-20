import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 48 48",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function SenseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M14 22c5.5-5.5 14.5-5.5 20 0" />
      <path d="M18 26.5c3-3 9-3 12 0" />
      <circle cx="24" cy="30" r="1.5" fill="currentColor" stroke="none" />
      <rect x="10" y="33" width="28" height="9" rx="1" />
      <path d="M10 37.5h28" />
    </svg>
  );
}

export function DetectIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="20" cy="20" r="10.5" />
      <path d="M27.5 27.5 37 37" />
      <path d="M14.5 20.5 17 15l3 9 3-11 2.5 7" />
    </svg>
  );
}

export function ProveIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="8" y="7" width="23" height="30" rx="1" />
      <path d="M13 15h13M13 20.5h13M13 26h8" />
      <circle cx="33" cy="33" r="8" />
      <path d="M29.5 33.2 32 35.5l5.5-5.5" />
    </svg>
  );
}

export function TruckIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="5" y="17" width="21" height="15" rx="1" />
      <path d="M26 21h8l6 6.5V32h-14z" />
      <circle cx="14" cy="35" r="3" />
      <circle cx="33" cy="35" r="3" />
      <path d="M5 35h6M37 35h4" />
    </svg>
  );
}

export function WarehouseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 20 24 8l18 12" />
      <rect x="9" y="20" width="30" height="18" rx="1" />
      <rect x="21" y="30" width="6" height="8" />
      <path d="M15 24v9M11.5 28.5h7M12.5 25.5l5 6M17.5 25.5l-5 6" />
    </svg>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <svg {...base} strokeWidth={1.8} {...props}>
      <path d="M8 24h32" />
      <path d="M30 14l10 10-10 10" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base} strokeWidth={1.8} {...props}>
      <path d="M8 14h32M8 24h32M8 34h32" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base} strokeWidth={1.8} {...props}>
      <path d="M12 12l24 24M36 12 12 36" />
    </svg>
  );
}
