"use client";

import { GALLERY_CATEGORIES } from "@/lib/content-schema";
import { Star, Trash2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/* ============================================================
 * GalleryPanel — manage photos/banners shown on the site.
 * Add by URL or upload; reorder, rename, categorize, hide,
 * delete; set any media as the hero background.
 * ============================================================ */

type Row = {
  id: string;
  url: string;
  title: string;
  category: string;
  sortOrder: number;
  active: boolean;
};

export function GalleryPanel() {
  const [rows, setRows] = useState<Row[]>([]);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("clube");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/gallery", { cache: "no-store" });
      const data = (await res.json()) as { rows: Row[] };
      setRows(data.rows ?? []);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (finalUrl: string) => {
    if (!finalUrl) return;
    setBusy(true);
    try {
      await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: finalUrl, title, category }),
      });
      setUrl("");
      setTitle("");
      await load();
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
      if (data.ok && data.url) await add(data.url);
    } finally {
      setBusy(false);
    }
  };

  const patch = async (id: string, data: Partial<Row>) => {
    await fetch("/api/admin/gallery", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...data }),
    });
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm("Eliminar esta imagem da galeria?")) return;
    await fetch(`/api/admin/gallery?id=${id}`, { method: "DELETE" });
    await load();
  };

  const setHero = async (mediaUrl: string) => {
    if (!confirm("Usar esta imagem como fundo do Hero?")) return;
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "hero.image", value: mediaUrl }),
    });
    alert("Imagem do hero atualizada!");
  };

  return (
    <section aria-labelledby="gallery-title">
      <h1 id="gallery-title" className="font-display text-3xl uppercase tracking-wide">
        Galeria & Mídia
      </h1>
      <p className="mt-1 text-sm text-white/50">
        Fotos da galeria pública, cartazes e banners. O primeiro bloco abaixo também define a imagem do Hero.
      </p>

      {/* ------------------------------------------------ add form */}
      <div className="mt-6 border border-white/10 bg-white/[0.02] p-5">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#f8e010]">
          Adicionar imagem
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_200px_auto]">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="URL da imagem (/uploads/... ou https://...)"
            className="min-h-11 border border-white/15 bg-black/40 px-3 text-sm text-white outline-none focus:border-[#f8e010]"
          />
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título (alt text)"
            className="min-h-11 border border-white/15 bg-black/40 px-3 text-sm text-white outline-none focus:border-[#f8e010]"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="min-h-11 border border-white/15 bg-black/40 px-3 text-sm text-white outline-none focus:border-[#f8e010]"
          >
            {GALLERY_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => add(url.trim())}
            disabled={busy || !url.trim()}
            className="min-h-11 bg-[#0052a8] px-4 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#002b5c] disabled:opacity-50"
          >
            Adicionar
          </button>
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="mt-3 flex min-h-10 items-center gap-2 border border-white/15 px-3 text-[11px] font-bold uppercase tracking-widest text-white/70 transition-colors hover:border-[#f8e010] hover:text-[#f8e010] disabled:opacity-50"
        >
          <Upload className="size-3.5" aria-hidden />
          Ou carregar do dispositivo (converte para WebP)
        </button>
      </div>

      {/* ---------------------------------------------------- list */}
      {busy && rows.length === 0 ? (
        <p className="mt-6 text-xs uppercase tracking-widest text-white/40">A carregar…</p>
      ) : (
        <ul className="mt-6 grid gap-3">
          {rows.map((row) => (
            <li
              key={row.id}
              className={`flex flex-wrap items-center gap-3 border border-white/10 bg-white/[0.02] p-3 ${row.active ? "" : "opacity-50"}`}
            >
              <img
                src={row.url}
                alt=""
                className="h-16 w-24 border border-white/10 object-cover"
              />
              <div className="min-w-40 flex-1">
                <input
                  value={row.title}
                  onChange={(e) =>
                    setRows((rs) =>
                      rs.map((r) => (r.id === row.id ? { ...r, title: e.target.value } : r)),
                    )
                  }
                  onBlur={() => patch(row.id, { title: row.title })}
                  className="min-h-9 w-full border border-white/10 bg-black/40 px-2 text-sm text-white outline-none focus:border-[#f8e010]"
                  aria-label="Título da imagem"
                />
                <p className="mt-1 truncate text-[11px] text-white/35">{row.url}</p>
              </div>
              <select
                value={row.category}
                onChange={(e) => patch(row.id, { category: e.target.value })}
                className="min-h-10 border border-white/15 bg-black/40 px-2 text-xs text-white outline-none focus:border-[#f8e010]"
                aria-label="Categoria"
              >
                {GALLERY_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              <label className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-white/50">
                Ordem
                <input
                  type="number"
                  value={row.sortOrder}
                  onChange={(e) =>
                    setRows((rs) =>
                      rs.map((r) =>
                        r.id === row.id ? { ...r, sortOrder: Number(e.target.value) } : r,
                      ),
                    )
                  }
                  onBlur={() => patch(row.id, { sortOrder: row.sortOrder })}
                  className="w-16 min-h-9 border border-white/10 bg-black/40 px-2 text-sm text-white outline-none focus:border-[#f8e010]"
                />
              </label>
              <button
                type="button"
                onClick={() => patch(row.id, { active: !row.active })}
                className={`min-h-10 border px-3 text-[11px] font-bold uppercase tracking-widest transition-colors ${
                  row.active
                    ? "border-[#03a75e]/50 text-[#03a75e] hover:bg-[#03a75e]/10"
                    : "border-white/15 text-white/50 hover:border-white/40"
                }`}
              >
                {row.active ? "Visível" : "Oculta"}
              </button>
              <button
                type="button"
                onClick={() => setHero(row.url)}
                title="Usar como fundo do Hero"
                className="flex size-10 items-center justify-center border border-white/15 text-white/60 transition-colors hover:border-[#f8e010] hover:text-[#f8e010]"
              >
                <Star className="size-4" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => remove(row.id)}
                title="Eliminar"
                className="flex size-10 items-center justify-center border border-white/15 text-white/60 transition-colors hover:border-[#ff6b7a] hover:text-[#ff6b7a]"
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
          if (file) upload(file);
          e.target.value = "";
        }}
      />
    </section>
  );
}
