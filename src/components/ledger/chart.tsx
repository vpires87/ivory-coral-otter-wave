import { useEffect, useState } from "react";
import { Area, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { compareByYear } from "@/lib/ledger/calc";
import { formatCompact, formatMoney, formatMonth, formatShare } from "@/lib/ledger/money";
import type { CashbackCard, CurrencyCode, ExpenseMonth, ExpenseType, MonthPoint, SavingsPoint } from "@/lib/ledger/types";
import { SignedMoney } from "@/components/ledger/ui";

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
                      Aporte <SignedMoney value={point.contributed} currency={currency} />
                    </p>
                    <p className="tabular-nums">
                      Mercado <SignedMoney value={point.market} currency={currency} />
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
      <MarketBars points={data} currency={currency} reduced={reduced} />
      {points.some((point) => point.recorded === 0) ? (
        <p className="mt-3 text-sm text-muted">
          Meses sem atualização repetem o último valor conhecido de cada plataforma.
        </p>
      ) : null}
    </section>
  );
}

function MarketBars({
  points,
  currency,
  reduced,
}: {
  points: (MonthPoint & { label: string })[];
  currency: CurrencyCode;
  reduced: boolean;
}) {
  const data = points.filter((point) => point.recorded > 0);
  if (data.length === 0) return null;
  return (
    <div className="mt-6">
      <h3 className="font-serif text-xl">Mercado</h3>
      <p className="mt-1 text-sm text-muted">Verde quando o mês subiu. Vermelho quando desceu.</p>
      <div className="mt-3 h-40">
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
            <ReferenceLine y={0} stroke="var(--color-muted)" />
            <Tooltip
              content={({ active, payload }) => {
                const point = payload?.[0]?.payload as MonthPoint | undefined;
                if (!active || !point) return null;
                return (
                  <div className="rounded-md border border-line bg-card px-3 py-2 text-sm">
                    <p className="font-medium">{formatMonth(point.month)}</p>
                    <p className="mt-1">
                      Mercado <SignedMoney value={point.market} currency={currency} />
                    </p>
                  </div>
                );
              }}
            />
            <Bar dataKey="market" isAnimationActive={!reduced} maxBarSize={18} radius={4}>
              {data.map((point) => (
                <Cell
                  key={point.month}
                  fill={point.market < 0 ? "var(--color-loss)" : "var(--color-forest)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
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

export function CashbackMonthChart({
  rows,
  currency,
  title,
}: {
  rows: { id: string; name: string; amount: number }[];
  currency: CurrencyCode;
  title: string;
}) {
  const reduced = useReducedMotion();
  const visible = [...rows].filter((row) => row.amount > 0).sort((a, b) => b.amount - a.amount);
  if (visible.length === 0) return null;
  const best = visible[0].amount;

  return (
    <section className="rounded-lg border border-line bg-card p-4 sm:p-5">
      <h2 className="font-serif text-2xl">Qual deu mais</h2>
      <p className="mt-1 text-sm text-muted">{title}</p>
      <div className="mt-4" style={{ height: Math.max(160, visible.length * 48) }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={visible} layout="vertical" margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="var(--color-line)" horizontal={false} />
            <XAxis
              type="number"
              tickFormatter={(value: number) => formatCompact(value)}
              tick={{ fill: "var(--color-muted)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={88}
              tick={{ fill: "var(--color-ink)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                const point = payload?.[0]?.payload as { name: string; amount: number } | undefined;
                if (!active || !point) return null;
                return (
                  <div className="rounded-md border border-line bg-card px-3 py-2 text-sm">
                    <p className="font-medium">{point.name}</p>
                    <p className="mt-1 tabular-nums">{formatMoney(point.amount, currency)}</p>
                  </div>
                );
              }}
            />
            <Bar dataKey="amount" isAnimationActive={!reduced} maxBarSize={22} radius={4}>
              {visible.map((row) => (
                <Cell key={row.id} fill={row.amount === best ? "var(--color-forest)" : "var(--color-brass)"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export function CashbackHistory({
  series,
  cards,
  currency,
}: {
  series: { month: string; total: number; rows: { id: string; amount: number }[] }[];
  cards: CashbackCard[];
  currency: CurrencyCode;
}) {
  const reduced = useReducedMotion();
  const visible = series.filter((point) => point.total > 0);
  if (visible.length < 2 || cards.length === 0) return null;
  const data = visible.map((point) => {
    const row: Record<string, string | number> = {
      month: point.month,
      label: formatMonth(point.month, "short"),
      total: point.total,
    };
    for (const item of point.rows) row[item.id] = item.amount;
    return row;
  });

  return (
    <section className="rounded-lg border border-line bg-card p-4 sm:p-5">
      <h2 className="font-serif text-2xl">Mês a mês</h2>
      <p className="mt-1 text-sm text-muted">Cada barra é um cartão, lado a lado.</p>
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
                const point = payload?.[0]?.payload as (Record<string, string | number> & { month: string; total: number }) | undefined;
                if (!active || !point) return null;
                return (
                  <div className="rounded-md border border-line bg-card px-3 py-2 text-sm">
                    <p className="font-medium">{formatMonth(point.month)}</p>
                    <p className="mt-1 tabular-nums">Total {formatMoney(point.total, currency)}</p>
                    {cards.map((card) => {
                      const amount = point[card.id];
                      if (typeof amount !== "number" || amount === 0) return null;
                      return (
                        <p key={card.id} className="tabular-nums">
                          {card.name} {formatMoney(amount, currency)}
                        </p>
                      );
                    })}
                  </div>
                );
              }}
            />
            {cards.map((card, index) => (
              <Bar
                key={card.id}
                dataKey={card.id}
                fill={SERIES[index % SERIES.length].fill}
                isAnimationActive={!reduced}
                maxBarSize={16}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
        {cards.map((card, index) => (
          <Legend key={card.id} swatch={SERIES[index % SERIES.length].swatch} label={card.name} />
        ))}
      </div>
    </section>
  );
}

export function SavingsChart({ series, currency }: { series: SavingsPoint[]; currency: CurrencyCode }) {
  const reduced = useReducedMotion();
  const visible = series.filter((point) => point.earned > 0 || point.invested > 0);
  if (visible.length === 0) return null;
  const data = visible.map((point) => ({
    ...point,
    label: formatMonth(point.month, "short"),
  }));

  return (
    <section className="rounded-lg border border-line bg-card p-4 sm:p-5">
      <h2 className="font-serif text-2xl">Ganho e investido</h2>
      <p className="mt-1 text-sm text-muted">O que entrou no mês contra o que foi para investir.</p>
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
                const point = payload?.[0]?.payload as (SavingsPoint & { label: string }) | undefined;
                if (!active || !point) return null;
                return (
                  <div className="rounded-md border border-line bg-card px-3 py-2 text-sm">
                    <p className="font-medium">{formatMonth(point.month)}</p>
                    <p className="mt-1 tabular-nums">Ganho {formatMoney(point.earned, currency)}</p>
                    <p className="tabular-nums">Investido {formatMoney(point.invested, currency)}</p>
                    <p className="tabular-nums">Poupança {point.rate == null ? "—" : formatShare(point.rate)}</p>
                  </div>
                );
              }}
            />
            <Bar dataKey="earned" fill="var(--color-forest)" isAnimationActive={!reduced} maxBarSize={18} radius={4} />
            <Bar dataKey="invested" fill="var(--color-brass)" isAnimationActive={!reduced} maxBarSize={18} radius={4} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
        <Legend swatch="bg-forest" label="Ganho" />
        <Legend swatch="bg-brass" label="Investido" />
      </div>
    </section>
  );
}

const YEAR_COLORS = [
  { stroke: "var(--color-forest)", swatch: "bg-forest" },
  { stroke: "var(--color-brass)", swatch: "bg-brass" },
  { stroke: "var(--color-ink)", swatch: "bg-ink" },
  { stroke: "var(--color-muted)", swatch: "bg-muted" },
];

export function YearCompareChart({
  currency,
  metrics,
}: {
  currency: CurrencyCode;
  metrics: { id: string; label: string; signed?: boolean; points: { month: string; amount: number }[] }[];
}) {
  const reduced = useReducedMotion();
  const available = metrics.filter((metric) => metric.points.length > 0);
  const [metricId, setMetricId] = useState(available[0]?.id ?? "");
  const selected = available.find((metric) => metric.id === metricId) ?? available[0];
  if (!selected) return null;
  const compared = compareByYear(selected.points);
  if (compared.years.length === 0) return null;

  return (
    <section className="rounded-lg border border-line bg-card p-4 sm:p-5">
      <h2 className="font-serif text-2xl">Entre anos</h2>
      <p className="mt-1 text-sm text-muted">
        {selected.signed
          ? "O mesmo mês, lado a lado. Vermelho é uma saída."
          : compared.years.length < 2
            ? "O mesmo mês, em cada ano. A segunda linha aparece quando houver outro ano."
            : "O mesmo mês, lado a lado, em cada ano."}
      </p>
      {available.length > 1 ? (
        <div className="mt-4 grid grid-cols-2 gap-1 rounded-md bg-paper-2 p-1 sm:grid-cols-4">
          {available.map((metric) => (
            <SpanButton key={metric.id} active={metric.id === selected.id} onClick={() => setMetricId(metric.id)}>
              {metric.label}
            </SpanButton>
          ))}
        </div>
      ) : null}
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={compared.rows} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="var(--color-line)" vertical={false} />
            <XAxis
              dataKey="label"
              minTickGap={16}
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
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="rounded-md border border-line bg-card px-3 py-2 text-sm">
                    <p className="font-medium">{label}</p>
                    {payload.map((item) => {
                      const amount = typeof item.value === "number" ? item.value : null;
                      return (
                        <p key={String(item.dataKey)} className="mt-1">
                          {item.dataKey}{" "}
                          {amount == null ? (
                            "—"
                          ) : selected.signed || amount < 0 ? (
                            <SignedMoney value={amount} currency={currency} />
                          ) : (
                            <span className="tabular-nums">{formatMoney(amount, currency)}</span>
                          )}
                        </p>
                      );
                    })}
                  </div>
                );
              }}
            />
            {compared.years.map((year, index) => {
              const color = YEAR_COLORS[index % YEAR_COLORS.length].stroke;
              if (!selected.signed) {
                return (
                  <Line
                    key={year}
                    type="monotone"
                    dataKey={year}
                    name={year}
                    stroke={color}
                    strokeWidth={2}
                    dot={false}
                    connectNulls={false}
                    isAnimationActive={!reduced}
                  />
                );
              }
              return (
                <Bar key={year} dataKey={year} name={year} maxBarSize={16} radius={3} isAnimationActive={!reduced}>
                  {compared.rows.map((row) => {
                    const amount = row[year];
                    const negative = typeof amount === "number" && amount < 0;
                    return <Cell key={`${year}-${row.label}`} fill={negative ? "var(--color-loss)" : color} />;
                  })}
                </Bar>
              );
            })}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
        {compared.years.map((year, index) => (
          <Legend key={year} swatch={YEAR_COLORS[index % YEAR_COLORS.length].swatch} label={year} />
        ))}
      </div>
    </section>
  );
}
