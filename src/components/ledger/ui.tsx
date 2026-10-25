import { Bitcoin, ChevronLeft, ChevronRight, Landmark, LineChart, PiggyBank, Shapes, Wallet } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { currentMonth, formatMoney, formatMonth, formatShare, shiftMonth } from "@/lib/ledger/money";
import type { CurrencyCode, PlatformKind, ShareSlice } from "@/lib/ledger/types";

const ICONS: Record<PlatformKind, typeof Landmark> = {
  corretora: LineChart,
  banco: Landmark,
  cripto: Bitcoin,
  ppr: PiggyBank,
  poupanca: Wallet,
  outro: Shapes,
};

export function KindMark({ kind }: { kind: PlatformKind }) {
  const Icon = ICONS[kind];
  return (
    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-forest-soft text-forest">
      <Icon className="size-5" aria-hidden="true" />
    </span>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "soft" | "ghost" | "danger";
};

export function Button({ variant = "primary", className, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex h-12 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-colors duration-200",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest",
        "disabled:cursor-not-allowed disabled:opacity-40",
        variant === "primary" && "bg-forest text-card hover:bg-ink",
        variant === "soft" && "bg-chip text-ink hover:bg-paper-2",
        variant === "ghost" && "bg-transparent text-ink hover:bg-chip",
        variant === "danger" && "bg-loss text-card hover:bg-ink",
        className,
      )}
      {...props}
    />
  );
}

export function inputClassName() {
  return "h-12 w-full rounded-md border border-line bg-paper px-3 text-base text-ink outline-none focus-visible:border-forest";
}

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
      {error ? (
        <span className="mt-1.5 block text-sm text-loss">{error}</span>
      ) : hint ? (
        <span className="mt-1.5 block text-sm text-muted">{hint}</span>
      ) : null}
    </label>
  );
}

export function SignedMoney({
  value,
  currency,
  className,
}: {
  value: number;
  currency: CurrencyCode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "tabular-nums",
        value > 0 && "text-forest",
        value < 0 && "text-loss",
        value === 0 && "text-ink",
        className,
      )}
    >
      {formatMoney(value, currency, { sign: true })}
    </span>
  );
}

export function MonthSwitcher({ month, onChange }: { month: string; onChange: (month: string) => void }) {
  const min = "2000-01";
  const max = shiftMonth(currentMonth(), 1);
  return (
    <div className="flex items-center justify-between gap-2">
      <button
        type="button"
        aria-label="Mês anterior"
        disabled={month <= min}
        onClick={() => onChange(shiftMonth(month, -1))}
        className="grid h-12 w-12 place-items-center rounded-md border border-line bg-card text-ink disabled:opacity-40"
      >
        <ChevronLeft className="size-5" />
      </button>
      <label className="relative min-w-0 flex-1 text-center">
        <span className="font-serif text-xl">{formatMonth(month)}</span>
        <input
          type="month"
          aria-label="Escolher mês"
          min={min}
          max={max}
          value={month}
          onChange={(event) => {
            if (event.target.value) onChange(event.target.value);
          }}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
      </label>
      <button
        type="button"
        aria-label="Mês seguinte"
        disabled={month >= max}
        onClick={() => onChange(shiftMonth(month, 1))}
        className="grid h-12 w-12 place-items-center rounded-md border border-line bg-card text-ink disabled:opacity-40"
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}

export function CompareBars({
  invested,
  value,
  currency,
}: {
  invested: number;
  value: number;
  currency: CurrencyCode;
}) {
  const max = Math.max(invested, value, 0);
  if (max <= 0) return null;
  return (
    <div className="mt-6 space-y-3">
      <Bar label="Investido" amount={invested} max={max} currency={currency} tone="brass" />
      <Bar label="Valor" amount={value} max={max} currency={currency} tone="forest" />
    </div>
  );
}

function Bar({
  label,
  amount,
  max,
  currency,
  tone,
}: {
  label: string;
  amount: number;
  max: number;
  currency: CurrencyCode;
  tone: "brass" | "forest";
}) {
  const width = max === 0 ? 0 : Math.min(100, (amount / max) * 100);
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
        <span>{label}</span>
        <span className="tabular-nums font-medium">{formatMoney(amount, currency)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-chip">
        <div
          className={cn("h-full rounded-full", tone === "forest" ? "bg-forest" : "bg-brass")}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

export function GoalMeter({
  contributed,
  goal,
  currency,
  recorded,
}: {
  contributed: number;
  goal: number | null;
  currency: CurrencyCode;
  recorded: boolean;
}) {
  if (goal == null || goal <= 0) return null;
  const width = Math.max(0, Math.min(100, (Math.max(contributed, 0) / goal) * 100));
  const line = goalLine(contributed, goal, currency, recorded);
  return (
    <div className="mt-4">
      <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
        <span>Meta de aporte</span>
        <span className="font-medium tabular-nums">
          {formatMoney(Math.max(contributed, 0), currency)} / {formatMoney(goal, currency)}
        </span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-chip"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(width)}
        aria-label="Progresso da meta de aporte"
      >
        <div className="h-full rounded-full bg-forest" style={{ width: `${width}%` }} />
      </div>
      <p className="mt-2 text-sm text-muted">{line}</p>
    </div>
  );
}

function goalLine(contributed: number, goal: number, currency: CurrencyCode, recorded: boolean) {
  if (!recorded) {
    return `A meta deste mês é ${formatMoney(goal, currency)}. Ainda não há aportes registados.`;
  }
  if (contributed < 0) {
    return `Saíram ${formatMoney(Math.abs(contributed), currency)}. A meta de aporte é ${formatMoney(goal, currency)}.`;
  }
  if (contributed >= goal) {
    return `Meta cumprida. Entraram ${formatMoney(contributed, currency)}.`;
  }
  return `Entraram ${formatMoney(contributed, currency)} de ${formatMoney(goal, currency)}.`;
}

export function ShareList({
  title,
  slices,
  currency,
}: {
  title: string;
  slices: ShareSlice[];
  currency: CurrencyCode;
}) {
  if (slices.length === 0) return null;
  const max = slices[0]?.value ?? 0;
  return (
    <div>
      <h3 className="mb-3 font-serif text-xl">{title}</h3>
      <ul className="space-y-3">
        {slices.map((slice) => {
          const width = max <= 0 ? 0 : Math.min(100, (slice.value / max) * 100);
          return (
            <li key={slice.id}>
              <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
                <span className="min-w-0 truncate">{slice.label}</span>
                <span className="shrink-0 tabular-nums">
                  {formatShare(slice.share)}
                  <span className="text-muted"> · {formatMoney(slice.value, currency)}</span>
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-chip">
                <div className="h-full rounded-full bg-forest" style={{ width: `${width}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
