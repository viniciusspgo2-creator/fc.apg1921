"use client";

import { useCallback, useEffect, useState } from "react";

/* ============================================================
 * VisitsPanel — daily visit counter with a 30-day bar chart.
 * Data: GET /api/admin/visits (aggregated per Europe/Zurich day).
 * ============================================================ */

type Stats = {
  today: number;
  total: number;
  days: { day: string; count: number }[];
};

export function VisitsPanel() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setError(false);
    try {
      const res = await fetch("/api/admin/visits", { cache: "no-store" });
      if (!res.ok) throw new Error("http");
      const data = (await res.json()) as Stats & { ok: boolean };
      setStats({ today: data.today, total: data.total, days: data.days });
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const max = Math.max(1, ...(stats?.days.map((d) => d.count) ?? [1]));

  return (
    <section aria-labelledby="visits-title">
      <h1 id="visits-title" className="font-display text-3xl uppercase tracking-wide">
        Visitas ao site
      </h1>
      <p className="mt-1 text-sm text-white/50">
        Contagem anónima por dia (fuso de Genebra) — sem cookies nem endereços IP.
      </p>

      {error ? (
        <p role="alert" className="mt-6 border border-[#ff6b7a]/40 bg-[#ff6b7a]/10 p-4 text-sm text-[#ff6b7a]">
          Não foi possível carregar as estatísticas.
        </p>
      ) : null}

      {stats ? (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="border border-white/10 bg-white/[0.03] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/50">
                Hoje
              </p>
              <p className="mt-2 font-display text-5xl leading-none text-[#f8e010]">
                {stats.today}
              </p>
            </div>
            <div className="border border-white/10 bg-white/[0.03] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/50">
                Total desde o início
              </p>
              <p className="mt-2 font-display text-5xl leading-none text-white">
                {stats.total}
              </p>
            </div>
          </div>

          <h2 className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-white/60">
            Últimos 30 dias
          </h2>
          {stats.days.length === 0 ? (
            <p className="mt-3 text-sm text-white/40">Ainda sem visitas registadas.</p>
          ) : (
            <div
              className="mt-4 flex h-44 items-end gap-1 border border-white/10 bg-white/[0.02] p-4"
              role="img"
              aria-label={`Visitas por dia nos últimos ${stats.days.length} dias; máximo ${max} num dia.`}
            >
              {stats.days.map((d) => (
                <div key={d.day} className="group relative flex h-full flex-1 items-end">
                  <div
                    className="w-full bg-[#0052a8] transition-colors group-hover:bg-[#f8e010]"
                    style={{ height: `${Math.max(4, (d.count / max) * 100)}%` }}
                  />
                  <span className="pointer-events-none absolute -top-7 left-1/2 z-10 hidden -translate-x-1/2 border border-white/15 bg-black/90 px-1.5 py-0.5 text-[10px] whitespace-nowrap text-white group-hover:block">
                    {d.day.slice(5)} · {d.count}
                  </span>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={load}
            className="mt-6 min-h-10 border border-white/15 px-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/70 transition-colors hover:border-[#f8e010] hover:text-[#f8e010]"
          >
            Atualizar
          </button>
        </>
      ) : null}
    </section>
  );
}
