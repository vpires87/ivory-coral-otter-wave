import { format, parse } from "date-fns";
import { pt } from "date-fns/locale";
import type { CurrencyCode } from "@/lib/ledger/types";

export function cents(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Months of steady saving until a goal. Null when the pace cannot get there. */
export function monthsToGoal(
  value: number,
  goal: number,
  monthly: number,
  annualPercent: number | null,
): number | null {
  if (goal <= 0 || value >= goal) return 0;
  const rate = annualPercent != null && annualPercent > 0 ? annualPercent / 100 : 0;
  if (rate === 0) {
    if (monthly <= 0) return null;
    return Math.ceil((goal - value) / monthly);
  }
  const monthlyRate = (1 + rate) ** (1 / 12) - 1;
  if (monthlyRate <= 0) return null;
  if (monthly <= 0) {
    if (value <= 0) return null;
    const months = Math.log(goal / value) / Math.log(1 + monthlyRate);
    return Number.isFinite(months) && months > 0 ? Math.ceil(months) : null;
  }
  const withContributions = value + monthly / monthlyRate;
  if (withContributions <= 0) return null;
  const ratio = (goal + monthly / monthlyRate) / withContributions;
  if (ratio <= 1) return 0;
  const months = Math.log(ratio) / Math.log(1 + monthlyRate);
  return Number.isFinite(months) && months > 0 ? Math.ceil(months) : null;
}

export function formatMonths(value: number): string {
  if (value > 0 && value < 0.05) return "menos de 0,1 meses";
  const rounded = Math.round(value * 10) / 10;
  const text = new Intl.NumberFormat("pt-PT", {
    minimumFractionDigits: Number.isInteger(rounded) ? 0 : 1,
    maximumFractionDigits: 1,
  }).format(rounded);
  return `${text} ${rounded === 1 ? "mês" : "meses"}`;
}

export function formatRate(percent: number): string {
  return new Intl.NumberFormat("pt-PT", { maximumFractionDigits: 1 }).format(percent);
}

export function closingDates(closingDay: number, now = new Date(), count = 24): string[] {
  let start = currentMonth(now);
  const today = Math.min(clampClosingDay(closingDay), daysInMonth(start));
  if (now.getDate() > today) start = shiftMonth(start, 1);
  const dates: string[] = [];
  for (let index = 0; index < count; index += 1) {
    const month = shiftMonth(start, index);
    const day = Math.min(clampClosingDay(closingDay), daysInMonth(month));
    dates.push(`${month}-${String(day).padStart(2, "0")}`);
  }
  return dates;
}

export function closingCalendar(closingDay: number, now = new Date()): string {
  const events = closingDates(closingDay, now).map((date) => {
    const stamp = date.replaceAll("-", "");
    return [
      "BEGIN:VEVENT",
      `UID:lastro-fecho-${stamp}@lastro`,
      `DTSTART;VALUE=DATE:${stamp}`,
      "SUMMARY:Fechar o mês no Lastro",
      "DESCRIPTION:Aportes, ganhos, despesas e cartões.",
      "END:VEVENT",
    ].join("\r\n");
  });
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Lastro//PT", "CALSCALE:GREGORIAN", ...events, "END:VCALENDAR"].join(
    "\r\n",
  );
}
export function flamingoOf(fireGoal: number): number {
  return cents(fireGoal / 2);
}

export function currentMonth(now = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function clampClosingDay(day: number): number {
  if (!Number.isInteger(day) || day < 1 || day > 31) return 1;
  return day;
}

export function daysInMonth(ym: string): number {
  const [year, month] = ym.split("-").map(Number);
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function dueMonth(closingDay: number, now = new Date()): string {
  const month = currentMonth(now);
  const day = Math.min(clampClosingDay(closingDay), daysInMonth(month));
  return now.getDate() >= day ? month : shiftMonth(month, -1);
}

export function isClosingToday(closingDay: number, now = new Date()): boolean {
  const month = currentMonth(now);
  const day = Math.min(clampClosingDay(closingDay), daysInMonth(month));
  return now.getDate() === day;
}

export function formatCloseDay(ym: string, closingDay: number): string {
  const [year, month] = ym.split("-").map(Number);
  const day = Math.min(clampClosingDay(closingDay), daysInMonth(ym));
  const date = new Date(year, month - 1, day);
  return format(date, "d 'de' LLLL", { locale: pt });
}

export function formatWhen(ms: number, now = new Date()): string {
  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) return "";
  const time = format(date, "HH:mm");
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();
  if (sameDay) return `às ${time}`;
  return `a ${format(date, "d 'de' MMM", { locale: pt })} às ${time}`;
}

export function formatSavedAt(ms: number, now = new Date()): string {
  const when = formatWhen(ms, now);
  return when ? `Guardado ${when}` : "";
}

export function shiftMonth(ym: string, delta: number): string {
  const [y, m] = ym.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1 + delta, 1));
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function eachMonth(from: string, to: string): string[] {
  const out: string[] = [];
  let cursor = from;
  while (cursor <= to && out.length < 600) {
    out.push(cursor);
    cursor = shiftMonth(cursor, 1);
  }
  return out;
}

export function isMonth(value: string): boolean {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(value);
}

export function formatMonth(ym: string, style: "long" | "short" = "long"): string {
  const date = parse(`${ym}-01`, "yyyy-MM-dd", new Date());
  const pattern = style === "long" ? "LLLL 'de' yyyy" : "LLL yy";
  const text = format(date, pattern, { locale: pt });
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatMoney(
  value: number,
  currency: CurrencyCode,
  options?: { sign?: boolean },
): string {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: options?.sign ? "exceptZero" : "auto",
  }).format(value);
}

export function formatPlain(value: number): string {
  return new Intl.NumberFormat("pt-PT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(ratio: number): string {
  return new Intl.NumberFormat("pt-PT", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
    signDisplay: "exceptZero",
  }).format(ratio);
}

export function formatShare(ratio: number): string {
  return new Intl.NumberFormat("pt-PT", {
    style: "percent",
    maximumFractionDigits: 0,
  }).format(ratio);
}

export function formatCompact(value: number): string {
  return new Intl.NumberFormat("pt-PT", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function parseAmount(raw: string): number | null {
  const trimmed = raw.trim().replace(/\s/g, "").replace(/[€$£]/g, "");
  if (!trimmed || trimmed === "-" || trimmed === "+" || trimmed === "," || trimmed === ".") {
    return null;
  }
  const normalized = trimmed.includes(",")
    ? trimmed.replace(/\./g, "").replace(",", ".")
    : trimmed;
  if (!/^[+-]?\d+(\.\d+)?$/.test(normalized)) return null;
  const value = Number(normalized);
  if (!Number.isFinite(value)) return null;
  return cents(value);
}
