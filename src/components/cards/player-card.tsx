import type { PlayerRow } from "@/lib/content";
import { User } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

/* ============================================================
 * PlayerCard — modern squad card for the home page.
 * Photo (or an elegant initial placeholder on the club gradient),
 * shirt number chip, position chip, name. Hover: gentle lift and
 * a yellow baseline sweep. No clipped corners — editorial frame.
 * ============================================================ */

export function PlayerCard({
  player,
  placeholder,
}: {
  player: PlayerRow;
  /** True when rendered as an "empty state" squad-position card. */
  placeholder?: boolean;
}) {
  const t = useTranslations();

  const positionLabel = (() => {
    try {
      return t(`home.players.positions.${player.position}`);
    } catch {
      return player.position;
    }
  })();

  const initials = (player.name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <article className="group relative flex h-full flex-col border border-ink/10 bg-paper shadow-[0_2px_18px_rgba(0,43,92,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-apg-blue/40 hover:shadow-[0_18px_44px_rgba(0,43,92,0.14)]">
      {/* Photo / placeholder area */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-br from-apg-blue-deep via-[#0c1b31] to-ink">
        {player.photoUrl ? (
          <Image
            src={player.photoUrl}
            alt={t("home.players.photoAlt", { name: player.name })}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 flex items-center justify-center"
          >
            {initials ? (
              <span className="font-display text-7xl tracking-wide text-white/85 transition-transform duration-500 group-hover:scale-105 sm:text-8xl">
                {initials}
              </span>
            ) : (
              <User className="size-16 text-white/20 sm:size-20" />
            )}
            <span className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(248,224,16,0.14),transparent_60%)]" />
          </div>
        )}

        {/* Shirt number chip */}
        {player.number != null && (
          <span className="absolute top-3 left-3 flex size-9 items-center justify-center bg-apg-yellow font-display text-xl leading-none text-ink shadow-[0_4px_14px_rgba(7,10,18,0.35)]">
            {player.number}
          </span>
        )}

        {/* Position chip */}
        <span className="absolute bottom-3 left-3 border border-white/25 bg-ink/55 px-2.5 py-1 font-ui text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
          {positionLabel}
        </span>
      </div>

      {/* Name */}
      <div className="flex flex-1 flex-col p-4">
        <h3
          className={`font-display text-xl leading-tight tracking-wide uppercase ${
            placeholder ? "text-ink/45" : "text-apg-blue-deep"
          }`}
        >
          {player.name || t("home.players.placeholderName")}
        </h3>
        <p className="mt-1 font-ui text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/45">
          {positionLabel}
        </p>
      </div>

      {/* Yellow baseline sweep on hover */}
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-apg-yellow transition-transform duration-300 group-hover:scale-x-100"
      />
      {/* Hidden hint for screen readers on placeholder cards */}
      {placeholder && <span className="sr-only">{t("home.players.placeholderName")}</span>}
    </article>
  );
}
