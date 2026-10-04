import { CulturalBand } from "@/components/about/cultural-band";
import { Values } from "@/components/about/values";
import { APGLogo } from "@/components/brand/apg-logo";
import { FlagStripe } from "@/components/brand/flag-stripe";
import { AppLink } from "@/components/layout/transition-link";
import { Reveal } from "@/components/ui/reveal";
import { getSettings, getSiteText } from "@/lib/content";
import { ArrowRight, MapPin, Users } from "lucide-react";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/types";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd, buildMetadata, webPageJsonLd } from "@/lib/seo";

/* ============================================================
 * FC APG 1921 — /sobre (institutional edition)
 * Page header (dark) → editorial intro (serif) → "today" block
 * with club posters → values → cultural band "Portugal ×
 * Genève" → practical CTA. No timeline / squad / board.
 * ============================================================ */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  return buildMetadata({
    locale,
    path: "/sobre",
    title: t("title"),
    description: t("subtitle"),
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);
  const t = await getTranslations();

  const [settings, text1, text2] = await Promise.all([
    getSettings([
      "contact.trainingPrincipal",
      "contact.trainingVets",
      "stadium.name",
      "stadium.address",
    ]),
    getSiteText("about.today.text1", locale, t("about.today.text1")),
    getSiteText("about.today.text2", locale, t("about.today.text2")),
  ]);

  const aboutTitle = t("about.title");
  const aboutSubtitle = t("about.subtitle");

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            name: aboutTitle,
            description: aboutSubtitle,
            path: "/sobre",
            locale,
            type: "AboutPage",
            breadcrumb: breadcrumbJsonLd([
              { name: "Accueil", path: "" },
              { name: aboutTitle, path: "/sobre" },
            ]),
          }),
        ]}
      />

      {/* --------------------------------------- page header (dark) */}
      <section
        className="apg-grain apg-diamonds relative overflow-hidden bg-ink pt-28 pb-16 sm:pt-32 lg:pb-24 lg:pt-36"
        aria-labelledby="about-title"
      >
        <div className="relative z-[2] mx-auto w-full max-w-7xl px-5 sm:px-8">
          <Reveal>
            <p className="flex items-center gap-3 font-ui text-sm font-semibold uppercase tracking-[0.35em] text-apg-yellow">
              <span aria-hidden className="inline-block size-2 rotate-45 bg-current" />
              {t("about.label")}
            </p>
            <h1
              id="about-title"
              className="mt-4 max-w-4xl font-display text-6xl uppercase leading-[0.9] tracking-tight text-white sm:text-7xl lg:text-8xl"
            >
              {t("about.title")}
            </h1>
            <FlagStripe className="mt-6 w-32" />
            <p className="mt-6 max-w-2xl font-serif text-xl italic leading-relaxed text-white/75 sm:text-2xl">
              {t("about.subtitle")}
            </p>
          </Reveal>
        </div>

        {/* Decorative crest watermark */}
        <APGLogo
          variant="icon"
          tone="mono"
          label=""
          className="pointer-events-none absolute -right-14 bottom-0 hidden w-96 text-white/8 lg:block"
        />
      </section>

      {/* -------------------------------------- today (editorial) */}
      <section className="bg-paper text-ink" aria-labelledby="today-title">
        <div className="mx-auto grid w-full max-w-7xl items-start gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-24">
          <Reveal>
            <p className="font-ui text-sm font-semibold uppercase tracking-[0.35em] text-apg-blue">
              {t("about.today.label")}
            </p>
            <h2
              id="today-title"
              className="mt-4 font-serif text-4xl leading-[1.1] text-apg-blue-deep sm:text-5xl"
            >
              {t("about.today.title")}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ink/70">{text1}</p>
            <p className="mt-4 text-lg leading-relaxed text-ink/70">{text2}</p>

            <dl className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="border border-ink/10 bg-paper-soft p-5 transition-colors duration-300 hover:border-apg-blue/40">
                <dt className="flex items-center gap-2 font-ui text-sm font-semibold uppercase tracking-[0.2em] text-apg-blue">
                  <Users className="size-4" aria-hidden />
                  {t("home.practical.trainingTitle")}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink/70">
                  {settings["contact.trainingPrincipal"] ?? "—"}
                  <br />
                  {settings["contact.trainingVets"] ?? ""}
                </dd>
              </div>
              <div className="border border-ink/10 bg-paper-soft p-5 transition-colors duration-300 hover:border-apg-blue/40">
                <dt className="flex items-center gap-2 font-ui text-sm font-semibold uppercase tracking-[0.2em] text-apg-blue">
                  <MapPin className="size-4" aria-hidden />
                  {t("home.practical.venueTitle")}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink/70">
                  {settings["stadium.name"] ?? "—"}
                  <br />
                  {settings["stadium.address"] ?? ""}
                </dd>
              </div>
            </dl>
          </Reveal>

          <Reveal delay={0.1}>
            {/* Editorial framed print — photo stays whole */}
            <div className="apg-frame-accent-ink apg-frame-ink relative w-full">
              <div className="relative z-[1] aspect-[4/5] w-full overflow-hidden bg-paper-soft shadow-[0_30px_80px_rgba(0,43,92,0.18)]">
                <Image
                  src="/uploads/club/poster-crest-team.webp"
                  alt={t("about.today.imageAlt")}
                  fill
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  className="object-cover"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------- values */}
      <Values />

      {/* --------------------------------------- cultural band */}
      <CulturalBand />

      {/* ---------------------------------------------- CTA */}
      <section className="apg-grain relative overflow-hidden bg-ink py-20">
        <div className="relative z-[2] mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-8 px-5 sm:px-8">
          <Reveal>
            <h2 className="font-display text-4xl uppercase leading-[0.95] text-white sm:text-5xl">
              {t("home.practical.joinTitle")}
            </h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-white/70">
              {t("home.practical.joinText")}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <AppLink
              href="/contato"
              className="apg-focus inline-flex min-h-14 items-center gap-2 bg-apg-yellow px-8 font-ui text-base font-semibold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-white"
            >
              {t("home.membership.cta")}
              <ArrowRight className="size-5" aria-hidden />
            </AppLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}