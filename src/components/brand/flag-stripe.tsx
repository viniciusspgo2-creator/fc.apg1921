import { cn } from "@/lib/utils";

/* ============================================================
 * FC APG 1921 — "Faixa PT" (brief §3.3)
 * Green | red signature stripe, never dominant. Used as section
 * divider, title underline and "live" accent.
 * Real Portugal flag ratio: green 2/5, red 3/5.
 * ============================================================ */

type FlagStripeOrientation = "horizontal" | "vertical";

export interface FlagStripeProps {
  orientation?: FlagStripeOrientation;
  className?: string;
}

export function FlagStripe({
  orientation = "horizontal",
  className,
}: FlagStripeProps) {
  const horizontal = orientation === "horizontal";
  return (
    <div
      aria-hidden
      className={cn(
        "flex overflow-hidden",
        horizontal ? "h-1.5 w-full flex-row" : "h-full w-1.5 flex-col",
        className,
      )}
    >
      <div className="bg-apg-green" style={{ flex: "2 1 0%" }} />
      <div className="bg-apg-red" style={{ flex: "3 1 0%" }} />
    </div>
  );
}
