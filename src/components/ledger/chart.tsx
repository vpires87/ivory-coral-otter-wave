import { useEffect, useState } from "react";
import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCompact, formatMoney, formatMonth } from "@/lib/ledger/money";
import type { CurrencyCode, MonthPoint } from "@/lib/ledger/types";

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);
  return reduced;
}

export function ValueChart({ points, currency }: { points: MonthPoint[]; currency: CurrencyCode }) {
  const reduced = useReducedMotion();
  const [span, setSpan] = useState<"12" | "all">("all");
  const visible = span === "12" ? points.slice(-12) : points;
  const data = visible.map((point) => ({
    ...point,
    label: formatMonth(point.month, "short"),
  }));

  if (points.length === 0) return null;

  return (
    <section className="rounded-lg border border-line bg-card p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl">Evolução</h2>
          <p className="mt-1 text-sm text-muted">Valor da carteira contra o que foste metendo.</p>
        </div>
        {points.length > 12 ? (
          <div className="grid grid-cols-2 gap-1 rounded-md bg-paper-2 p-1">
            <SpanButton active={span === "12"} onClick={() => setSpan("12")}>
              12 meses
            </SpanButton>
            <SpanButton active={span === "all"} onClick={() => setSpan("all")}>
              Tudo
            </SpanButton>
          </div>
        ) : null}
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="var(--color-line)" vertical={false} />
            <XAxis
              dataKey="label"
              minTickGap={28}
              tick={{ fill: "var(--color-muted)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              width={48}
              tickFormatter={(value: number) => formatCompact(value)}
              tick={{ fill: "var(--color-muted)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                const point = payload?.[0]?.payload as (MonthPoint & { label: string }) | undefined;
                if (!active || !point) return null;
                return (
                  <div className="rounded-md border border-line bg-card px-3 py-2 text-sm">
                    <p className="font-medium">{formatMonth(point.month)}</p>
                    <p className="mt-1 tabular-nums">Valor {formatMoney(point.value, currency)}</p>
                    <p className="tabular-nums">Investido {formatMoney(point.invested, currency)}</p>
                    <p className="tabular-nums">
                      Aporte {formatMoney(point.contributed, currency, { sign: true })}
                    </p>
                    <p className="tabular-nums">
                      Mercado {formatMoney(point.market, currency, { sign: true })}
                    </p>
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--color-forest)"
              fill="var(--color-forest)"
              fillOpacity={0.14}
              strokeWidth={2}
              isAnimationActive={!reduced}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="invested"
              stroke="var(--color-brass)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={!reduced}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-sm">
        <Legend swatch="bg-forest" label="Valor" />
        <Legend swatch="bg-brass" label="Investido" />
      </div>
      {points.some((point) => point.recorded === 0) ? (
        <p className="mt-3 text-sm text-muted">
          Meses sem atualização repetem o último valor conhecido de cada plataforma.
        </p>
      ) : null}
    </section>
  );
}

function SpanButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "h-10 rounded-md bg-card px-3 text-sm font-medium text-ink"
          : "h-10 rounded-md px-3 text-sm text-muted"
      }
    >
      {children}
    </button>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-2 w-6 rounded-full ${swatch}`} />
      {label}
    </span>
  );
}
