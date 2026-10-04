"use client";

import { GalleryPanel } from "@/components/admin/gallery-panel";
import { NewsPanel } from "@/components/admin/news-panel";
import { PlayersPanel } from "@/components/admin/players-panel";
import { SettingsPanel } from "@/components/admin/settings-panel";
import { TextsPanel } from "@/components/admin/texts-panel";
import { VisitsPanel } from "@/components/admin/visits-panel";
import {
  CalendarDays,
  ExternalLink,
  FileText,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Newspaper,
  Settings,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

/* ============================================================
 * AdminApp — SPA shell with sidebar tabs (PT-BR operator UI).
 * Tabs: Painel (visits) · Textos · Configurações · Plantel ·
 * Galeria · Notícias. Full content control for the public site.
 * ============================================================ */

type TabId = "dashboard" | "texts" | "settings" | "players" | "gallery" | "news";

const TABS: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "dashboard", label: "Visitas", icon: LayoutDashboard },
  { id: "texts", label: "Textos", icon: FileText },
  { id: "settings", label: "Configurações", icon: Settings },
  { id: "players", label: "Plantel", icon: Users },
  { id: "gallery", label: "Galeria & Mídia", icon: ImageIcon },
  { id: "news", label: "Notícias", icon: Newspaper },
];

export function AdminApp({
  fallbacks,
  passwordIsDefault,
}: {
  fallbacks: Record<string, Record<string, string>>;
  passwordIsDefault: boolean;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<TabId>("dashboard");

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* ------------------------------------------------ sidebar */}
      <aside className="border-b border-white/10 bg-[#070a12] lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between p-4 lg:block">
          <div className="flex items-center gap-3">
            <img
              src="/brand/apg-logo-original.png"
              alt=""
              className="h-10 w-10 object-contain"
            />
            <div>
              <p className="font-display text-lg uppercase leading-none tracking-wide">
                Painel APG
              </p>
              <p className="mt-0.5 text-[11px] uppercase tracking-[0.2em] text-white/40">
                FC APG 1921
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            aria-label="Terminar sessão"
            title="Terminar sessão"
            className="flex size-10 items-center justify-center border border-white/15 text-white/70 transition-colors hover:border-[#ff6b7a] hover:text-[#ff6b7a] lg:hidden"
          >
            <LogOut className="size-4" aria-hidden />
          </button>
        </div>

        <nav aria-label="Secções do painel" className="px-3 pb-4 lg:mt-2">
          <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
            {TABS.map(({ id, label, icon: Icon }) => {
              const active = tab === id;
              return (
                <li key={id} className="shrink-0 lg:shrink">
                  <button
                    type="button"
                    onClick={() => setTab(id)}
                    aria-current={active ? "true" : undefined}
                    className={`flex min-h-11 w-full items-center gap-2.5 px-3 text-sm font-semibold transition-colors ${
                      active
                        ? "bg-[#f8e010] text-[#070a12]"
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden />
                    {label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden px-4 pb-6 lg:block">
          <a
            href="/fr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-10 items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/45 transition-colors hover:text-[#f8e010]"
          >
            <ExternalLink className="size-3.5" aria-hidden />
            Ver o site
          </a>
          <button
            type="button"
            onClick={logout}
            className="mt-3 flex min-h-10 items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/45 transition-colors hover:text-[#ff6b7a]"
          >
            <LogOut className="size-3.5" aria-hidden />
            Terminar sessão
          </button>
          <p className="mt-6 flex items-start gap-2 border border-white/10 bg-white/[0.03] p-3 text-[11px] leading-relaxed text-white/40">
            <CalendarDays className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            As alterações aparecem no site imediatamente após recarregar a página.
          </p>
        </div>
      </aside>

      {/* --------------------------------------------------- main */}
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        {passwordIsDefault ? (
          <p className="mb-6 border border-[#f8e010]/40 bg-[#f8e010]/10 p-4 text-sm text-[#f8e010]">
            A senha do painel é a padrão (<code className="font-mono">apg1921</code>). Define{" "}
            <code className="font-mono">ADMIN_PASSWORD</code> no ficheiro{" "}
            <code className="font-mono">.env</code> antes de publicar o site.
          </p>
        ) : null}

        {tab === "dashboard" && <VisitsPanel />}
        {tab === "texts" && <TextsPanel fallbacks={fallbacks} />}
        {tab === "settings" && <SettingsPanel />}
        {tab === "players" && <PlayersPanel />}
        {tab === "gallery" && <GalleryPanel />}
        {tab === "news" && <NewsPanel />}
      </main>
    </div>
  );
}
