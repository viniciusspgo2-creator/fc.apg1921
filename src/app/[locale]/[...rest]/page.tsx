import { notFound } from "next/navigation";

/**
 * Catch-all under [locale] — any unknown path inside a locale
 * triggers the themed "Hors-jeu !" 404 (brief §9.7).
 */
export default function CatchAllNotFound() {
  notFound();
}
