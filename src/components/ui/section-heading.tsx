import { FlagStripe } from "@/components/brand/flag-stripe";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

/**
 * SectionHeading (§11/§14) — diamond bullet kicker + giant display title
 * + short faixa PT underline. Tones adapt to dark/light sections.
 */
export interface SectionHeadingProps {
  kicker: string;
  title: string;
  description?: string;
  id?: string;
  tone?: "dark" | "light";
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  kicker,
  title,
  description,
  id,
  tone = "dark",
  align = "left",
  className,
}: SectionHeadingProps) {
  const dark = tone === "dark";
  return (
    <Reveal
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <p
        className={cn(
          "flex items-center gap-3 font-ui text-sm font-semibold uppercase tracking-[0.35em]",
          dark ? "text-apg-yellow" : "text-apg-blue",
          align === "center" && "justify-center",
        )}
      >
        <span aria-hidden className="inline-block size-2 rotate-45 bg-current" />
        {kicker}
      </p>
      <h2
        id={id}
        className={cn(
          "mt-4 font-display text-5xl uppercase leading-[0.92] tracking-tight sm:text-6xl lg:text-7xl",
          dark ? "text-white" : "text-apg-blue-deep",
        )}
      >
        {title}
      </h2>
      <FlagStripe
        className={cn("mt-6 w-24", align === "center" && "mx-auto")}
        orientation="horizontal"
      />
      {description ? (
        <p
          className={cn(
            "mt-5 text-base leading-relaxed sm:text-lg",
            dark ? "text-white/65" : "text-ink/70",
          )}
        >
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
