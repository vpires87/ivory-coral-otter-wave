import { cents, eachMonth } from "@/lib/ledger/money";
import { PLATFORM_KINDS } from "@/lib/ledger/types";
import type {
  ExpenseEntry,
  ExpenseMonth,
  ExpenseType,
  MonthEntry,
  MonthPoint,
  Platform,
  PlatformSnapshot,
  ShareSlice,
  Totals,
  YearRollup,
} from "@/lib/ledger/types";

function byMonth(a: { month: string }, b: { month: string }) {
  return a.month < b.month ? -1 : a.month > b.month ? 1 : 0;
}

export function buildSeries(platforms: Platform[], entries: MonthEntry[]): MonthPoint[] {
  if (entries.length === 0) return [];
  const sorted = [...entries].sort(byMonth);
  const months = eachMonth(sorted[0].month, sorted[sorted.length - 1].month);
  const lookup = new Map<string, MonthEntry>();
  for (const entry of entries) lookup.set(`${entry.platformId}|${entry.month}`, entry);

  const latest = new Map<string, number>();
  const started = new Set<string>();
  let cumulative = 0;
  let prevResult = 0;

  return months.map((month) => {
    let contributed = 0;
    let recorded = 0;
    for (const platform of platforms) {
      const entry = lookup.get(`${platform.id}|${month}`);
      if (!entry) continue;
      recorded += 1;
      contributed = cents(contributed + entry.contributed);
      latest.set(platform.id, entry.endValue);
      started.add(platform.id);
    }
    cumulative = cents(cumulative + contributed);

    let opening = 0;
    let value = 0;
    for (const platform of platforms) {
      if (!started.has(platform.id)) continue;
      opening = cents(opening + platform.openingInvested);
      value = cents(value + (latest.get(platform.id) ?? 0));
    }
    const invested = cents(opening + cumulative);
    const result = cents(value - invested);
    const market = cents(result - prevResult);
    prevResult = result;
    return { month, contributed, invested, value, market, recorded };
  });
}

export function totals(platforms: Platform[], entries: MonthEntry[]): Totals {
  const series = buildSeries(platforms, entries);
  const withValue = platforms.filter((platform) =>
    entries.some((entry) => entry.platformId === platform.id),
  ).length;
  if (series.length === 0) {
    return { invested: 0, value: 0, result: 0, resultRatio: null, latestMonth: null, withValue: 0 };
  }
  const last = series[series.length - 1];
  const result = cents(last.value - last.invested);
  return {
    invested: last.invested,
    value: last.value,
    result,
    resultRatio: last.invested !== 0 ? result / last.invested : null,
    latestMonth: last.month,
    withValue,
  };
}

export function pointFor(series: MonthPoint[], month: string): MonthPoint | null {
  return series.find((point) => point.month === month) ?? null;
}

export function platformSnapshot(platform: Platform, entries: MonthEntry[]): PlatformSnapshot {
  const mine = entries.filter((entry) => entry.platformId === platform.id).sort(byMonth);
  if (mine.length === 0) {
    return {
      invested: platform.openingInvested,
      value: null,
      result: null,
      resultRatio: null,
      months: 0,
      lastMonth: null,
    };
  }
  const contributed = mine.reduce((sum, entry) => cents(sum + entry.contributed), 0);
  const invested = cents(platform.openingInvested + contributed);
  const value = mine[mine.length - 1].endValue;
  const result = cents(value - invested);
  return {
    invested,
    value,
    result,
    resultRatio: invested !== 0 ? result / invested : null,
    months: mine.length,
    lastMonth: mine[mine.length - 1].month,
  };
}

export type PlatformMonthRow = MonthEntry & { market: number };

export function platformRows(platform: Platform, entries: MonthEntry[]): PlatformMonthRow[] {
  const mine = entries.filter((entry) => entry.platformId === platform.id).sort(byMonth);
  let prevValue: number | null = null;
  return mine.map((entry) => {
    const market =
      prevValue == null
        ? cents(entry.endValue - (platform.openingInvested + entry.contributed))
        : cents(entry.endValue - prevValue - entry.contributed);
    prevValue = entry.endValue;
    return { ...entry, market };
  });
}

export function previousEntry(
  entries: MonthEntry[],
  platformId: string,
  month: string,
): MonthEntry | null {
  const older = entries
    .filter((entry) => entry.platformId === platformId && entry.month < month)
    .sort(byMonth);
  return older.length > 0 ? older[older.length - 1] : null;
}

export function yearlyRollup(series: MonthPoint[]): YearRollup[] {
  const years = new Map<string, YearRollup>();
  for (const point of series) {
    const year = point.month.slice(0, 4);
    const current = years.get(year) ?? { year, contributed: 0, market: 0, endValue: 0 };
    current.contributed = cents(current.contributed + point.contributed);
    current.market = cents(current.market + point.market);
    current.endValue = point.value;
    years.set(year, current);
  }
  return [...years.values()];
}

export function entryFor(entries: MonthEntry[], platformId: string, month: string): MonthEntry | null {
  return entries.find((entry) => entry.platformId === platformId && entry.month === month) ?? null;
}

export function valueShares(platforms: Platform[], entries: MonthEntry[]): ShareSlice[] {
  const rows = platforms
    .map((platform) => ({
      id: platform.id,
      label: platform.name,
      value: platformSnapshot(platform, entries).value ?? 0,
    }))
    .filter((row) => row.value > 0)
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label, "pt"));
  return withShares(rows);
}

export function kindShares(platforms: Platform[], entries: MonthEntry[]): ShareSlice[] {
  const totalsByKind = new Map<string, number>();
  for (const platform of platforms) {
    const value = platformSnapshot(platform, entries).value ?? 0;
    if (value <= 0) continue;
    totalsByKind.set(platform.kind, cents((totalsByKind.get(platform.kind) ?? 0) + value));
  }
  const rows = [...totalsByKind.entries()].map(([id, value]) => ({
    id,
    label: PLATFORM_KINDS.find((kind) => kind.id === id)?.label ?? id,
    value,
  }));
  rows.sort((a, b) => b.value - a.value || a.label.localeCompare(b.label, "pt"));
  return withShares(rows);
}

function withShares(rows: { id: string; label: string; value: number }[]): ShareSlice[] {
  const total = rows.reduce((sum, row) => cents(sum + row.value), 0);
  if (total <= 0) return [];
  return rows.map((row) => ({ ...row, share: row.value / total }));
}

export function expenseFor(expenses: ExpenseEntry[], typeId: string, month: string): ExpenseEntry | null {
  return expenses.find((entry) => entry.typeId === typeId && entry.month === month) ?? null;
}

export function expenseSeries(types: ExpenseType[], expenses: ExpenseEntry[]): ExpenseMonth[] {
  if (expenses.length === 0) return [];
  const sorted = [...expenses].sort(byMonth);
  const months = eachMonth(sorted[0].month, sorted[sorted.length - 1].month);
  return months.map((month) => {
    const byType: Record<string, number> = {};
    let total = 0;
    for (const type of types) {
      const entry = expenseFor(expenses, type.id, month);
      if (!entry) continue;
      byType[type.id] = entry.amount;
      total = cents(total + entry.amount);
    }
    return { month, total, byType };
  });
}

export function expenseTotal(expenses: ExpenseEntry[], month: string): number {
  return expenses.reduce((sum, entry) => (entry.month === month ? cents(sum + entry.amount) : sum), 0);
}
