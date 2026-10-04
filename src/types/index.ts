import type { AppLocale } from "@/i18n/routing";

export type { AppLocale };

/* ============================================================
   FC APG 1921 — Domain types
   Shared by mock data (phase 1) and, later, by CMS/API payloads.
   ============================================================ */

/** Squad categories (ground truth §2). */
export type CategoryId = "principal" | "vet40" | "vet50";

export interface Category {
  id: CategoryId;
  /** League/competition label — ground truth when isMock is false. */
  league: string;
  isMock: boolean;
}

export interface Sponsor {
  id: string;
  name: string;
  tier: "gold" | "silver" | "bronze";
  isMock: boolean;
}

export type ValueIcon = "shield" | "users" | "flame" | "handshake";

export interface ClubValue {
  /** i18n key suffix: about.values.<id> */
  id: string;
  icon: ValueIcon;
}

export interface TimelineMilestone {
  /** i18n key suffix: about.timeline.<id> */
  id: string;
  /** Display date; only ground-truth dates are precise. */
  date: string;
  isMock: boolean;
}

export type PlayerPosition = "GK" | "DF" | "MF" | "FW";

export interface Player {
  id: string;
  name: string;
  number: number;
  position: PlayerPosition;
  category: CategoryId;
  isMock: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  /** i18n key suffix: about.staffRoles.<id> */
  roleId: string;
  category?: CategoryId;
  isMock: boolean;
}

export interface BoardMember {
  id: string;
  name: string;
  /** i18n key suffix: about.boardRoles.<id> */
  roleId: string;
  isMock: boolean;
}

export interface TeamRef {
  id: string;
  name: string;
  shortName: string;
  isMock: boolean;
}

export interface Match {
  id: string;
  category: CategoryId;
  competition: string;
  home: TeamRef;
  away: TeamRef;
  /** ISO datetime */
  date: string;
  stadium: string;
  status: "scheduled" | "finished";
  score?: { home: number; away: number };
  venue: "home" | "away";
  isMock: boolean;
}

export type FormResult = "W" | "D" | "L";

export interface StandingRow {
  position: number;
  team: TeamRef;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  form: FormResult[];
  category: CategoryId;
  isMock: boolean;
}

export type GalleryFilterId = "match" | "training" | "community" | "behind";

export type GalleryAspect = "wide" | "tall" | "square";

export interface GalleryItem {
  id: string;
  /** Placeholder SVG until the club sends real photos (§9.3). */
  src: string;
  /** i18n key suffix: gallery.alts.<id> */
  altKey: string;
  filter: GalleryFilterId;
  aspect: GalleryAspect;
  isMock: boolean;
}

export type ArticleTag = "match-day" | "mercato" | "club" | "communaute";

export interface ArticleMeta {
  slug: string;
  tag: ArticleTag;
  /** ISO datetime */
  date: string;
  readingMinutes: number;
  isHero: boolean;
  isMock: boolean;
}

/** WMO weather interpretation code (Open-Meteo compatible). */
export interface WeatherInfo {
  temperatureC: number;
  code: number;
  isMock: boolean;
}

export type ContactSubjectId = "play" | "sponsorship" | "press" | "info";
