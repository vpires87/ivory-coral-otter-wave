import { format, parse } from "date-fns";
import { pt } from "date-fns/locale";
import type { CurrencyCode } from "@/lib/ledger/types";

export function cents(n: number): number {
  return Math.round(n * 100) / 100;
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
