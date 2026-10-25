import { useEffect, useState } from "react";
import { Area, Bar, BarChart, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCompact, formatMoney, formatMonth } from "@/lib/ledger/money";
import type { CurrencyCode, ExpenseMonth, ExpenseType, MonthPoint } from "@/lib/ledger/types";

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

const SERIES = [
  { fill: "var(--color-forest)", swatch: "bg-forest" },
  { fill: "var(--color-brass)", swatch: "bg-brass" },
  { fill: "var(--color-ink)", swatch: "bg-ink" },
  { fill: "var(--color-muted)", swatch: "bg-muted" },
  { fill: "var(--color-loss)", swatch: "bg-loss" },
];

export function ExpenseChart({
  series,
  types,
  currency,
}: {
  series: ExpenseMonth[];
  types: ExpenseType[];
  currency: CurrencyCode;
}) {
  const reduced = useReducedMotion();
  const visible = series.filter((point) => point.total > 0);
  if (visible.length === 0 || types.length === 0) return null;
  const data = visible.map((point) => ({
    ...point.byType,
    month: point.month,
    label: formatMonth(point.month, "short"),
    total: point.total,
  }));

  return (
    <section className="rounded-lg border border-line bg-card p-4 sm:p-5">
      <h2 className="font-serif text-2xl">Despesas</h2>
      <p className="mt-1 text-sm text-muted">O que saiu, mês a mês, por tipo.</p>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
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
                const point = payload?.[0]?.payload as
                  | ({ month: string; total: number } & Record<string, number | string>)
                  | undefined;
                if (!active || !point) return null;
                return (
                  <div className="rounded-md border border-line bg-card px-3 py-2 text-sm">
                    <p className="font-medium">{formatMonth(point.month)}</p>
                    <p className="mt-1 tabular-nums">Total {formatMoney(point.total, currency)}</p>
                    {types.map((type) => {
                      const amount = point[type.id];
                      if (typeof amount !== "number" || amount === 0) return null;
                      return (
                        <p key={type.id} className="tabular-nums">
                          {type.name} {formatMoney(amount, currency)}
                        </p>
                      );
                    })}
                  </div>
                );
              }}
            />
            {types.map((type, index) => (
              <Bar
                key={type.id}
                dataKey={type.id}
                stackId="despesas"
                fill={SERIES[index % SERIES.length].fill}
                isAnimationActive={!reduced}
                maxBarSize={28}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
        {types.map((type, index) => (
          <Legend key={type.id} swatch={SERIES[index % SERIES.length].swatch} label={type.name} />
        ))}
      </div>
    </section>
  );
}
