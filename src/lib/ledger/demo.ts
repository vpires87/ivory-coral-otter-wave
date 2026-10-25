import type { LedgerData, MonthEntry, Platform } from "@/lib/ledger/types";

const platforms: Platform[] = [
  { id: "demo-xtb", name: "XTB", kind: "corretora", openingInvested: 4200 },
  { id: "demo-tr", name: "Trade Republic", kind: "corretora", openingInvested: 1500 },
  { id: "demo-ctt", name: "Banco CTT", kind: "poupanca", openingInvested: 0 },
  { id: "demo-binance", name: "Binance", kind: "cripto", openingInvested: 800 },
];

function row(platformId: string, month: string, contributed: number, endValue: number): MonthEntry {
  return { id: `demo-${platformId}-${month}`, platformId, month, contributed, endValue };
}

const entries: MonthEntry[] = [
  row("demo-xtb", "2026-03", 300, 4680),
  row("demo-xtb", "2026-04", 300, 5050),
  row("demo-xtb", "2026-05", 300, 5290),
  row("demo-xtb", "2026-06", 0, 5410),
  row("demo-xtb", "2026-07", 300, 5820),
  row("demo-xtb", "2026-08", 300, 6240),
  row("demo-xtb", "2026-09", 300, 6710),
  row("demo-tr", "2026-03", 200, 1740),
  row("demo-tr", "2026-04", 200, 1985),
  row("demo-tr", "2026-05", 200, 2230),
  row("demo-tr", "2026-06", 200, 2410),
  row("demo-tr", "2026-07", 250, 2720),
  row("demo-tr", "2026-08", 250, 3010),
  row("demo-tr", "2026-09", 250, 3340),
  row("demo-ctt", "2026-03", 400, 400),
  row("demo-ctt", "2026-04", 0, 401),
  row("demo-ctt", "2026-05", 0, 402),
  row("demo-ctt", "2026-06", 100, 503),
  row("demo-ctt", "2026-07", 0, 504),
  row("demo-ctt", "2026-08", 0, 505),
  row("demo-ctt", "2026-09", 0, 506),
  row("demo-binance", "2026-03", 100, 820),
  row("demo-binance", "2026-04", 0, 1040),
  row("demo-binance", "2026-05", 100, 990),
  row("demo-binance", "2026-06", 0, 760),
  row("demo-binance", "2026-07", 150, 980),
  row("demo-binance", "2026-08", 0, 910),
  row("demo-binance", "2026-09", 100, 1180),
];

export function demoLedger(): LedgerData {
  return {
    platforms: platforms.map((platform) => ({ ...platform })),
    entries: entries.map((entry) => ({ ...entry })),
    currency: "EUR",
    demo: true,
  };
}
