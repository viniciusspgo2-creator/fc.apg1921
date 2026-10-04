import { FlagStripe } from "@/components/brand/flag-stripe";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { Reveal } from "@/components/ui/reveal";
import { getActiveGallery } from "@/lib/content";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/types";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd, buildMetadata, webPageJsonLd } from "@/lib/seo";

/* ============================================================
 * FC APG 1921 — Galeria (DB-driven, 2026)
 * Dark grain header → filterable grid with lightbox. Photos
 * managed in the admin panel (gallery table).
 * ============================================================ */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "gallery" });
  return buildMetadata({
    locale,
    path: "/galeria",
    title: t("title"),
    description: t("subtitle"),
  });
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);
  const t = await getTranslations();
  const items = await getActiveGallery();
  const galleryTitle = t("gallery.title");
  const gallerySubtitle = t("gallery.subtitle");

  return (
    <>
      <JsonLd
        data={
          webPageJsonLd({
            name: galleryTitle,
            description: gallerySubtitle,
            path: "/galeria",
            locale,
            type: "CollectionPage",
            breadcrumb: breadcrumbJsonLd([
              { name: "Accueil", path: "" },
              { name: galleryTitle, path: "/galeria" },
            ]),
          })
        }
      />

      {/* -------------------------------------------- page header */}
      <header className="apg-grain apg-diamonds relative bg-ink">
        <div className="relative z-[2] mx-auto w-full max-w-7xl px-5 pt-28 pb-14 sm:px-8 sm:pt-32 sm:pb-16">
          <Reveal>
            <p className="flex items-center gap-3 font-ui text-sm font-semibold uppercase tracking-[0.35em] text-apg-yellow">
              <span aria-hidden className="inline-block size-2 rotate-45 bg-current" />
              {t("gallery.label")}
            </p>
            <h1 className="mt-4 font-display text-5xl uppercase leading-[0.92] tracking-tight text-white sm:text-6xl lg:text-7xl">
              {t("gallery.title")}
            </h1>
            <FlagStripe className="mt-6 w-24" />
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">
              {t("gallery.subtitle")}
            </p>
          </Reveal>
        </div>
      </header>

      {/* -------------------------------------- filters + grid */}
      <section
        className="apg-diamonds-light bg-paper-soft py-14 sm:py-20"
        aria-label={t("gallery.title")}
      >
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <GalleryGrid items={items} />
          <p className="mt-12 flex items-center justify-center gap-2.5 text-center font-ui text-[11px] uppercase tracking-[0.3em] text-ink/40">
            <span aria-hidden className="inline-block size-1.5 rotate-45 bg-ink/30" />
            {t("gallery.note")}
          </p>
        </div>
      </section>
    </>
  );
}
