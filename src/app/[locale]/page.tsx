import { FlagStripe } from "@/components/brand/flag-stripe";
import { NewsCard } from "@/components/cards/news-card";
import { SquadCarousel } from "@/components/cards/squad-carousel";
import { Hero } from "@/components/hero/hero";
import { AppLink } from "@/components/layout/transition-link";
import { NextMatchCard } from "@/components/match/next-match-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { CLUB, SPONSORS } from "@/data/mock";
import {
  getPlayers,
  getPublishedNews,
  getSetting,
  getSettings,
  getSiteText,
} from "@/lib/content";
import { getWeather } from "@/lib/weather";
import { buildMetadata, sportsEventJsonLd, webPageJsonLd } from "@/lib/seo";
import { ArrowRight, Mail, MapPin, MessageCircle, Users } from "lucide-react";
import Image from "next/image";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/types";
import { JsonLd } from "@/components/seo/json-ld";

/* ============================================================
 * FC APG 1921 — Home (institutional edition, 2026)
 * Photo hero → next match (no countdown, auto-hides once past) →
 * welcome editorial → framed team photo → squad cards (DB) →
 * practical info → membership CTA → regional news → sponsors +
 * partnership band. 2026 refresh: whole photos in editorial
 * frames, no clipped corners anywhere.
 * ============================================================ */

/** A match stays visible during match day, then disappears. */
const MATCH_GRACE_MS = 6 * 60 * 60 * 1000;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const base = buildMetadata({
    locale,
    path: "",
    title: t("title"),
    description: t("description"),
    keywords: (t("keywords") ?? "")
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean),
  });
  return { ...base, title: { absolute: t("title") } };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);
  const t = await getTranslations();

  const [weather, settings, news, players, heroImg, heroT1, heroT2, heroSub] =
    await Promise.all([
      getWeather(),
      getSettings([
        "nextMatch.competition",
        "nextMatch.opponent",
        "nextMatch.date",
        "nextMatch.venue",
        "nextMatch.stadium",
        "nextMatch.visible",
        "contact.email",
        "contact.trainingPrincipal",
        "contact.trainingVets",
        "stadium.name",
        "stadium.address",
        "hero.image",
      ]),
      getPublishedNews(3),
      getPlayers(20),
      getSetting("hero.image"),
      getSiteText("hero.titleLine1", locale, t("hero.titleLine1")),
      getSiteText("hero.titleLine2", locale, t("hero.titleLine2")),
      getSiteText("hero.subtitle", locale, t("hero.subtitle")),
    ]);

  const showMatch = settings["nextMatch.visible"] !== "false";
  const matchDate = settings["nextMatch.date"] ?? "";
  const matchTs = matchDate ? new Date(matchDate).getTime() : NaN;
  const matchPassed =
    Number.isFinite(matchTs) && Date.now() - matchTs > MATCH_GRACE_MS;
  const nextMatch =
    showMatch && matchDate && !matchPassed
      ? {
          competition: settings["nextMatch.competition"] ?? "",
          opponent: settings["nextMatch.opponent"] ?? "",
          date: matchDate,
          venue: (settings["nextMatch.venue"] === "away" ? "away" : "home") as
            | "home"
            | "away",
          stadium: settings["nextMatch.stadium"] ?? "",
        }
      : null;

  const [
    introText,
    introTitle,
    introSignature,
    teamTitle,
    teamText,
    memberTitle,
    memberText,
    sponsorKicker,
    sponsorTitle,
    sponsorText,
    sponsorCta,
    playersTitle,
    playersSubtitle,
  ] = await Promise.all([
    getSiteText("home.intro.text", locale, t("home.intro.text")),
    getSiteText("home.intro.title", locale, t("home.intro.title")),
    getSiteText("home.intro.signature", locale, t("home.intro.signature")),
    getSiteText("home.teamPhoto.title", locale, t("home.teamPhoto.title")),
    getSiteText("home.teamPhoto.text", locale, t("home.teamPhoto.text")),
    getSiteText("home.membership.title", locale, t("home.membership.title")),
    getSiteText("home.membership.text", locale, t("home.membership.text")),
    getSiteText("home.sponsor.kicker", locale, t("home.sponsor.kicker")),
    getSiteText("home.sponsor.title", locale, t("home.sponsor.title")),
    getSiteText("home.sponsor.text", locale, t("home.sponsor.text")),
    getSiteText("home.sponsor.cta", locale, t("home.sponsor.cta")),
    getSiteText("home.players.title", locale, t("home.players.title")),
    getSiteText("home.players.subtitle", locale, t("home.players.subtitle")),
  ]);

  const practical = [
    {
      icon: Users,
      title: t("home.practical.trainingTitle"),
      lines: [
        settings["contact.trainingPrincipal"] ?? "",
        settings["contact.trainingVets"] ?? "",
      ].filter(Boolean),
    },
    {
      icon: MapPin,
      title: t("home.practical.venueTitle"),
      lines: [
        settings["stadium.name"] ?? "",
        settings["stadium.address"] ?? "",
      ].filter(Boolean),
    },
    {
      icon: Mail,
      title: t("home.practical.contactTitle"),
      lines: [settings["contact.email"] ?? "", "WhatsApp direct"].filter(Boolean),
    },
  ];

  /** Empty-state squad: one placeholder card per line of the team. */
  const squad =
    players.length > 0
      ? players
      : (["gk", "df", "mf", "fw"] as const).map((position, i) => ({
          id: `placeholder-${position}`,
          name: "",
          position,
          number: null,
          photoUrl: "",
          sortOrder: i,
        }));

  return (
    <>
      {/* WebPage + SportsEvent (next fixture) — crawlable rich data */}
      <JsonLd
        data={[
          webPageJsonLd({
            name: t("meta.siteName"),
            description: t("meta.description"),
            path: "",
            locale,
          }),
          ...(nextMatch
            ? [sportsEventJsonLd(nextMatch, settings["stadium.address"])]
            : []),
        ]}
      />
      {/* ------------------------------------------------ hero */}
      <Hero
        heroImage={heroImg ?? "/uploads/club/hero-team.webp"}
        nextMatchSlot={
          nextMatch ? <NextMatchCard match={nextMatch} weather={weather} /> : null
        }
      />

      {/* ------------------------------------------- welcome (serif editorial) */}
      <section className="bg-paper text-ink" aria-labelledby="intro-title">
        <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <p className="font-ui text-sm font-semibold uppercase tracking-[0.35em] text-apg-blue">
                {t("home.intro.kicker")}
              </p>
              <h2
                id="intro-title"
                className="mt-4 font-serif text-4xl leading-[1.08] text-apg-blue-deep sm:text-5xl lg:text-6xl"
              >
                {introTitle}
              </h2>
              <FlagStripe className="mx-auto mt-7 w-28" />
              <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-ink/70">
                {introText}
              </p>
              <p className="mt-7 inline-flex items-center gap-3 font-display text-xl tracking-[0.14em] text-apg-blue uppercase sm:text-2xl">
                <span aria-hidden className="inline-block size-2 rotate-45 bg-apg-yellow" />
                {introSignature}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* --------------------------------------------- team photo */}
      <section
        className="apg-grain relative overflow-hidden bg-ink"
        aria-labelledby="team-title"
      >
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-24">
          <Reveal className="order-2 lg:order-1">
            <p className="font-ui text-sm font-semibold uppercase tracking-[0.35em] text-apg-yellow">
              {t("home.teamPhoto.kicker")}
            </p>
            <h2
              id="team-title"
              className="mt-4 font-display text-4xl uppercase leading-[0.95] text-white sm:text-5xl lg:text-6xl"
            >
              {teamTitle}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              {teamText}
            </p>
            <AppLink
              href="/galeria"
              className="apg-focus mt-8 inline-flex min-h-12 items-center gap-2 bg-apg-yellow px-6 font-ui text-sm font-semibold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-white"
            >
              {t("home.teamPhoto.cta")}
              <ArrowRight className="size-4" aria-hidden />
            </AppLink>
          </Reveal>
          <Reveal delay={0.08} className="order-1 lg:order-2">
            {/* Editorial framed print — the photo stays whole */}
            <div className="apg-frame-accent relative mx-auto w-full max-w-lg">
              <div className="apg-frame relative z-[1] aspect-[4/5] w-full overflow-hidden bg-ink shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
                <Image
                  src="/uploads/club/poster-team-values.webp"
                  alt={t("home.teamPhoto.imageAlt")}
                  fill
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  className="object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------ squad cards */}
      <section className="bg-paper text-ink" aria-labelledby="squad-title">
        <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              id="squad-title"
              tone="light"
              kicker={t("home.players.kicker")}
              title={playersTitle}
            />
            <Reveal delay={0.1}>
              <AppLink
                href="/contato"
                data-analytics="join_players"
                className="apg-focus inline-flex min-h-11 items-center gap-2 border-b-2 border-apg-blue pb-1 font-ui text-sm font-semibold uppercase tracking-[0.18em] text-apg-blue transition-colors hover:border-apg-yellow hover:text-apg-blue-deep"
              >
                {t("home.players.join")}
                <ArrowRight className="size-4" aria-hidden />
              </AppLink>
            </Reveal>
          </div>
          <Reveal delay={0.05}>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink/60">
              {playersSubtitle}
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-10">
            <SquadCarousel players={squad} placeholder={players.length === 0} />
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------- practical info */}
      <section className="bg-paper-soft text-ink" aria-labelledby="practical-title">
        <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
          <SectionHeading
            id="practical-title"
            tone="light"
            kicker={t("home.practical.kicker")}
            title={t("home.practical.title")}
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {practical.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.06} className="h-full">
                <div className="group flex h-full flex-col border border-ink/10 bg-paper p-6 shadow-[0_2px_18px_rgba(0,43,92,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-apg-blue/40 hover:shadow-[0_16px_40px_rgba(0,43,92,0.13)]">
                  <span className="flex size-11 items-center justify-center bg-apg-blue text-white transition-colors duration-300 group-hover:bg-apg-blue-deep">
                    <item.icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 font-display text-2xl uppercase tracking-tight text-apg-blue-deep">
                    {item.title}
                  </h3>
                  <ul className="mt-3 space-y-1">
                    {item.lines.map((line) => (
                      <li key={line} className="text-sm leading-relaxed text-ink/70">
                        {line}
                      </li>
                    ))}
                  </ul>
                  <span
                    aria-hidden
                    className="mt-auto block pt-5"
                  >
                    <span className="block h-[3px] w-10 bg-apg-yellow transition-all duration-300 group-hover:w-16" />
                  </span>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-5 border border-apg-blue/20 bg-apg-blue/5 p-6">
              <div>
                <h3 className="font-display text-2xl uppercase tracking-tight text-apg-blue-deep">
                  {t("home.practical.joinTitle")}
                </h3>
                <p className="mt-1 max-w-xl text-sm leading-relaxed text-ink/65">
                  {t("home.practical.joinText")}
                </p>
              </div>
              <AppLink
                href="/contato"
                data-analytics="membership_cta"
                className="apg-focus inline-flex min-h-12 items-center gap-2 bg-apg-blue px-6 font-ui text-sm font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-apg-blue-deep"
              >
                <MessageCircle className="size-4" aria-hidden />
                {t("home.membership.cta")}
              </AppLink>
            </div>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-ink/40">
              {t("home.practical.note")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------ membership CTA */}
      <section
        className="relative overflow-hidden bg-gradient-to-br from-apg-blue to-apg-blue-deep py-16 lg:py-20"
        aria-labelledby="membership-title"
      >
        <div aria-hidden className="apg-diamonds absolute inset-0 opacity-60" />
        <div className="relative z-[2] mx-auto grid w-full max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1.2fr_0.8fr]">
          <Reveal>
            <h2
              id="membership-title"
              className="font-display text-4xl uppercase leading-[0.9] tracking-tight text-white sm:text-6xl"
            >
              {memberTitle}
            </h2>
            <FlagStripe className="mt-6 w-32" />
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">
              {memberText}
            </p>
          </Reveal>
          <Reveal delay={0.1} className="lg:justify-self-end">
            <AppLink
              href="/contato"
              data-analytics="membership_cta"
              className="apg-focus inline-flex min-h-14 items-center gap-2 bg-apg-yellow px-8 font-ui text-base font-semibold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-white"
            >
              {t("home.membership.cta")}
              <ArrowRight className="size-5" aria-hidden />
            </AppLink>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------ news */}
      {news.length > 0 && (
        <section className="bg-paper-soft py-16 text-ink lg:py-24" aria-labelledby="news-title">
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                id="news-title"
                tone="light"
                kicker={t("home.news.label")}
                title={t("home.news.title")}
              />
              <Reveal delay={0.1}>
                <AppLink
                  href="/blog"
                  className="apg-focus inline-flex min-h-11 items-center gap-2 border-b-2 border-apg-blue pb-1 font-ui text-sm font-semibold uppercase tracking-[0.18em] text-apg-blue transition-colors hover:border-apg-yellow hover:text-apg-blue-deep"
                >
                  {t("home.news.all")}
                  <ArrowRight className="size-4" aria-hidden />
                </AppLink>
              </Reveal>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {news.map((post, i) => (
                <Reveal key={post.id} delay={i * 0.08} className="h-full">
                  <NewsCard post={post} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ------------------------------- partners: sponsorship + marquee */}
      <section
        className="apg-grain relative overflow-hidden bg-ink"
        aria-labelledby="sponsor-title"
      >
        <div aria-hidden className="apg-diamonds absolute inset-0 opacity-50" />
        <div className="relative z-[2] mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
          {/* Partnership card — corner diamonds, whole frame */}
          <Reveal>
            <div className="relative mx-auto max-w-4xl border border-apg-yellow/35 bg-white/[0.04] p-8 text-center shadow-[0_24px_60px_rgba(0,0,0,0.4)] sm:p-12">
              {/* Brand-dna corner diamonds */}
              <span aria-hidden className="absolute top-0 left-0 size-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-apg-yellow" />
              <span aria-hidden className="absolute top-0 right-0 size-2.5 translate-x-1/2 -translate-y-1/2 rotate-45 bg-apg-yellow" />
              <span aria-hidden className="absolute bottom-0 left-0 size-2.5 -translate-x-1/2 translate-y-1/2 rotate-45 bg-apg-yellow" />
              <span aria-hidden className="absolute right-0 bottom-0 size-2.5 translate-x-1/2 translate-y-1/2 rotate-45 bg-apg-yellow" />

              <p
                id="sponsor-title"
                className="font-ui text-sm font-semibold uppercase tracking-[0.35em] text-apg-yellow"
              >
                {sponsorKicker}
              </p>
              <h2 className="mt-4 font-display text-4xl uppercase leading-[0.95] tracking-tight text-white sm:text-5xl">
                {sponsorTitle}
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
                {sponsorText}
              </p>
              <AppLink
                href="/contato"
                data-analytics="sponsor_cta"
                className="apg-focus mt-8 inline-flex min-h-13 items-center gap-2 bg-apg-yellow px-8 py-3 font-ui text-sm font-semibold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-white"
              >
                <MessageCircle className="size-4" aria-hidden />
                {sponsorCta}
                <ArrowRight className="size-4" aria-hidden />
              </AppLink>
            </div>
          </Reveal>

          {/* Sponsor marquee */}
          <div className="apg-marquee relative mt-14 overflow-hidden" aria-label={CLUB.shortName}>
            <div className="apg-marquee-track flex w-max items-center gap-14 pr-14">
              {[...SPONSORS, ...SPONSORS].map((s, i) => (
                <span
                  key={`${s.id}-${i}`}
                  aria-hidden={i >= SPONSORS.length}
                  className="whitespace-nowrap font-ui text-sm font-semibold uppercase tracking-[0.3em] text-white/35"
                >
                  {s.name}
                </span>
              ))}
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent"
            />
          </div>
          <p className="mx-auto mt-8 text-center font-ui text-[11px] uppercase tracking-[0.3em] text-white/25">
            {CLUB.shortName} — {t("hero.label")}
          </p>
        </div>
      </section>
    </>
  );
}
