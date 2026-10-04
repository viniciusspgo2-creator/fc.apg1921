import { FlagStripe } from "@/components/brand/flag-stripe";
import { AppLink } from "@/components/layout/transition-link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/types";

/* ============================================================
 * Legal pages (brief §13) — shared renderer for "Mentions
 * légales" and "Confidentialité (nLPD)". Swiss law ready.
 * ============================================================ */

const UPDATED_ON = "2025-10-01";
/** Mentions légales has 3 sections; privacy has 4. */
const SECTIONS_BY_KIND: Record<"mentions" | "privacy", string[]> = {
  mentions: ["s1", "s2", "s3"],
  privacy: ["s1", "s2", "s3", "s4"],
};

export async function LegalPage({
  locale,
  kind,
}: {
  locale: string;
  kind: "mentions" | "privacy";
}) {
  setRequestLocale(locale as AppLocale);
  const t = await getTranslations("legal");
  const tNav = await getTranslations("nav");

  const date = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(UPDATED_ON));

  return (
    <div className="bg-paper text-ink">
      {/* Page header */}
      <header className="apg-grain relative bg-ink">
        <div className="relative z-[2] mx-auto w-full max-w-4xl px-5 pb-16 pt-28 sm:px-8 sm:pt-32">
          <p className="flex items-center gap-3 font-ui text-sm font-semibold uppercase tracking-[0.35em] text-apg-yellow">
            <span aria-hidden className="inline-block size-2 rotate-45 bg-apg-yellow" />
            FC APG 1921
          </p>
          <h1 className="mt-4 font-display text-5xl uppercase tracking-tight text-white sm:text-6xl">
            {t(`${kind}.title`)}
          </h1>
          <FlagStripe className="mt-6 w-24" />
          <p className="mt-4 font-ui text-sm uppercase tracking-[0.18em] text-white/50">
            {t(`${kind}.updated`, { date })}
          </p>
        </div>
        <FlagStripe />
      </header>

      {/* Sections */}
      <div className="mx-auto w-full max-w-4xl px-5 py-16 sm:px-8">
        <div className="space-y-10">
          {SECTIONS_BY_KIND[kind].map((s) => (
            <section key={s} className="border-l-2 border-apg-blue/20 pl-6">
              <h2 className="font-display text-2xl uppercase tracking-wide text-apg-blue-deep">
                {t(`${kind}.${s}t`)}
              </h2>
              <p className="mt-3 leading-relaxed text-ink/75">{t(`${kind}.${s}b`)}</p>
            </section>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-4 border-t border-ink/10 pt-8">
          <AppLink
            href="/"
            className="apg-focus inline-flex min-h-11 items-center bg-apg-blue px-6 font-ui text-sm font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-apg-blue-deep"
          >
            {tNav("home")}
          </AppLink>
          <AppLink
            href={kind === "mentions" ? "/confidentialite" : "/mentions-legales"}
            className="apg-focus inline-flex min-h-11 items-center border border-apg-blue/30 px-6 font-ui text-sm font-semibold uppercase tracking-[0.18em] text-apg-blue transition-colors hover:border-apg-blue hover:bg-apg-blue hover:text-white"
          >
            {kind === "mentions"
              ? t("privacy.title")
              : t("mentions.title")}
          </AppLink>
        </div>
      </div>
    </div>
  );
}
