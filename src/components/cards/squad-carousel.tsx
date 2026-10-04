"use client";

import { PlayerCard } from "@/components/cards/player-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import type { PlayerRow } from "@/lib/content";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

/* ============================================================
 * SquadCarousel — the 16-player effectif as a horizontal slider.
 * Swipe/drag on touch, arrow buttons + keyboard everywhere,
 * snap position counter and a brand progress bar. Loop enabled
 * so the squad never hits a dead end. No layout shift: the track
 * is rendered server-side inside a client carousel shell.
 * ============================================================ */

export function SquadCarousel({
  players,
  placeholder,
}: {
  players: PlayerRow[];
  /** True when rendered as the "empty state" squad-position cards. */
  placeholder?: boolean;
}) {
  const t = useTranslations();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(1);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    const embla = api;
    const sync = () => {
      setCount(embla.scrollSnapList().length);
      setCurrent(embla.selectedScrollSnap() + 1);
    };
    // Initial sync on the next frame — embla measures after mount.
    const raf = requestAnimationFrame(sync);
    embla.on("select", sync);
    embla.on("reInit", sync);
    return () => {
      cancelAnimationFrame(raf);
      embla.off("select", sync);
      embla.off("reInit", sync);
    };
  }, [api]);

  return (
    <Carousel
      setApi={setApi}
      opts={{ align: "start", loop: true }}
      className="relative focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-apg-blue"
      tabIndex={0}
      aria-label={String(t("home.players.title"))}
    >
      <CarouselContent className="-ml-4 pb-2">
        {players.map((player) => (
          <CarouselItem
            key={player.id}
            className="basis-1/2 sm:basis-1/3 lg:basis-1/4"
          >
            <PlayerCard player={player} placeholder={placeholder} />
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Previous — brand glass square, sits just outside the track */}
      <button
        type="button"
        onClick={() => api?.scrollPrev()}
        aria-label={String(t("home.players.prevSlide"))}
        className="apg-focus absolute top-[34%] -left-3 z-10 flex size-11 items-center justify-center border border-ink/15 bg-ink/85 text-white shadow-[0_10px_30px_rgba(7,10,18,0.35)] backdrop-blur-sm transition-colors hover:border-apg-yellow hover:bg-apg-yellow hover:text-ink sm:-left-5"
      >
        <ChevronLeft className="size-5" aria-hidden />
      </button>

      {/* Next */}
      <button
        type="button"
        onClick={() => api?.scrollNext()}
        aria-label={String(t("home.players.nextSlide"))}
        className="apg-focus absolute top-[34%] -right-3 z-10 flex size-11 items-center justify-center border border-ink/15 bg-ink/85 text-white shadow-[0_10px_30px_rgba(7,10,18,0.35)] backdrop-blur-sm transition-colors hover:border-apg-yellow hover:bg-apg-yellow hover:text-ink sm:-right-5"
      >
        <ChevronRight className="size-5" aria-hidden />
      </button>

      {/* Counter + progress — sporty, minimal */}
      <div className="mt-8 flex items-center gap-5">
        <span
          className="font-display text-lg leading-none tracking-[0.14em] text-apg-blue-deep"
          aria-hidden
        >
          {String(current).padStart(2, "0")}
          <span className="mx-1 text-ink/35">/</span>
          <span className="text-ink/50">{String(count).padStart(2, "0")}</span>
        </span>
        <div
          className="h-[3px] flex-1 overflow-hidden bg-ink/10"
          role="progressbar"
          aria-label={String(t("home.players.title"))}
          aria-valuemin={1}
          aria-valuemax={Math.max(count, 1)}
          aria-valuenow={current}
        >
          <span
            className="block h-full bg-apg-yellow transition-[width] duration-300 ease-out"
            style={{
              width: count > 1 ? `${(current / count) * 100}%` : "100%",
            }}
          />
        </div>
        <span className="font-ui text-[11px] font-semibold uppercase tracking-[0.25em] text-ink/40">
          {t("home.players.swipeHint")}
        </span>
      </div>
    </Carousel>
  );
}
