"use client";

/* ============================================================
 * FC APG 1921 — Leaflet map (brief §9.5)
 *
 * DARK tiles from CARTO (no API key needed). Loaded ONLY via
 * next/dynamic({ ssr: false }) — Leaflet touches `window` and
 * breaks SSR otherwise. The contact-info wrapper owns that
 * dynamic import; this module is client-only by design.
 *
 * Unmount: react-leaflet's MapContainer returns a cleanup that
 * calls map.remove() (verified in react-leaflet/lib/MapContainer),
 * so no map instance leaks between navigations.
 * ============================================================ */

import "leaflet/dist/leaflet.css";

import { CLUB } from "@/data/mock";
import L from "leaflet";
import { Navigation } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

/* Marker — yellow diamond (club crest DNA) with deep-blue border
 * and core, drawn as inline HTML so no image assets are needed.
 * A custom className replaces `leaflet-div-icon` to drop the
 * default white box around the icon. */
const MARKER_CLASS = "apg-leaf-marker";
const MARKER_HTML =
  '<div style="position:relative;width:24px;height:24px;margin:3px 0 0 3px;' +
  "background:#f8e010;border:2px solid #002b5c;transform:rotate(45deg);" +
  'box-shadow:0 0 0 2px rgba(255,255,255,0.9),0 6px 14px rgba(0,0,0,0.45);">' +
  '<div style="position:absolute;inset:8px;background:#002b5c;"></div></div>';

/** Wide "mapinha" of Geneva — pin stays on the club ground. */
const GENEVA_CENTER: [number, number] = [46.2044, 6.1432];
const CLUB_PIN: [number, number] = [CLUB.stadium.lat, CLUB.stadium.lng];

const ITINERARY_URL = `https://www.google.com/maps/dir/?api=1&destination=${CLUB.stadium.lat}%2C${CLUB.stadium.lng}`;

export default function ClubMap() {
  const t = useTranslations("contact");

  // Stable across renders; the map is only mounted once per page view.
  const clubIcon = useMemo(
    () =>
      L.divIcon({
        className: MARKER_CLASS,
        html: MARKER_HTML,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -16],
      }),
    [],
  );

  return (
    <div className="border border-white/10 bg-ink shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
      <div className="apg-diamonds bg-ink p-5 sm:p-6">
        <div className="relative z-[2] flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-2.5 font-ui text-sm font-semibold uppercase tracking-[0.25em] text-white">
            <span aria-hidden className="inline-block size-2 rotate-45 bg-apg-yellow" />
            {t("info.mapTitle")}
          </p>
          <a
            href={ITINERARY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="apg-focus inline-flex min-h-11 items-center gap-2 bg-apg-yellow px-4 font-ui text-xs font-semibold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-white"
          >
            <Navigation className="size-4" aria-hidden />
            {t("info.itinerary")}
          </a>
        </div>

        <div className="relative z-[2] mt-4 h-[380px] overflow-hidden border border-white/10">
          <MapContainer
            center={GENEVA_CENTER}
            zoom={12}
            scrollWheelZoom={false}
            className="apg-map-dark h-full w-full bg-ink"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={CLUB_PIN} icon={clubIcon}>
              <Popup>
                <div className="min-w-44 p-1">
                  <p className="font-display text-lg leading-tight tracking-wide text-apg-blue-deep">
                    {CLUB.stadium.name}
                  </p>
                  <p className="mt-1 text-xs leading-snug text-ink/70">
                    {CLUB.stadium.address}
                  </p>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
