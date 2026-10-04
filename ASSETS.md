# ASSETS — origin & license register

Every external asset used by the site is registered here (brief §10 / DoD).
Client-provided files are marked as such; their license must be confirmed
with the club before public launch.

## Brand

| Asset | Source | Author / Owner | License | Notes |
| --- | --- | --- | --- | --- |
| `public/brand/apg-logo.png` | Provided by the client (upload) | FC APG 1921 | Club property | Original crest raster, master reference |
| `public/brand/apg-logo.svg` | Redrawn in-house from the client PNG | FC APG 1921 | Club property | Vector redraw — fidelity reviewed against the PNG |
| `public/brand/apg-logo-mono.svg` | Redrawn in-house | FC APG 1921 | Club property | White monochrome variant for dark backgrounds |
| `public/brand/favicon-32.png` | Generated from `apg-logo.png` (sharp) | FC APG 1921 | Club property | 32×32 |
| `public/brand/favicon-180.png` | Generated from `apg-logo.png` (sharp) | FC APG 1921 | Club property | 180×180, white background (Apple touch icon) |
| `public/brand/favicon-512.png` | Generated from `apg-logo.png` (sharp) | FC APG 1921 | Club property | 512×512 |

## Motion (Lottie)

| Asset | Source | Author / Owner | License | Notes |
| --- | --- | --- | --- | --- |
| `public/lottie/balancing-football.json` | Provided by the client (upload) | Unknown (LottieFiles Creator export) | ⚠️ To confirm with the club | Football balancing loop — **recolored to the official palette (Fase 6, `scripts/recolor-lottie.ts`)**; used on the 404 page |
| `public/lottie/soccer-player-kick.json` | Provided by the client (upload) | Unknown (LottieFiles Creator export) | ⚠️ To confirm with the club | Football player kick loop — **recolored to the official palette (Fase 6)**; reserved for upcoming "match day" sections |

Recolor rule (§10): both files were snapped to the 8 official brand tokens
via `scripts/recolor-lottie.ts` (idempotent). Fallback rule: any icon whose
license cannot be confirmed gets replaced by an in-house animated SVG
(Framer Motion path drawing).

## Gallery placeholders (Fase 4-b)

| Asset | Source | License | Notes |
| --- | --- | --- | --- |
| `public/images/gallery/g01.svg` … `g12.svg` | Generated in-house (club-coloured flat illustrations) | Club property | Placeholder art until the club sends real photos — swap files + `data/mock.ts` |

## Fonts (served via `next/font/google`, self-hosted at build time)

| Asset | Source | License |
| --- | --- | --- |
| Bebas Neue | Google Fonts | SIL Open Font License 1.1 |
| Barlow Condensed | Google Fonts | SIL Open Font License 1.1 |
| Inter | Google Fonts | SIL Open Font License 1.1 |

## Maps & data services (no API key)

| Service | Usage | Terms |
| --- | --- | --- |
| Open-Meteo | Weather widget on the home hero | CC-BY 4.0 (attribution in code + privacy page) |
| OpenStreetMap / CARTO dark basemap | Leaflet map on the contact page | ODbL / CARTO terms (attribution rendered on the map) |
| Leaflet | Map library | BSD-2-Clause |

## Icons

| Asset | Source | License |
| --- | --- | --- |
| lucide-react | https://lucide.dev | ISC |

---

# 2026 Redesign — institutional edition (Fase 7)

## Club assets (provided by the board, upload session 03.10)

| Asset | Source | Owner | License | Used as |
| --- | --- | --- | --- | --- |
| `public/uploads/club/hero-team.webp` | Client upload (`HEADER.png`), optimized w/ sharp (1920w) | FC APG 1921 | Club property | **Hero background** (also seedable in /admin) |
| `public/uploads/club/banner-wide-1.webp` | Client upload, optimized (1600w) | FC APG 1921 | Club property | Gallery + news cover |
| `public/uploads/club/banner-wide-2.webp` | Client upload, optimized (1600w) | FC APG 1921 | Club property | Gallery |
| `public/uploads/club/poster-crest-team.webp` | Client upload, optimized (1200w) | FC APG 1921 | Club property | Sobre "today" + gallery |
| `public/uploads/club/poster-team-values.webp` | Client upload, optimized (1200w) | FC APG 1921 | Club property | Home "team photo" section + gallery |
| `public/uploads/club/poster-trophy-player.webp` | Client upload, optimized (1200w) | FC APG 1921 | Club property | Gallery |
| `public/uploads/club/poster-celebration.webp` | Client upload, optimized (1200w) | FC APG 1921 | Club property | Sobre + gallery |
| `public/uploads/club/poster-kick-goal.webp` | Client upload, optimized (1200w) | FC APG 1921 | Club property | Gallery |
| `public/brand/apg-logo-original.png` | Client upload (Photoroom cut-out), trimmed 512w | FC APG 1921 | Club property | **Header / footer / login logo — the ORIGINAL crest** |
| `public/brand/favicon-{32,180,512}.png` | Generated from the original cut-out (sharp) | FC APG 1921 | Club property | Favicons (replaced the redrawn SVG set) |

## Illustrative gallery photos

| Asset | Source | Owner | License | Notes |
| --- | --- | --- | --- | --- |
| `public/uploads/gallery/gallery-01..22.webp` | ZAI image-search (web), re-hosted → downloaded & converted to WebP (1400w, q76) | Various photographers | ⚠️ **Illustrative placeholders — replace with real club photos before launch** | Amateur football: goals, saves, action, training, fans. Admin-managed via /admin → Galeria & Mídia |

## Regional news (blog seed)

Six posts seeded in the DB (admin-editable). Five summarise REAL regional
sources, each carrying its `sourceUrl` credit:

- acgf.ch (coupe genevoise match center) · geneve-football.ch (ACGF presentation)
- genevacup.ch (U16 tournament) · ge.ch (Servette Chênois féminin) · football.ch (ASF WEURO-Legacy)

The sixth post ("Un site à l'image du club") is club-authored copy.

## Media uploads (runtime)

`/api/admin/upload` converts any admin upload to WebP (≤1920w) and stores it
in `public/uploads/media/`. Files added at runtime are served by the dev
server; in production, serve `public/` from persistent storage (or point the
admin to an external URL / CDN).
