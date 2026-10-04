import { APGLogo } from "@/components/brand/apg-logo";
import { FlagStripe } from "@/components/brand/flag-stripe";
import { Reveal } from "@/components/ui/reveal";
import { getTranslations } from "next-intl/server";

/* ============================================================
 * Cultural band (brief §9.2) — "Portugal × Genève". Blue
 * gradient section with the diamond lattice, asymmetric
 * composition: copy on the left, decorative crest + layered
 * diamonds + vertical flag stripe on the right.
 * ============================================================ */

export async function CulturalBand() {
  const t = await getTranslations();

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-apg-blue to-apg-blue-deep py-20 text-white lg:py-28"
      aria-labelledby="cultural-title"
    >
      <div aria-hidden className="apg-diamonds absolute inset-0 opacity-60" />

      {/* Vertical flag stripe hugging the right edge (desktop) */}
      <FlagStripe
        orientation="vertical"
        className="absolute top-0 right-0 hidden h-full w-2 opacity-80 lg:block"
      />

      <div className="relative z-[2] mx-auto grid w-full max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-center lg:gap-16">
        <Reveal>
          <p className="flex items-center gap-3 font-ui text-sm font-semibold uppercase tracking-[0.35em] text-apg-yellow">
            <span aria-hidden className="inline-block size-2 rotate-45 bg-current" />
            {t("about.label")}
          </p>
          <h2
            id="cultural-title"
            className="mt-4 font-display text-5xl uppercase leading-[0.92] tracking-tight sm:text-6xl lg:text-7xl"
          >
            {t("about.culturalTitle")}
          </h2>
          <FlagStripe className="mt-6 w-28" />
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">
            {t("about.culturalText")}
          </p>
        </Reveal>

        {/* Decorative composition — offset diamonds + crest */}
        <div className="relative hidden h-80 items-center justify-center lg:flex" aria-hidden>
          <div className="apg-clip-diamond absolute size-80 translate-x-10 translate-y-6 bg-white/8" />
          <div className="apg-clip-diamond absolute size-52 -translate-x-16 -translate-y-8 bg-white/10" />
          <div className="apg-clip-diamond absolute size-64 bg-white/12" />
          <APGLogo
            variant="icon"
            tone="mono"
            label=""
            className="relative w-40 text-white"
          />
        </div>
      </div>
    </section>
  );
}
