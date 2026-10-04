"use client";

import { ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

/* Admin login — password from ADMIN_PASSWORD (default apg1921). */
export function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? "Falha no login.");
        return;
      }
      router.refresh();
    } catch {
      setError("Erro de rede. Tenta de novo.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b0f1a] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <img
            src="/brand/apg-logo-original.png"
            alt="FC APG 1921"
            className="h-20 w-20 object-contain"
          />
          <div>
            <h1 className="font-display text-3xl uppercase tracking-wide text-white">
              Painel do clube
            </h1>
            <p className="mt-1 text-sm text-white/50">FC APG 1921 — gestão de conteúdo</p>
          </div>
        </div>

        <form
          onSubmit={submit}
          className="border border-white/10 bg-white/[0.03] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
        >
          <label htmlFor="admin-password" className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            Senha de acesso
          </label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            required
            className="mt-2 min-h-11 w-full border border-white/15 bg-black/40 px-3 text-white outline-none focus:border-[#f8e010]"
            placeholder="••••••••"
          />
          {error ? (
            <p role="alert" className="mt-3 text-sm text-[#ff6b7a]">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={busy}
            className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 bg-[#f8e010] px-4 text-sm font-bold uppercase tracking-[0.18em] text-[#070a12] transition-colors hover:bg-white disabled:opacity-60"
          >
            <ShieldCheck className="size-4" aria-hidden />
            {busy ? "A entrar…" : "Entrar"}
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-white/30">
          Define ADMIN_PASSWORD no ficheiro .env para alterar a senha.
        </p>
      </div>
    </main>
  );
}
