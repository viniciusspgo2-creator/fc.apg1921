"use client";

import { NEWS_TAGS } from "@/lib/content-schema";
import { Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/* ============================================================
 * NewsPanel — full CRUD for the news/blog posts.
 * ============================================================ */

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover: string;
  tag: string;
  sourceUrl: string;
  published: boolean;
};

const EMPTY: Post = {
  id: "",
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  cover: "",
  tag: "club",
  sourceUrl: "",
  published: true,
};

export function NewsPanel() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [editing, setEditing] = useState<Post | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/news", { cache: "no-store" });
      const data = (await res.json()) as { rows: Post[] };
      setPosts(data.rows ?? []);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!editing) return;
    setBusy(true);
    try {
      const isEdit = Boolean(editing.id);
      const res = await fetch("/api/admin/news", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isEdit
            ? editing
            : {
                title: editing.title,
                excerpt: editing.excerpt,
                content: editing.content,
                cover: editing.cover,
                tag: editing.tag,
                sourceUrl: editing.sourceUrl,
                published: editing.published,
              },
        ),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!data.ok) {
        alert(data.error ?? "Falha ao guardar.");
        return;
      }
      setEditing(null);
      await load();
    } finally {
      setBusy(false);
    }
  };

  const togglePublished = async (post: Post) => {
    await fetch("/api/admin/news", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: post.id, published: !post.published }),
    });
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm("Eliminar esta notícia?")) return;
    await fetch(`/api/admin/news?id=${id}`, { method: "DELETE" });
    await load();
  };

  const uploadCover = async (file: File) => {
    if (!editing) return;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = (await res.json()) as { ok: boolean; url?: string };
      if (data.ok && data.url) setEditing({ ...editing, cover: data.url });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section aria-labelledby="news-title">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 id="news-title" className="font-display text-3xl uppercase tracking-wide">
            Notícias
          </h1>
          <p className="mt-1 text-sm text-white/50">
            Publica, edita e organiza as notícias do site (blog).
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing({ ...EMPTY })}
          className="flex min-h-11 items-center gap-2 bg-[#f8e010] px-4 text-xs font-bold uppercase tracking-widest text-[#070a12] transition-colors hover:bg-white"
        >
          <Plus className="size-4" aria-hidden />
          Nova notícia
        </button>
      </div>

      {busy && posts.length === 0 ? (
        <p className="mt-6 text-xs uppercase tracking-widest text-white/40">A carregar…</p>
      ) : (
        <ul className="mt-6 grid gap-3">
          {posts.map((post) => (
            <li
              key={post.id}
              className="flex flex-wrap items-center gap-3 border border-white/10 bg-white/[0.02] p-3"
            >
              {post.cover ? (
                 
                <img
                  src={post.cover}
                  alt=""
                  className="h-16 w-24 border border-white/10 object-cover"
                />
              ) : (
                <div className="flex h-16 w-24 items-center justify-center border border-dashed border-white/15 text-[10px] uppercase text-white/30">
                  sem capa
                </div>
              )}
              <div className="min-w-48 flex-1">
                <p className="font-semibold text-white">{post.title}</p>
                <p className="mt-0.5 text-[11px] text-white/40">
                  /{post.slug} · {post.tag} {post.sourceUrl ? "· com fonte" : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => togglePublished(post)}
                className={`min-h-10 border px-3 text-[11px] font-bold uppercase tracking-widest transition-colors ${
                  post.published
                    ? "border-[#03a75e]/50 text-[#03a75e] hover:bg-[#03a75e]/10"
                    : "border-white/15 text-white/50 hover:border-white/40"
                }`}
              >
                {post.published ? "Publicada" : "Rascunho"}
              </button>
              <button
                type="button"
                onClick={() => setEditing(post)}
                title="Editar"
                className="flex size-10 items-center justify-center border border-white/15 text-white/60 transition-colors hover:border-[#f8e010] hover:text-[#f8e010]"
              >
                <Pencil className="size-4" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => remove(post.id)}
                title="Eliminar"
                className="flex size-10 items-center justify-center border border-white/15 text-white/60 transition-colors hover:border-[#ff6b7a] hover:text-[#ff6b7a]"
              >
                <Trash2 className="size-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* -------------------------------------------- editor modal */}
      {editing ? (
        <div
          className="fixed inset-0 z-[160] flex items-start justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setEditing(null)}
        >
          <div
            className="my-8 w-full max-w-3xl border border-white/10 bg-[#0b0f1a] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-display text-2xl uppercase tracking-wide">
                {editing.id ? "Editar notícia" : "Nova notícia"}
              </h2>
              <button
                type="button"
                onClick={() => setEditing(null)}
                aria-label="Fechar"
                className="flex size-10 items-center justify-center border border-white/15 text-white/60 hover:border-[#ff6b7a] hover:text-[#ff6b7a]"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>

            <div className="mt-5 grid gap-4">
              <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                Título
                <input
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="min-h-11 border border-white/15 bg-black/40 px-3 text-sm font-normal normal-case tracking-normal text-white outline-none focus:border-[#f8e010]"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                  Categoria
                  <select
                    value={editing.tag}
                    onChange={(e) => setEditing({ ...editing, tag: e.target.value })}
                    className="min-h-11 border border-white/15 bg-black/40 px-3 text-sm font-normal normal-case tracking-normal text-white outline-none focus:border-[#f8e010]"
                  >
                    {NEWS_TAGS.map((tg) => (
                      <option key={tg.value} value={tg.value}>
                        {tg.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                  Fonte (URL oficial, opcional)
                  <input
                    value={editing.sourceUrl}
                    onChange={(e) => setEditing({ ...editing, sourceUrl: e.target.value })}
                    placeholder="https://..."
                    className="min-h-11 border border-white/15 bg-black/40 px-3 text-sm font-normal normal-case tracking-normal text-white outline-none focus:border-[#f8e010]"
                  />
                </label>
              </div>

              <div className="grid gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                Capa
                <div className="flex flex-wrap items-center gap-3">
                  {editing.cover ? (
                     
                    <img
                      src={editing.cover}
                      alt=""
                      className="h-20 w-32 border border-white/15 object-cover"
                    />
                  ) : null}
                  <input
                    value={editing.cover}
                    onChange={(e) => setEditing({ ...editing, cover: e.target.value })}
                    placeholder="/uploads/... ou https://..."
                    className="min-w-48 flex-1 min-h-11 border border-white/15 bg-black/40 px-3 text-sm font-normal normal-case tracking-normal text-white outline-none focus:border-[#f8e010]"
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex min-h-11 items-center gap-2 border border-white/15 px-3 text-[11px] font-bold uppercase tracking-widest text-white/70 hover:border-[#f8e010] hover:text-[#f8e010]"
                  >
                    <Upload className="size-3.5" aria-hidden />
                    Carregar
                  </button>
                </div>
              </div>

              <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                Resumo (exibido nos cartões)
                <textarea
                  rows={2}
                  value={editing.excerpt}
                  onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                  className="border border-white/15 bg-black/40 p-3 text-sm font-normal normal-case tracking-normal text-white outline-none focus:border-[#f8e010]"
                />
              </label>

              <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                Conteúdo (parágrafos separados por linha em branco)
                <textarea
                  rows={10}
                  value={editing.content}
                  onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                  className="border border-white/15 bg-black/40 p-3 text-sm font-normal normal-case tracking-normal text-white outline-none focus:border-[#f8e010]"
                />
              </label>

              <label className="flex items-center gap-2 text-sm text-white/70">
                <input
                  type="checkbox"
                  checked={editing.published}
                  onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
                  className="size-4 accent-[#f8e010]"
                />
                Publicada (visível no site)
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="min-h-11 border border-white/15 px-4 text-xs font-bold uppercase tracking-widest text-white/60 hover:border-white/40"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={save}
                disabled={busy || !editing.title.trim() || !editing.content.trim()}
                className="min-h-11 bg-[#f8e010] px-5 text-xs font-bold uppercase tracking-widest text-[#070a12] transition-colors hover:bg-white disabled:opacity-50"
              >
                {busy ? "A guardar…" : "Guardar"}
              </button>
            </div>
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
          if (file) uploadCover(file);
          e.target.value = "";
        }}
      />
    </section>
  );
}
