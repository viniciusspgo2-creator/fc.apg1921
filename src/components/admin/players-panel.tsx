"use client";

import { PLAYER_POSITIONS } from "@/lib/content-schema";
import { Eye, EyeOff, Pencil, Plus, Shirt, Trash2, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/* ============================================================
 * PlayersPanel — "Plantel" management (squad shown as cards on
 * the home page). Inline create/edit form, visibility toggle,
 * photo upload via /api/admin/upload. PT-BR operator UI.
 * ============================================================ */

type PlayerRow = {
  id: string;
  name: string;
  position: string;
  number: number | null;
  photoUrl: string;
  sortOrder: number;
  visible: boolean;
};

type PlayerForm = {
  id: string;
  name: string;
  position: string;
  number: string; // kept as string for the input; "" = unset
  photoUrl: string;
  sortOrder: string;
  visible: boolean;
};

const EMPTY_FORM: PlayerForm = {
  id: "",
  name: "",
  position: "mf",
  number: "",
  photoUrl: "",
  sortOrder: "0",
  visible: true,
};

/** Row value → editable form value (numbers as strings for inputs). */
function toForm(row: PlayerRow): PlayerForm {
  return {
    id: row.id,
    name: row.name,
    position: row.position,
    number: row.number === null ? "" : String(row.number),
    photoUrl: row.photoUrl,
    sortOrder: String(row.sortOrder),
    visible: row.visible,
  };
}

function positionLabel(value: string): string {
  return PLAYER_POSITIONS.find((p) => p.value === value)?.label ?? value;
}

export function PlayersPanel() {
  const [rows, setRows] = useState<PlayerRow[]>([]);
  const [form, setForm] = useState<PlayerForm | null>(null); // null = form closed
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/players", { cache: "no-store" });
      const data = (await res.json()) as { rows?: PlayerRow[] };
      setRows(data.rows ?? []);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  /** Build the JSON payload from the form ("" number → null). */
  const payload = () => ({
    name: form?.name.trim() ?? "",
    position: form?.position ?? "mf",
    number: form?.number === "" ? null : Number(form?.number),
    photoUrl: form?.photoUrl.trim() ?? "",
    sortOrder: Number(form?.sortOrder === "" ? 0 : form?.sortOrder),
    visible: form?.visible ?? true,
  });

  const save = async () => {
    if (!form) return;
    setBusy(true);
    try {
      const isEdit = Boolean(form.id);
      const res = await fetch("/api/admin/players", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isEdit ? { id: form.id, ...payload() } : payload()),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!data.ok) {
        window.alert(data.error ?? "Falha ao guardar o jogador.");
        return;
      }
      setForm(null);
      await load();
    } finally {
      setBusy(false);
    }
  };

  const toggleVisible = async (row: PlayerRow) => {
    setBusy(true);
    try {
      await fetch("/api/admin/players", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: row.id, visible: !row.visible }),
      });
      await load();
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Eliminar este jogador?")) return;
    setBusy(true);
    try {
      await fetch(`/api/admin/players?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      await load();
    } finally {
      setBusy(false);
    }
  };

  const uploadPhoto = async (file: File) => {
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = (await res.json()) as { ok: boolean; url?: string };
      if (data.ok && data.url) {
        setForm((f) => (f ? { ...f, photoUrl: data.url as string } : f));
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <section aria-labelledby="players-title">
      {/* ------------------------------------------------ header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 id="players-title" className="font-display text-3xl uppercase tracking-wide">
            Plantel
          </h1>
          <p className="mt-1 text-sm text-white/50">
            Os jogadores aparecem como cards na página inicial.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setForm({ ...EMPTY_FORM })}
          className="flex min-h-11 items-center gap-2 bg-[#f8e010] px-4 text-xs font-bold uppercase tracking-widest text-[#070a12] transition-colors hover:bg-white"
        >
          <Plus className="size-4" aria-hidden />
          Novo jogador
        </button>
      </div>

      {/* ------------------------------------------- inline form */}
      {form ? (
        <div className="mt-6 border border-[#f8e010]/30 bg-white/[0.04] p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-xl uppercase tracking-wide">
              {form.id ? "Editar jogador" : "Novo jogador"}
            </h2>
            <button
              type="button"
              onClick={() => setForm(null)}
              aria-label="Fechar formulário"
              className="flex size-10 items-center justify-center border border-white/15 text-white/60 transition-colors hover:border-[#ff6b7a] hover:text-[#ff6b7a]"
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
              Nome
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="min-h-11 border border-white/15 bg-black/40 px-3 text-sm font-normal normal-case tracking-normal text-white outline-none focus:border-[#f8e010]"
              />
            </label>

            <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
              Posição
              <select
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
                className="min-h-11 border border-white/15 bg-black/40 px-3 text-sm font-normal normal-case tracking-normal text-white outline-none focus:border-[#f8e010]"
              >
                {PLAYER_POSITIONS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
              Número (opcional)
              <input
                type="number"
                min={1}
                max={99}
                value={form.number}
                onChange={(e) => setForm({ ...form, number: e.target.value })}
                className="min-h-11 border border-white/15 bg-black/40 px-3 text-sm font-normal normal-case tracking-normal text-white outline-none focus:border-[#f8e010]"
              />
            </label>

            <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
              Ordem
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
                className="min-h-11 border border-white/15 bg-black/40 px-3 text-sm font-normal normal-case tracking-normal text-white outline-none focus:border-[#f8e010]"
              />
            </label>

            <div className="grid gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/60 sm:col-span-2">
              Foto
              <div className="flex flex-wrap items-center gap-3">
                {form.photoUrl ? (
                   
                  <img
                    src={form.photoUrl}
                    alt=""
                    className="h-14 w-14 border border-white/15 object-cover"
                  />
                ) : null}
                <input
                  value={form.photoUrl}
                  onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
                  placeholder="/uploads/... ou https://..."
                  className="min-h-11 min-w-48 flex-1 border border-white/15 bg-black/40 px-3 text-sm font-normal normal-case tracking-normal text-white outline-none focus:border-[#f8e010]"
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex min-h-11 items-center gap-2 border border-white/15 px-3 text-[11px] font-bold uppercase tracking-widest text-white/70 transition-colors hover:border-[#f8e010] hover:text-[#f8e010]"
                >
                  <Upload className="size-3.5" aria-hidden />
                  Carregar imagem
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-white/70 sm:col-span-2">
              <input
                type="checkbox"
                checked={form.visible}
                onChange={(e) => setForm({ ...form, visible: e.target.checked })}
                className="size-4 accent-[#f8e010]"
              />
              Visível (o card aparece no site)
            </label>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setForm(null)}
              className="min-h-11 border border-white/15 px-4 text-xs font-bold uppercase tracking-widest text-white/60 transition-colors hover:border-white/40"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={save}
              disabled={busy || !form.name.trim()}
              className="min-h-11 bg-[#0052a8] px-5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#002b5c] disabled:opacity-50"
            >
              {busy ? "A guardar…" : "Guardar"}
            </button>
          </div>
        </div>
      ) : null}

      {/* -------------------------------------------------- list */}
      {busy && rows.length === 0 ? (
        <p className="mt-6 text-xs uppercase tracking-widest text-white/40">A carregar…</p>
      ) : rows.length === 0 ? (
        <p className="mt-6 border border-dashed border-white/15 bg-white/[0.02] p-6 text-sm text-white/50">
          Nenhum jogador ainda. Adiciona o primeiro — os cards aparecem logo na página inicial.
        </p>
      ) : (
        <ul className="mt-6 grid gap-3">
          {rows.map((row) => (
            <li
              key={row.id}
              className="flex flex-wrap items-center gap-3 border border-white/10 bg-white/[0.02] p-3"
            >
              {row.photoUrl ? (
                 
                <img
                  src={row.photoUrl}
                  alt=""
                  className="h-14 w-14 border border-white/10 object-cover"
                />
              ) : (
                <div
                  aria-hidden
                  className="flex h-14 w-14 items-center justify-center border border-dashed border-white/15 bg-black/40"
                >
                  {row.number !== null ? (
                    <span className="font-display text-lg text-white/50">{row.number}</span>
                  ) : (
                    <Shirt className="size-5 text-white/30" aria-hidden />
                  )}
                </div>
              )}

              <div className="min-w-40 flex-1">
                <p className="font-semibold text-white">
                  {row.name}
                  {row.number !== null ? (
                    <span className="ml-2 text-xs text-white/40">#{row.number}</span>
                  ) : null}
                </p>
                <p className="mt-0.5 text-[11px] text-white/40">
                  {positionLabel(row.position)} · ordem {row.sortOrder}
                </p>
              </div>

              <span
                className={`border px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${
                  row.visible
                    ? "border-[#03a75e]/50 text-[#03a75e]"
                    : "border-white/15 text-white/40"
                }`}
              >
                {row.visible ? "Visível" : "Oculto"}
              </span>

              <button
                type="button"
                onClick={() => setForm(toForm(row))}
                className="flex min-h-10 items-center gap-1.5 border border-white/15 px-3 text-[11px] font-bold uppercase tracking-widest text-white/60 transition-colors hover:border-[#f8e010] hover:text-[#f8e010]"
              >
                <Pencil className="size-3.5" aria-hidden />
                Editar
              </button>

              <button
                type="button"
                onClick={() => toggleVisible(row)}
                disabled={busy}
                className="flex min-h-10 items-center gap-1.5 border border-white/15 px-3 text-[11px] font-bold uppercase tracking-widest text-white/60 transition-colors hover:border-white/40 hover:text-white disabled:opacity-50"
              >
                {row.visible ? (
                  <>
                    <EyeOff className="size-3.5" aria-hidden />
                    Ocultar
                  </>
                ) : (
                  <>
                    <Eye className="size-3.5" aria-hidden />
                    Mostrar
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => remove(row.id)}
                disabled={busy}
                title="Eliminar"
                aria-label={`Eliminar ${row.name}`}
                className="flex size-10 items-center justify-center border border-white/15 text-white/60 transition-colors hover:border-[#ff6b7a] hover:text-[#ff6b7a] disabled:opacity-50"
              >
                <Trash2 className="size-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) uploadPhoto(file);
          e.target.value = "";
        }}
      />
    </section>
  );
}
