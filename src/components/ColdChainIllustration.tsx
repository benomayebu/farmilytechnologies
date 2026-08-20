import {
  DetectIcon,
  ProveIcon,
  SenseIcon,
  TruckIcon,
  WarehouseIcon,
} from "@/components/icons";

const STOPS = [
  { badge: SenseIcon, scene: TruckIcon },
  { badge: DetectIcon, scene: WarehouseIcon },
  { badge: ProveIcon, scene: TruckIcon },
] as const;

/**
 * Full-bleed background scene for the hero — sits behind the headline as a
 * large, low-opacity layer (same role the hero photo used to play), rather
 * than a small strip of icons.
 */
export default function ColdChainIllustration() {
  return (
    <div className="animate-illustration-in absolute inset-0 flex items-center justify-center">
      <div className="relative w-full max-w-[1400px] px-6">
        <svg
          viewBox="0 0 1200 60"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="pointer-events-none absolute left-[10%] right-[10%] top-[76px] h-16 w-[80%] sm:top-[112px] lg:top-[140px]"
        >
          <path
            className="animate-flow-dash"
            d="M0 45 Q 300 5 600 15 Q 900 25 1200 45"
            fill="none"
            stroke="var(--teal)"
            strokeWidth={2.5}
            strokeDasharray="9 9"
            opacity={0.6}
          />
        </svg>

        <div className="relative flex items-center justify-between">
          {STOPS.map((stop, i) => {
            const Badge = stop.badge;
            const Scene = stop.scene;
            return (
              <div key={i} className="flex flex-col items-center">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-wheat bg-ink-soft sm:h-20 sm:w-20 lg:h-24 lg:w-24">
                  <Badge className="h-8 w-8 text-wheat sm:h-10 sm:w-10 lg:h-12 lg:w-12" />
                </div>
                <Scene className="mt-10 h-24 w-24 text-paper/90 sm:mt-14 sm:h-36 sm:w-36 lg:mt-20 lg:h-48 lg:w-48" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
