import { cn } from "@/lib/utils";

type LogoWordmarkProps = {
  className?: string;
  /** Prefer true for above-the-fold brand marks (e.g. main nav). */
  priority?: boolean;
};

/** Compact Foundry wordmark used across the app shell. */
export function LogoWordmark({ className, priority }: LogoWordmarkProps) {
  void priority;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-sans font-semibold tracking-normal text-inherit",
        className,
      )}
    >
      <span
        aria-hidden
        className="relative size-7 shrink-0 overflow-hidden rounded-md border border-amber-300/45 bg-[#17100b] shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_0_28px_rgba(245,158,11,0.18)] sm:size-8"
      >
        <span className="absolute inset-x-1 top-1 h-1 rounded-full bg-amber-300/80" />
        <span className="absolute bottom-1 left-1 h-3 w-1 rounded-full bg-teal-300/75" />
        <span className="absolute bottom-1 right-1 h-4 w-1 rounded-full bg-orange-400/80" />
      </span>
      <span className="font-heading font-semibold">Foundry</span>
    </span>
  );
}
