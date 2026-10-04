"use client";

import { TEXT_SECTIONS } from "@/lib/content-schema";
import { Check, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

/* ============================================================
 * TextsPanel — edit the site copy per language. Values override
 * the locale JSON fallbacks (stored in the SiteText table).
 * Empty value = back to the default translation.
 * ============================================================ */

const LOCALES = [
  { value: "fr", label: "Français (padrão)" },
  { value: "en", label: "English" },
  { value: "de", label: "Deutsch" },
  { value: "pt", label: "Português" },
  { value: "es", label: "Español" },
  { value: "it", label: "Italiano" },
];

export function TextsPanel({
  fallbacks,
}: {
  fallbacks: Record<string, Record<string, string>>;
}) {
  const [locale, setLocale] = useState("fr");
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState<string>("");
  const [busy, setBusy] = useState(false);

  const load = async (loc: string) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/texts?locale=${loc}`, { cache: "no-store" });
      const data = (await res.json()) as { rows: { key: string; value: string }[] };
      const map: Record<string, string> = {};
      for (const r of data.rows ?? []) map[r.key] = r.value;
      setOverrides(map);
      const fb = fallbacks[loc] ?? {};
      const allKeys = TEXT_SECTIONS.flatMap((s) => s.items.map((i) => i.key));
      const d: Record<string, string> = {};
      for (const k of allKeys) d[k] = map[k] ?? fb[k] ?? "";
      setDrafts(d);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    load(locale);
  }, [locale]);

  const save = async (key: string) => {
    setBusy(true);
    try {
      const value = drafts[key] ?? "";
      await fetch("/api/admin/texts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, locale, value }),
      });
      setOverrides((prev) => {
        const next = { ...prev };
        if (value.trim() === "") delete next[key];
        else next[key] = value;
        return next;
      });
      setSaved(key);
      setTimeout(() => setSaved(""), 1600);
    } finally {
      setBusy(false);
    }
  };

  const revert = async (key: string) => {
    setBusy(true);
    try {
      await fetch(
        `/api/admin/texts?key=${encodeURIComponent(key)}&locale=${locale}`,
        { method: "DELETE" },
      );
      await load(locale);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section aria-labelledby="texts-title">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 id="texts-title" className="font-display text-3xl uppercase tracking-wide">
            Textos do site
          </h1>
          <p className="mt-1 text-sm text-white/50">
            Edita os textos por idioma. Campos vazios usam a tradução padrão.
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-white/50">Idioma:</span>
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            className="min-h-11 border border-white/15 bg-black/40 px-3 text-white outline-none focus:border-[#f8e010]"
          >
            {LOCALES.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {busy ? <p className="mt-4 text-xs uppercase tracking-widest text-white/40">A carregar…</p> : null}

      {TEXT_SECTIONS.map((section) => (
        <fieldset key={section.id} className="mt-8 border border-white/10 bg-white/[0.02] p-5">
          <legend className="px-2 text-sm font-bold uppercase tracking-[0.2em] text-[#f8e010]">
            {section.label}
          </legend>
          <div className="grid gap-4">
            {section.items.map((item) => {
              const isOverridden = overrides[item.key] !== undefined;
              return (
                <div key={item.key}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label htmlFor={`f-${item.key}`} className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                      {item.label}
                    </label>
                    <div className="flex items-center gap-2">
                      {isOverridden ? (
                        <span className="border border-[#03a75e]/40 bg-[#03a75e]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#03a75e]">
                          personalizado
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] uppercase tracking-widest text-white/30">
                          padrão
                        </span>
                      )}
                      {isOverridden && (
                        <button
                          type="button"
                          onClick={() => revert(item.key)}
                          title="Voltar ao texto padrão"
                          className="flex size-8 items-center justify-center border border-white/15 text-white/60 hover:border-[#f8e010] hover:text-[#f8e010]"
                        >
                          <RotateCcw className="size-3.5" aria-hidden />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => save(item.key)}
                        disabled={busy}
                        className="flex min-h-9 items-center gap-1.5 bg-[#0052a8] px-3 text-[11px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#002b5c] disabled:opacity-50"
                      >
                        <Check className="size-3.5" aria-hidden />
                        {saved === item.key ? "Guardado" : "Guardar"}
                      </button>
                    </div>
                  </div>
                  {item.multiline ? (
                    <textarea
                      id={`f-${item.key}`}
                      rows={3}
                      value={drafts[item.key] ?? ""}
                      onChange={(e) => setDrafts((d) => ({ ...d, [item.key]: e.target.value }))}
                      className="mt-1.5 w-full border border-white/15 bg-black/40 p-3 text-sm text-white outline-none focus:border-[#f8e010]"
                    />
                  ) : (
                    <input
                      id={`f-${item.key}`}
                      value={drafts[item.key] ?? ""}
                      onChange={(e) => setDrafts((d) => ({ ...d, [item.key]: e.target.value }))}
                      className="mt-1.5 min-h-11 w-full border border-white/15 bg-black/40 px-3 text-sm text-white outline-none focus:border-[#f8e010]"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </fieldset>
      ))}
    </section>
  );
}
