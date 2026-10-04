/**
 * Seed — settings, squad, gallery, blog articles and visits.
 * Idempotent: safe to run multiple times.
 *   bun scripts/seed.ts
 */
import { PrismaClient } from "@prisma/client";
import { BLOG_ARTICLES } from "./blog-content";

const db = new PrismaClient();

const dayAt = (offsetDays: number, hour = 15): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};

/* ---------------------------------------------------------- settings */
const SETTINGS: Record<string, string> = {
  "hero.image": "/uploads/club/hero-team.webp",
  "nextMatch.competition": "4ème Ligue — ACGF",
  "nextMatch.opponent": "Adversaire — à confirmer",
  "nextMatch.date": dayAt(5, 15),
  "nextMatch.venue": "home",
  "nextMatch.stadium": "Centre Sportif de Vessy",
  "nextMatch.visible": "true",
  "whatsapp.number": "",
  "contact.email": "contact@fc-apg.ch",
  "contact.trainingPrincipal": "Mardi & jeudi, 19h30",
  "contact.trainingVets": "Vendredi, 20h00",
  "stadium.name": "Centre Sportif de Vessy",
  "stadium.address": "Chemin de Vessy, 1206 Genève",
  "social.instagram": "https://www.instagram.com/fc.apg.1921/",
};

/* ---------------------------------------------------------- gallery */
const GALLERY: { url: string; title: string; category: string }[] = [
  // Club posters (club assets uploaded by the board)
  { url: "/uploads/club/poster-crest-team.webp", title: "L'écusson et la famille", category: "clube" },
  { url: "/uploads/club/poster-team-values.webp", title: "Disciplina · União · Vitória", category: "clube" },
  { url: "/uploads/club/poster-trophy-player.webp", title: "Porter le trophée", category: "clube" },
  { url: "/uploads/club/poster-celebration.webp", title: "Joie de victoire", category: "clube" },
  { url: "/uploads/club/poster-kick-goal.webp", title: "Face au but", category: "clube" },
  { url: "/uploads/club/hero-team.webp", title: "Raçа, garra e paixão", category: "clube" },
  { url: "/uploads/club/banner-wide-1.webp", title: "FC Association des Portugais de Genève", category: "clube" },
  { url: "/uploads/club/banner-wide-2.webp", title: "APG Officiel", category: "clube" },
];

// Illustrative football photos (gallery-XX.webp, 01..22)
const PHOTO_TITLES: [string, string, string][] = [
  ["gallery-01.webp", "Célébration collective", "match"],
  ["gallery-02.webp", "But pour les couleurs", "match"],
  ["gallery-03.webp", "Action de jeu", "match"],
  ["gallery-04.webp", "Duel au milieu", "match"],
  ["gallery-05.webp", "Récupération de balle", "match"],
  ["gallery-06.webp", "Frappe lointaine", "match"],
  ["gallery-07.webp", "Percée sur l'aile", "match"],
  ["gallery-08.webp", "Course vers le but", "match"],
  ["gallery-09.webp", "Tir sous pression", "match"],
  ["gallery-10.webp", "Gardien en pleine volée", "match"],
  ["gallery-11.webp", "Arrêt décisif", "match"],
  ["gallery-12.webp", "Réflexe du gardien", "match"],
  ["gallery-13.webp", "Entraînement du soir", "training"],
  ["gallery-14.webp", "Rond d'échauffement", "training"],
  ["gallery-15.webp", "Exercice technique", "training"],
  ["gallery-16.webp", "Concentration avant le match", "training"],
  ["gallery-17.webp", "Discours de l'entraîneur", "training"],
  ["gallery-18.webp", "Séance de frappes", "training"],
  ["gallery-19.webp", "Le cercle de l'équipe", "training"],
  ["gallery-20.webp", "Supporters au bord du terrain", "community"],
  ["gallery-21.webp", "La famille au stade", "community"],
  ["gallery-22.webp", "Après le coup de sifflet final", "community"],
];
for (const [file, title, category] of PHOTO_TITLES) {
  GALLERY.push({ url: `/uploads/gallery/${file}`, title, category });
}

/* ---------------------------------------------------------- squad (16 cards) */
/** Empty names render as the translated "À confirmer" placeholder —
 *  the board fills real names/photos later in the admin panel. */
const SQUAD: { position: "gk" | "df" | "mf" | "fw"; number: number }[] = [
  { position: "gk", number: 1 },
  { position: "df", number: 2 },
  { position: "df", number: 3 },
  { position: "df", number: 4 },
  { position: "df", number: 5 },
  { position: "mf", number: 6 },
  { position: "fw", number: 7 },
  { position: "fw", number: 9 },
  { position: "mf", number: 8 },
  { position: "mf", number: 10 },
  { position: "fw", number: 11 },
  { position: "gk", number: 12 },
  { position: "df", number: 13 },
  { position: "mf", number: 14 },
  { position: "df", number: 15 },
  { position: "mf", number: 18 },
];

/* Legacy one-off news slugs (pre-SEO blog). Kept here so the seed can
 * clean them up safely without ever touching admin-created posts. */
const LEGACY_SLUGS = [
  "coupe-genevoise-quarts-de-finale",
  "acgf-la-maison-des-clubs-genevois",
  "geneva-cup-les-talents-de-demain",
  "servette-chenois-feminin-reference-genevoise",
  "euro-feminin-heritage-pour-les-clubs",
  "un-site-a-l-image-du-club",
];

/* ---------------------------------------------------------- run */
async function main() {
  for (const [key, value] of Object.entries(SETTINGS)) {
    await db.setting.upsert({
      where: { key },
      create: { key, value },
      update: {}, // never overwrite admin edits
    });
  }
  console.log(`settings: ${Object.keys(SETTINGS).length} ensured`);

  // Squad — only when empty (names/photos are managed in the admin panel).
  const playerCount = await db.player.count();
  if (playerCount === 0) {
    let order = 0;
    for (const p of SQUAD) {
      await db.player.create({
        data: {
          name: "",
          position: p.position,
          number: p.number,
          sortOrder: order++,
          visible: true,
        },
      });
    }
    console.log(`players: ${SQUAD.length} seeded (à confirmer)`);
  } else {
    console.log(`players: ${playerCount} already present — skipped`);
  }

  const galleryCount = await db.galleryImage.count();
  if (galleryCount === 0) {
    let order = 0;
    for (const g of GALLERY) {
      await db.galleryImage.create({
        data: { ...g, sortOrder: order++ },
      });
    }
    console.log(`gallery: ${GALLERY.length} items seeded`);
  } else {
    console.log(`gallery: ${galleryCount} items already present — skipped`);
  }

  for (const a of BLOG_ARTICLES) {
    await db.newsPost.upsert({
      where: { slug: a.slug },
      create: {
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        content: a.content,
        cover: a.cover,
        tag: a.tag,
        sourceUrl: a.sourceUrl,
        keywords: a.keywords,
        author: a.author,
        faq: JSON.stringify(a.faq),
        publishedAt: new Date(a.publishedAt),
        published: true,
      },
      update: {},
    });
  }
  console.log(`news: ${BLOG_ARTICLES.length} articles ensured`);

  const removed = await db.newsPost.deleteMany({
    where: { slug: { in: LEGACY_SLUGS } },
  });
  if (removed.count > 0) console.log(`news: ${removed.count} legacy posts removed`);

  const visits = await db.visit.count();
  console.log(`visits: ${visits} day rows`);
}

main()
  .then(() => db.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
