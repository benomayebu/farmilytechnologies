import {
  DetectIcon,
  ProveIcon,
  SenseIcon,
  TruckIcon,
  WarehouseIcon,
} from "@/components/icons";

const STOPS = [
  { badge: SenseIcon, scene: TruckIcon, label: "Loaded & sealed" },
  { badge: DetectIcon, scene: WarehouseIcon, label: "In transit" },
  { badge: ProveIcon, scene: TruckIcon, label: "Delivered" },
] as const;

export default function ColdChainIllustration() {
  return (
    <div className="relative">
      <svg
        viewBox="0 0 600 60"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="pointer-events-none absolute left-[16%] right-[16%] top-7 h-10 w-[68%] sm:top-8"
      >
        <path
          d="M0 45 Q 150 5 300 15 Q 450 25 600 45"
          fill="none"
          stroke="var(--teal)"
          strokeWidth={2}
          strokeDasharray="7 7"
          opacity={0.55}
        />
      </svg>

      <div className="relative grid grid-cols-3 gap-3 sm:gap-6">
        {STOPS.map((stop, i) => {
          const Badge = stop.badge;
          const Scene = stop.scene;
          return (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-wheat bg-ink-soft sm:h-14 sm:w-14">
                <Badge className="h-6 w-6 text-wheat sm:h-7 sm:w-7" />
              </div>
              <Scene className="mt-5 h-12 w-12 text-paper/85 sm:mt-7 sm:h-16 sm:w-16" />
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-wide text-paper/45 sm:text-xs">
                {stop.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
