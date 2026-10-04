# FC APG 1921 — Site officiel

> **Une histoire. Une passion.** Site web du FC Association des Portugais de Genève (FC APG 1921), fondé le 01.07.1921 — Genève, Suisse.

![Stack](https://img.shields.io/badge/Next.js-16-black) ![TS](https://img.shields.io/badge/TypeScript-strict-blue) ![i18n](https://img.shields.io/badge/locales-6-green)

## Stack (brief §5)

- **Next.js 16 (App Router, RSC, Turbopack)** + TypeScript strict
- **Tailwind CSS 4** + design tokens (`src/styles/tokens.css`) + shadcn/ui
- **next-intl v4** — 6 locales: `fr` (défaut) · `en` · `de` · `pt` · `es` · `it`
- **framer-motion** (UI), **GSAP ScrollTrigger** (timeline), **Lenis** (scroll fluide)
- **tsparticles** (poussière lumineuse du hero), **three / @react-three/fiber** (ballon 3D, desktop only)
- **lottie-web** (animations locales), **Leaflet + CARTO/OSM** (carte sans clé API), **Open-Meteo** (météo sans clé API)
- **react-hook-form + zod** (formulaire → WhatsApp)

## Démarrage

```bash
bun install
cp .env.example .env.local   # renseigner NEXT_PUBLIC_SITE_URL + NEXT_PUBLIC_WHATSAPP_NUMBER
bun run dev                  # http://localhost:3000 (redirige vers /fr, /en… selon le navigateur)
bun run lint                 # ESLint (0 erreur attendu)
bunx tsc --noEmit            # typage strict (0 erreur dans src/)
```

## Structure

```
src/
├─ app/[locale]/          # pages: / (home), /sobre, /galeria, /blog, /blog/[slug],
│                         #         /contato, /mentions-legales, /confidentialite, 404
├─ components/
│  ├─ brand/              # APGLogo (SVG vectoriel), FlagStripe, ShieldClip
│  ├─ layout/             # Header, Footer, LangSwitcher, PageTransition (balle),
│  │                      # InitialLoader, CursorBall, SmoothScroll, CookieBanner
│  ├─ hero/ match/ cards/ gallery/ blog/ contact/ about/ home/ icons/ ui/
├─ data/mock.ts           # ⚠️ UNIQUE source de contenu fictif (isMock + TODO partout)
├─ i18n/                  # routing + request + navigation (next-intl)
├─ locales/               # 6 catalogues, même arbre de clés
├─ lib/                   # weather (Open-Meteo), whatsapp, fonts, utils
├─ hooks/                 # use-media-query, use-countdown
└─ styles/tokens.css      # palette officielle, clip-paths losange, grain, marquee…
scripts/recolor-lottie.ts # snap des couleurs Lottie → palette officielle
public/brand|lottie|images/gallery
```

## Règles de marque (résumé)

- Palette **unique** : `--apg-blue #0052A8`, `--apg-blue-deep #002B5C`, `--apg-yellow #F8E010`, `--apg-green #03A75E`, `--apg-red #DF0629`, `--ink #070A12`, `--paper #FFFFFF`, `--paper-soft #F4F6FA`. Jamais de violet/rose/cyan.
- **Faixa PT** (vert 2 / rouge 3) en signature discrète : séparateurs, soulignements, marqueurs de victoire.
- Le losange de l'écusson est l'ADN du design : `apg-clip-shield/diamond/chamfer/slant`.
- Jaune **jamais** en texte sur fond blanc ; rythme sombre/clair alterné ; `prefers-reduced-motion` respecté partout.

## Contenu fictif (§12)

Tout le contenu non confirmé (joueurs « Joueur 01 », adversaires « FC Adversaire 03 », calendriers relatifs à aujourd'hui, articles, horaires) vit dans **`src/data/mock.ts`** avec `isMock: true` + `TODO: replace with real data`. Un bandeau « contenu fictif » est visible dans le pied de page tant que les données officielles n'arrivent pas. Le formulaire de contact **n'enregistre rien** : il ouvre WhatsApp pré-rempli (`NEXT_PUBLIC_WHATSAPP_NUMBER`).

## i18n

- Les URLs sont préfixées (`/fr`, `/pt`…) ; `/` négocie via `Accept-Language` (fallback `fr`) — voir `src/proxy.ts`.
- Toute nouvelle chaîne passe par les catalogues (`src/locales/*.json`), **même arbre de clés** dans les 6 langues ; zéro texte codé en dur.
- Les noms de routes sont identiques partout (`/sobre`, `/galeria`, `/contato`) — choix d'identité du club.

## SEO & légal (§13)

JSON-LD `SportsTeam` + `SportsEvent` (home) · `sitemap.xml` · `robots.txt` · metadata + hreflang par locale · `opengraph-image` dynamique · pages légales nLPD (Confidentialité) et Mentions légales · bannière cookies légère (aucun traceur).

## Licences des assets

Voir **`ASSETS.md`** (registre complet : logo, Lotties fournis par le club — licence à confirmer —, illustrations, polices, services).
