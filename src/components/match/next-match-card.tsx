"use client";

import { FlagStripe } from "@/components/brand/flag-stripe";
import { weatherCodeToGroup } from "@/lib/weather";
import type { WeatherInfo } from "@/types";
import { Cloud, CloudRain, CloudSun, MapPin, Snowflake, Sun, Zap } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

/* ============================================================
 * Next-match glass card — calm, editorial, no countdown.
 * Left date block (day / month / kickoff) · right: competition,
 * APG × opponent, venue, weather. Data from the admin settings.
 * ============================================================ */

const WEATHER_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  clear: Sun,
  partly: CloudSun,
  cloudy: Cloud,
  fog: Cloud,
  drizzle: CloudRain,
  rain: CloudRain,
  snow: Snowflake,
  storm: Zap,
};

export type NextMatchData = {
  competition: string;
  opponent: string;
  date: string;
  venue: "home" | "away";
  stadium: string;
};

export function NextMatchCard({
  match,
  weather,
}: {
  match: NextMatchData;
  weather: WeatherInfo;
}) {
  const t = useTranslations();
  const locale = useLocale();

  const date = new Date(match.date);
  const valid = !Number.isNaN(date.getTime());

  const day = valid ? new Intl.DateTimeFormat(locale, { day: "2-digit" }).format(date) : "—";
  const month = valid
    ? new Intl.DateTimeFormat(locale, { month: "short" }).format(date).replace(".", "")
    : "";
  const weekday = valid
    ? new Intl.DateTimeFormat(locale, { weekday: "long" }).format(date)
    : "";
  const time = valid
    ? new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" }).format(date)
    : "";

  const WeatherIcon =
    WEATHER_ICONS[weatherCodeToGroup(weather.code)] ?? Cloud;
  const weatherKey = weatherCodeToGroup(weather.code);

  return (
    <div className="apg-glass relative w-full max-w-md overflow-hidden">
      <FlagStripe className="absolute top-0 right-0 left-0" />

      <div className="p-5 pt-7 sm:p-6 sm:pt-8">
        {/* Label */}
        <p className="flex items-center gap-2 font-ui text-xs font-semibold uppercase tracking-[0.3em] text-apg-yellow">
          <span
            aria-hidden
            className="inline-block size-1.5 animate-pulse rounded-full bg-apg-green"
          />
          {t("match.nextMatch.label")}
        </p>

        {/* Date block + fixture */}
        <div className="mt-4 flex items-stretch gap-5">
          <div className="flex w-16 shrink-0 flex-col items-center justify-center border-r border-white/15 pr-5 text-center sm:w-20">
            <span className="font-display text-5xl leading-none text-apg-yellow sm:text-6xl">
              {day}
            </span>
            <span className="mt-1.5 font-ui text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">
              {month}
            </span>
            <span className="mt-0.5 font-ui text-[11px] uppercase tracking-[0.14em] text-white/50">
              {time}
            </span>
          </div>

          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <p className="truncate font-ui text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">
              {match.competition}
            </p>
            <p className="mt-1.5 font-display text-3xl leading-[0.95] tracking-wide text-white sm:text-4xl">
              APG
              <span className="mx-2 inline-block align-middle font-ui text-xs font-bold tracking-[0.2em] text-apg-yellow sm:mx-2.5">
                VS
              </span>
              {match.opponent}
            </p>
            <p className="mt-2.5 flex items-center gap-1.5 text-sm text-white/70">
              <MapPin className="size-3.5 shrink-0 text-apg-yellow" aria-hidden />
              <span className="truncate">
                {match.stadium}
                {" · "}
                {t(`match.nextMatch.${match.venue}`)}
              </span>
            </p>
          </div>
        </div>

        {/* Weather strip */}
        <p className="mt-5 flex items-center gap-2 border-t border-white/10 pt-3.5 text-xs text-white/55">
          <WeatherIcon className="size-4 text-apg-yellow" aria-hidden />
          <span className="capitalize">{weekday}</span>
          <span aria-hidden className="ml-auto">
            {t("weather.inGeneva")}: {weather.temperatureC}° ·{" "}
            {t(`weather.${weatherKey}`)}
          </span>
        </p>
      </div>
    </div>
  );
}
