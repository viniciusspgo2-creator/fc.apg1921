"use client";

import { SETTING_DEFS, type SettingDef } from "@/lib/content-schema";
import { CalendarClock, Check, TriangleAlert, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/* ============================================================
 * SettingsPanel — club configuration. Top: featured "Próximo
 * jogo" card (single grouped save + freshness status computed
 * from nextMatch.date). Below: the remaining settings grouped
 * in small labelled sections with the same per-field save and
 * upload widget as before.
 * ============================================================ */

/** Keys grouped in the featured "Próximo jogo" card (save order). */
const NEXT_MATCH_KEYS = [
  "nextMatch.competition",
  "nextMatch.opponent",
  "nextMatch.date",
  "nextMatch.venue",
  "nextMatch.stadium",
  "nextMatch.visible",
] as const;

/** Small section headings for the remaining generic settings. */
const SETTING_GROUPS: { id: string; label: string; keys: string[] }[] = [
  { id: "hero", label: "Imagem do Hero", keys: ["hero.image"] },
  {
    id: "contact",
    label: "Contacto & Redes",
    keys: ["whatsapp.number", "contact.email", "social.instagram"],
  },
  {
    id: "training",
    label: "Treinos",
    keys: ["contact.trainingPrincipal", "contact.trainingVets"],
  },
  { id: "stadium", label: "Estádio", keys: ["stadium.name", "stadium.address"] },
];

export function SettingsPanel() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const uploadTarget = useRef<string>("hero.image");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/settings", { cache: "no-store" });
      const data = (await res.json()) as { rows: { key: string; value: string }[] };
      const map: Record<string, string> = {};
      for (const r of data.rows ?? []) map[r.key] = r.value;
      setValues(map);
    })();
  }, []);

  const save = async (key: string, value: string) => {
    setBusy(true);
    try {
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      setValues((v) => ({ ...v, [key]: value }));
      setSaved(key);
      setTimeout(() => setSaved(""), 1600);
    } finally {
      setBusy(false);
    }
  };

  /** Single save for the whole featured card (sequential PUTs). */
  const saveNextMatch = async () => {
    setBusy(true);
    try {
      for (const key of NEXT_MATCH_KEYS) {
        await fetch("/api/admin/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key, value: values[key] ?? "" }),
        });
      }
      setSaved("nextMatch");
      setTimeout(() => setSaved(""), 1600);
    } finally {
      setBusy(false);
    }
  };

  const upload = async (file: File) => {
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = (await res.json()) as { ok: boolean; url?: string };
      if (data.ok && data.url) {
        const key = uploadTarget.current;
        await save(key, data.url);
      }
    } finally {
      setBusy(false);
    }
  };

  /** ISO → "YYYY-MM-DDTHH:mm" for datetime-local inputs. */
  const toLocalInput = (iso?: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  /* ------------------------------------------- next match status */
  const dateValue = values["nextMatch.date"] ?? "";
  const parsedDate = dateValue ? new Date(dateValue) : null;
  const matchDate =
    parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate : null;
  const diffMs = matchDate ? matchDate.getTime() - Date.now() : null;

  const status =
    diffMs === null
      ? { kind: "empty" as const }
      : diffMs > 0
        ? {
            kind: "future" as const,
            text:
              Math.floor(diffMs / 86_400_000) >= 1
                ? `Próximo jogo em ${Math.floor(diffMs / 86_400_000)} ${Math.floor(diffMs / 86_400_000) === 1 ? "dia" : "dias"} — aparece no site`
                : `Próximo jogo em ${Math.max(1, Math.floor(diffMs / 3_600_000))}h — aparece no site`,
          }
        : { kind: "past" as const };

  /* -------------------------------------------------- field defs */
  const defsByKey = new Map(SETTING_DEFS.map((d) => [d.key, d]));
  const matchDefs = NEXT_MATCH_KEYS.map((k) => defsByKey.get(k)).filter(
    (d): d is SettingDef => Boolean(d),
  );
  const groupedKeys = new Set<string>([
    ...NEXT_MATCH_KEYS,
    ...SETTING_GROUPS.flatMap((g) => g.keys),
  ]);
  // Safety net: any future SETTING_DEFS entry outside the known groups
  // still renders instead of silently disappearing.
  const leftoverDefs = SETTING_DEFS.filter((d) => !groupedKeys.has(d.key));

  /** Input control for a def — shared by the featured card and the grid. */
  const controlFor = (def: SettingDef) => {
    const value = values[def.key] ?? "";
    if (def.type === "textarea") {
      return (
        <textarea
          id={`s-${def.key}`}
          rows={3}
          value={value}
          onChange={(e) => setValues((v) => ({ ...v, [def.key]: e.target.value }))}
          className="w-full border border-white/15 bg-black/40 p-3 text-sm text-white outline-none focus:border-[#f8e010]"
        />
      );
    }
    if (def.type === "select") {
      return (
        <select
          id={`s-${def.key}`}
          value={value}
          onChange={(e) => setValues((v) => ({ ...v, [def.key]: e.target.value }))}
          className="min-h-11 w-full border border-white/15 bg-black/40 px-3 text-sm text-white outline-none focus:border-[#f8e010]"
        >
          {def.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
    }
    if (def.type === "datetime") {
      return (
        <input
          id={`s-${def.key}`}
          type="datetime-local"
          value={toLocalInput(value)}
          onChange={(e) => {
            const d = e.target.value ? new Date(e.target.value) : null;
            setValues((v) => ({
              ...v,
              [def.key]: d && !Number.isNaN(d.getTime()) ? d.toISOString() : "",
            }));
          }}
          className="min-h-11 w-full border border-white/15 bg-black/40 px-3 text-sm text-white outline-none focus:border-[#f8e010]"
        />
      );
    }
    if (def.type === "image") {
      return (
        <div className="flex flex-wrap items-start gap-4">
          {value ? (
             
            <img
              src={value}
              alt=""
              className="h-28 w-44 border border-white/15 object-cover"
            />
          ) : null}
          <div className="min-w-56 flex-1">
            <input
              id={`s-${def.key}`}
              value={value}
              onChange={(e) => setValues((v) => ({ ...v, [def.key]: e.target.value }))}
              placeholder="/uploads/... ou https://..."
              className="min-h-11 w-full border border-white/15 bg-black/40 px-3 text-sm text-white outline-none focus:border-[#f8e010]"
            />
            <button
              type="button"
              onClick={() => {
                uploadTarget.current = def.key;
                fileRef.current?.click();
              }}
              className="mt-2 flex min-h-10 items-center gap-2 border border-white/15 px-3 text-[11px] font-bold uppercase tracking-widest text-white/70 transition-colors hover:border-[#f8e010] hover:text-[#f8e010]"
            >
              <Upload className="size-3.5" aria-hidden />
              Carregar imagem
            </button>
          </div>
        </div>
      );
    }
    return (
      <input
        id={`s-${def.key}`}
        value={value}
        onChange={(e) => setValues((v) => ({ ...v, [def.key]: e.target.value }))}
        className="min-h-11 w-full border border-white/15 bg-black/40 px-3 text-sm text-white outline-none focus:border-[#f8e010]"
      />
    );
  };

  /** Generic bordered card with per-field save (existing behaviour). */
  const genericCard = (def: SettingDef) => (
    <div
      key={def.key}
      className={`border border-white/10 bg-white/[0.02] p-5 ${def.type === "image" ? "lg:col-span-2" : ""}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label
          htmlFor={`s-${def.key}`}
          className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60"
        >
          {def.label}
        </label>
        <button
          type="button"
          onClick={() => save(def.key, values[def.key] ?? "")}
          disabled={busy}
          className="flex min-h-9 items-center gap-1.5 bg-[#0052a8] px-3 text-[11px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#002b5c] disabled:opacity-50"
        >
          <Check className="size-3.5" aria-hidden />
          {saved === def.key ? "Guardado" : "Guardar"}
        </button>
      </div>
      {def.hint ? (
        <p className="mt-1 text-[11px] text-white/35">{def.hint}</p>
      ) : null}
      <div className="mt-2">{controlFor(def)}</div>
    </div>
  );

  return (
    <section aria-labelledby="settings-title">
      <h1 id="settings-title" className="font-display text-3xl uppercase tracking-wide">
        Configurações
      </h1>
      <p className="mt-1 text-sm text-white/50">
        Próximo jogo, imagem do hero, contacto, redes, treinos e estádio.
      </p>

      {/* -------------------------------- featured: próximo jogo */}
      <div className="mt-8 border border-[#f8e010]/30 bg-white/[0.04] p-6">
        <h2
          id="next-match-title"
          className="font-display text-2xl uppercase tracking-wide"
        >
          ⚽ Próximo jogo
        </h2>

        {/* freshness status computed from nextMatch.date */}
        {status.kind === "empty" ? (
          <p className="mt-2 text-sm text-white/45">Define a data do próximo jogo.</p>
        ) : status.kind === "future" ? (
          <p className="mt-2 flex min-h-11 items-center gap-2 border border-[#03a75e]/50 bg-[#03a75e]/10 px-3 text-sm text-[#03a75e]">
            <CalendarClock className="size-4 shrink-0" aria-hidden />
            {status.text}
          </p>
        ) : (
          <p className="mt-2 flex items-start gap-2 border border-[#f8e010]/40 bg-[#f8e010]/10 p-3 text-sm text-[#f8e010]">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
            Esta data já passou. O cartão fica oculto no site até atualizares o
            próximo jogo.
          </p>
        )}

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {matchDefs.map((def) => (
            <div
              key={def.key}
              className={`grid gap-1.5 content-start ${def.type === "datetime" ? "sm:col-span-2" : ""}`}
            >
              <label
                htmlFor={`s-${def.key}`}
                className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60"
              >
                {def.label}
              </label>
              {def.hint ? (
                <p className="text-[11px] text-white/35">{def.hint}</p>
              ) : null}
              {controlFor(def)}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={saveNextMatch}
            disabled={busy}
            className="flex min-h-11 items-center gap-2 bg-[#0052a8] px-5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#002b5c] disabled:opacity-50"
          >
            <Check className="size-4" aria-hidden />
            {saved === "nextMatch" ? "Guardado" : "Guardar próximo jogo"}
          </button>
        </div>
      </div>

      {/* ------------------------------- grouped generic settings */}
      {SETTING_GROUPS.map((group) => {
        const defs = group.keys
          .map((k) => defsByKey.get(k))
          .filter((d): d is SettingDef => Boolean(d));
        return (
          <div key={group.id} className="mt-10">
            <h2 className="border-l-2 border-[#f8e010] pl-2.5 text-xs font-bold uppercase tracking-[0.2em] text-white/50">
              {group.label}
            </h2>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">{defs.map(genericCard)}</div>
          </div>
        );
      })}

      {/* safety net for defs added to SETTING_DEFS without a group */}
      {leftoverDefs.length > 0 ? (
        <div className="mt-10">
          <h2 className="border-l-2 border-[#f8e010] pl-2.5 text-xs font-bold uppercase tracking-[0.2em] text-white/50">
            Outras configurações
          </h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {leftoverDefs.map(genericCard)}
          </div>
        </div>
      ) : null}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
          e.target.value = "";
        }}
      />
    </section>
  );
}
