/* ============================================================
 * Editable-content contracts shared by the admin panel and APIs.
 * Keys mirror the locale JSON tree (src/locales/*.json) — the DB
 * value overrides the JSON fallback when present.
 * ============================================================ */

export type TextDef = {
  key: string;
  label: string; // PT-BR admin label
  multiline?: boolean;
};

export type TextSection = {
  id: string;
  label: string;
  items: TextDef[];
};

export const TEXT_SECTIONS: TextSection[] = [
  {
    id: "hero",
    label: "Hero (topo da home)",
    items: [
      { key: "hero.titleLine1", label: "Título — linha 1" },
      { key: "hero.titleLine2", label: "Título — linha 2" },
      { key: "hero.subtitle", label: "Subtítulo", multiline: true },
    ],
  },
  {
    id: "home.intro",
    label: "Apresentação (home)",
    items: [
      { key: "home.intro.title", label: "Título" },
      { key: "home.intro.text", label: "Texto", multiline: true },
      { key: "home.intro.signature", label: "Assinatura (APG — Depuis 1921.)" },
      { key: "home.intro.cta", label: "Botão" },
    ],
  },
  {
    id: "home.sponsor",
    label: "Patrocínio (home)",
    items: [
      { key: "home.sponsor.kicker", label: "Etiqueta" },
      { key: "home.sponsor.title", label: "Título" },
      { key: "home.sponsor.text", label: "Texto", multiline: true },
      { key: "home.sponsor.cta", label: "Botão" },
    ],
  },
  {
    id: "home.players",
    label: "Plantel (home — cards)",
    items: [
      { key: "home.players.title", label: "Título" },
      { key: "home.players.subtitle", label: "Subtítulo", multiline: true },
    ],
  },
  {
    id: "home.teamPhoto",
    label: "Foto da equipa (home)",
    items: [
      { key: "home.teamPhoto.title", label: "Título" },
      { key: "home.teamPhoto.text", label: "Texto", multiline: true },
      { key: "home.teamPhoto.cta", label: "Botão" },
    ],
  },
  {
    id: "home.membership",
    label: "CTA — Fazer parte (home)",
    items: [
      { key: "home.membership.title", label: "Título" },
      { key: "home.membership.text", label: "Texto", multiline: true },
      { key: "home.membership.cta", label: "Botão" },
    ],
  },
  {
    id: "about",
    label: "Página Sobre",
    items: [
      { key: "about.title", label: "Título" },
      { key: "about.subtitle", label: "Subtítulo", multiline: true },
      { key: "about.today.text1", label: "O clube hoje — texto 1", multiline: true },
      { key: "about.today.text2", label: "O clube hoje — texto 2", multiline: true },
    ],
  },
  {
    id: "footer",
    label: "Rodapé",
    items: [{ key: "footer.tagline", label: "Frase do rodapé" }],
  },
];

export type SettingDef = {
  key: string;
  label: string;
  hint?: string;
  type: "text" | "textarea" | "datetime" | "select" | "image";
  options?: { value: string; label: string }[];
};

export const SETTING_DEFS: SettingDef[] = [
  {
    key: "hero.image",
    label: "Imagem de fundo do Hero",
    hint: "URL da imagem (upload na aba Mídia ou caminho /uploads/...)",
    type: "image",
  },
  {
    key: "nextMatch.competition",
    label: "Próximo jogo — competição",
    type: "text",
  },
  {
    key: "nextMatch.opponent",
    label: "Próximo jogo — adversário",
    type: "text",
  },
  {
    key: "nextMatch.date",
    label: "Próximo jogo — data e hora",
    hint: "Formato: 2026-01-31T15:00 (hora local Genebra)",
    type: "datetime",
  },
  {
    key: "nextMatch.venue",
    label: "Próximo jogo — mando",
    type: "select",
    options: [
      { value: "home", label: "Em casa" },
      { value: "away", label: "Fora" },
    ],
  },
  {
    key: "nextMatch.stadium",
    label: "Próximo jogo — estádio",
    type: "text",
  },
  {
    key: "nextMatch.visible",
    label: "Mostrar próximo jogo no hero",
    type: "select",
    options: [
      { value: "true", label: "Sim" },
      { value: "false", label: "Não" },
    ],
  },
  {
    key: "whatsapp.number",
    label: "WhatsApp (só números, com código do país)",
    hint: "Ex.: 41791234567 — deixa vazio para mostrar aviso de mock",
    type: "text",
  },
  {
    key: "contact.email",
    label: "Email do clube",
    type: "text",
  },
  {
    key: "contact.trainingPrincipal",
    label: "Treinos — Equipa Principal",
    hint: "Ex.: Terça e quinta, 19h30",
    type: "text",
  },
  {
    key: "contact.trainingVets",
    label: "Treinos — Veteranos",
    hint: "Ex.: Sexta, 20h00",
    type: "text",
  },
  {
    key: "stadium.name",
    label: "Estádio — nome",
    type: "text",
  },
  {
    key: "stadium.address",
    label: "Estádio — endereço",
    type: "text",
  },
  {
    key: "social.instagram",
    label: "Instagram (URL completa)",
    type: "text",
  },
];

export const GALLERY_CATEGORIES = [
  { value: "match", label: "Jogos" },
  { value: "training", label: "Treinos" },
  { value: "community", label: "Comunidade" },
  { value: "clube", label: "Clube / Cartazes" },
] as const;

export const NEWS_TAGS = [
  { value: "match-day", label: "Match Day" },
  { value: "mercato", label: "Mercado" },
  { value: "club", label: "Clube" },
  { value: "communaute", label: "Comunidade" },
  { value: "regional", label: "Regional" },
] as const;

/** Squad positions — matches the Player.position values in Prisma. */
export const PLAYER_POSITIONS = [
  { value: "gk", label: "Guarda-redes" },
  { value: "df", label: "Defesa" },
  { value: "mf", label: "Médio" },
  { value: "fw", label: "Avançado" },
] as const;

export type PlayerPosition = (typeof PLAYER_POSITIONS)[number]["value"];

/** Type guard used by the players API for strict validation. */
export function isPlayerPosition(value: unknown): value is PlayerPosition {
  return (
    typeof value === "string" &&
    PLAYER_POSITIONS.some((p) => p.value === value)
  );
}
