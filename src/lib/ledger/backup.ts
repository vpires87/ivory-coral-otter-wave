import { cents, isMonth } from "@/lib/ledger/money";
import { CURRENCIES, PLATFORM_KINDS, type CurrencyCode, type LedgerData, type PlatformKind } from "@/lib/ledger/types";

const kinds = new Set<string>(PLATFORM_KINDS.map((kind) => kind.id));
const currencies = new Set<string>(CURRENCIES.map((currency) => currency.id));

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function asMoney(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  if (Math.abs(value) > 1e12) return null;
  return cents(value);
}

export function parseBackup(raw: unknown): LedgerData | string {
  const data = asRecord(raw);
  if (!data || data.version !== 1) return "Este ficheiro não é uma caderneta Lastro.";
  if (!Array.isArray(data.platforms) || !Array.isArray(data.entries)) {
    return "Faltam plataformas ou meses no ficheiro.";
  }
  if (data.platforms.length > 200 || data.entries.length > 8000) {
    return "O ficheiro é demasiado grande.";
  }
  if (typeof data.currency !== "string" || !currencies.has(data.currency)) {
    return "A moeda do ficheiro não é reconhecida.";
  }

  const platforms: LedgerData["platforms"] = [];
  const seenPlatforms = new Set<string>();
  for (const item of data.platforms) {
    const row = asRecord(item);
    if (!row) return "Há uma plataforma inválida no ficheiro.";
    if (typeof row.id !== "string" || row.id.length < 1 || row.id.length > 80) {
      return "Há uma plataforma sem identificador válido.";
    }
    if (seenPlatforms.has(row.id)) return "Há plataformas repetidas no ficheiro.";
    seenPlatforms.add(row.id);
    if (typeof row.name !== "string" || row.name.trim().length < 1 || row.name.trim().length > 80) {
      return "Há uma plataforma com nome inválido.";
    }
    if (typeof row.kind !== "string" || !kinds.has(row.kind)) return "Há um tipo de plataforma inválido.";
    const opening = asMoney(row.openingInvested);
    if (opening == null || opening < 0) return "O capital inicial de uma plataforma é inválido.";
    platforms.push({
      id: row.id,
      name: row.name.trim(),
      kind: row.kind as PlatformKind,
      openingInvested: opening,
    });
  }

  const entries: LedgerData["entries"] = [];
  const seenMonths = new Set<string>();
  for (const item of data.entries) {
    const row = asRecord(item);
    if (!row) return "Há um mês inválido no ficheiro.";
    if (typeof row.id !== "string" || row.id.length < 1 || row.id.length > 80) {
      return "Há um mês sem identificador válido.";
    }
    if (typeof row.platformId !== "string" || !seenPlatforms.has(row.platformId)) {
      return "Há um mês ligado a uma plataforma que não existe.";
    }
    if (typeof row.month !== "string" || !isMonth(row.month)) return "Há um mês com data inválida.";
    const key = `${row.platformId}|${row.month}`;
    if (seenMonths.has(key)) return "Há dois registos para a mesma plataforma no mesmo mês.";
    seenMonths.add(key);
    const contributed = asMoney(row.contributed);
    const endValue = asMoney(row.endValue);
    if (contributed == null || endValue == null || endValue < 0) {
      return "Há um valor mensal inválido.";
    }
    entries.push({
      id: row.id,
      platformId: row.platformId,
      month: row.month,
      contributed,
      endValue,
    });
  }

  return {
    currency: data.currency as CurrencyCode,
    platforms,
    entries,
    demo: false,
  };
}

export function toBackup(data: LedgerData) {
  return {
    version: 1 as const,
    app: "lastro",
    exportedAt: new Date().toISOString(),
    currency: data.currency,
    platforms: data.platforms,
    entries: data.entries,
  };
}
