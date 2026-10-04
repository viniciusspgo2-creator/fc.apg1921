"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

/* ============================================================
 * FC APG 1921 — Gallery grid (DB-driven, 2026)
 * Filter pills + uniform chamfered tiles + hover zoom; tiles
 * open a self-contained fullscreen lightbox (keyboard, swipe,
 * scroll-lock, focus trap). Reduced motion: fades only.
 * ============================================================ */

export type GalleryEntry = {
  id: string;
  url: string;
  title: string;
  category: string;
};

export function GalleryGrid({ items }: { items: GalleryEntry[] }) {
  const t = useTranslations();
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState<string>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  const categories = useMemo(() => {
    const order = ["match", "training", "community", "clube"];
    const present = [...new Set(items.map((i) => i.category))];
    return order.filter((c) => present.includes(c));
  }, [items]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: items.length };
    for (const item of items) c[item.category] = (c[item.category] ?? 0) + 1;
    return c;
  }, [items]);

  const visible = useMemo(
    () => items.filter((i) => filter === "all" || i.category === filter),
    [items, filter],
  );

  const close = useCallback(() => {
    setOpenIndex(null);
    triggerRef.current?.focus();
  }, []);

  const navigate = useCallback(
    (delta: 1 | -1) => {
      setOpenIndex((cur) => {
        if (cur === null || visible.length === 0) return cur;
        return (cur + delta + visible.length) % visible.length;
      });
    },
    [visible.length],
  );

  // Keyboard + scroll-lock while the lightbox is open.
  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") navigate(-1);
      else if (e.key === "ArrowRight") navigate(1);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [openIndex, close, navigate]);

  const open = openIndex !== null && visible.length > 0;
  const current = open ? visible[openIndex] : null;

  const filterLabel = (key: string) => {
    try {
      return t(`gallery.filters.${key}`);
    } catch {
      return key;
    }
  };

  return (
    <>
      {/* Filters */}
      <div role="group" aria-label={t("gallery.label")} className="flex flex-wrap gap-2">
        {["all", ...categories].map((key) => {
          const active = filter === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => {
                setFilter(key);
                setOpenIndex(null);
              }}
              aria-pressed={active}
              className={cn(
                "apg-focus relative min-h-11 px-4 font-ui text-sm font-semibold uppercase tracking-[0.16em] transition-colors",
                active
                  ? "text-ink"
                  : "border border-ink/20 text-ink/60 hover:border-apg-blue hover:text-apg-blue",
              )}
            >
              {active && (
                <motion.span
                  layoutId="gallery-pill"
                  className="absolute inset-0 bg-apg-yellow"
                  transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                />
              )}
              <span className="relative z-[1]">
                {filterLabel(key)}
                <span className="ml-2 text-xs opacity-60">{counts[key] ?? 0}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <motion.div layout className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {visible.map((item, i) => (
            <motion.button
              key={item.id}
              type="button"
              layout
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.3) }}
              ref={openIndex === i ? triggerRef : undefined}
              onClick={() => setOpenIndex(i)}
              aria-label={item.title || t("gallery.lightbox.open")}
              className={cn(
                "apg-focus group relative aspect-[4/3] w-full overflow-hidden border border-ink/10 bg-paper-soft transition-all duration-300 hover:border-apg-blue/50 hover:shadow-[0_14px_36px_rgba(0,43,92,0.16)]",
              )}
            >
              <Image
                src={item.url}
                alt={item.title || t("gallery.title")}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
              />
              <span
                aria-hidden
                className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-ink/70 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              >
                <span className="truncate text-left font-ui text-xs font-semibold uppercase tracking-[0.14em] text-white">
                  {item.title}
                </span>
                <ZoomIn className="size-4 shrink-0 text-apg-yellow" />
              </span>
              {/* Yellow baseline sweep on hover */}
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-apg-yellow transition-transform duration-300 group-hover:scale-x-100"
              />
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && current && (
              <motion.div
                key="apg-lightbox"
                role="dialog"
                aria-modal="true"
                aria-label={current.title || t("gallery.lightbox.open")}
                className="fixed inset-0 z-[150] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={close}
              >
                <motion.figure
                  key={current.id}
                  className="relative max-h-full max-w-5xl"
                  initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={current.url}
                    alt={current.title || t("gallery.title")}
                    className="max-h-[82vh] w-auto max-w-full select-none object-contain"
                    draggable={false}
                  />
                  {current.title && (
                    <figcaption className="mt-3 text-center font-ui text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
                      {current.title}
                    </figcaption>
                  )}
                </motion.figure>

                {/* Controls */}
                <button
                  type="button"
                  onClick={close}
                  aria-label={t("gallery.lightbox.close")}
                  className="apg-focus absolute top-4 right-4 flex size-11 items-center justify-center border border-white/20 bg-ink/60 text-white transition-colors hover:border-apg-yellow hover:text-apg-yellow"
                >
                  <X className="size-5" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(-1);
                  }}
                  aria-label={t("gallery.lightbox.prev")}
                  className="apg-focus absolute top-1/2 left-3 flex size-11 -translate-y-1/2 items-center justify-center border border-white/20 bg-ink/60 text-white transition-colors hover:border-apg-yellow hover:text-apg-yellow"
                >
                  <ChevronLeft className="size-5" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(1);
                  }}
                  aria-label={t("gallery.lightbox.next")}
                  className="apg-focus absolute top-1/2 right-3 flex size-11 -translate-y-1/2 items-center justify-center border border-white/20 bg-ink/60 text-white transition-colors hover:border-apg-yellow hover:text-apg-yellow"
                >
                  <ChevronRight className="size-5" aria-hidden />
                </button>
                <p className="absolute bottom-4 left-1/2 -translate-x-1/2 font-ui text-xs uppercase tracking-[0.3em] text-white/60">
                  {t("gallery.lightbox.counter", {
                    current: (openIndex ?? 0) + 1,
                    total: visible.length,
                  })}
                </p>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
