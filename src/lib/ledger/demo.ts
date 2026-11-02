import type {
  CashbackCard,
  CashbackEntry,
  ExpenseEntry,
  ExpenseType,
  IncomeEntry,
  IncomeSource,
  LedgerData,
  MonthEntry,
  Platform,
  Product,
  ProductEntry,
} from "@/lib/ledger/types";

const platforms: Platform[] = [
  { id: "demo-xtb", name: "XTB", kind: "corretora", openingInvested: 2700 },
  { id: "demo-tr", name: "Trade Republic", kind: "corretora", openingInvested: 700 },
  { id: "demo-ctt", name: "Banco CTT", kind: "poupanca", openingInvested: 0 },
  { id: "demo-binance", name: "Binance", kind: "cripto", openingInvested: 400 },
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

function climb(from: number, to: number, steps: number, index: number): number {
  return Math.round(from + ((to - from) * (index + 1)) / steps);
}

for (let index = 0; index < 10; index += 1) {
  const month = `2025-${String(index + 3).padStart(2, "0")}`;
  entries.push(
    row("demo-xtb", month, 150, climb(2900, 4200, 10, index)),
    row("demo-tr", month, 80, climb(780, 1500, 10, index)),
    row("demo-binance", month, 40, climb(420, 800, 10, index)),
  );
}

const expenseTypes: ExpenseType[] = [
  { id: "demo-renda", name: "Renda" },
  { id: "demo-comida", name: "Alimentação" },
  { id: "demo-transp", name: "Transportes" },
  { id: "demo-lazer", name: "Lazer" },
];

function spent(typeId: string, month: string, amount: number): ExpenseEntry {
  return { id: `demo-${typeId}-${month}`, typeId, month, amount };
}

const food = [260, 280, 310, 290, 300, 270, 295];
const transit = [65, 70, 80, 60, 90, 55, 70];
const leisure = [40, 120, 35, 80, 45, 150, 60];

const expenses: ExpenseEntry[] = [];
for (let index = 0; index < 7; index += 1) {
  const month = `2026-${String(index + 3).padStart(2, "0")}`;
  expenses.push(
    spent("demo-renda", month, 780),
    spent("demo-comida", month, food[index]),
    spent("demo-transp", month, transit[index]),
    spent("demo-lazer", month, leisure[index]),
  );
}

const cashbackCards: CashbackCard[] = [
  { id: "demo-universo", name: "Universo" },
  { id: "demo-ctt-card", name: "CTT" },
  { id: "demo-revolut", name: "Revolut" },
];

const universo = [8, 9, 11, 7, 10, 12, 14];
const cttCard = [3, 4, 3, 5, 4, 6, 4];
const revolut = [6, 8, 15, 9, 11, 7, 18];

function rebate(cardId: string, month: string, amount: number): CashbackEntry {
  return { id: `demo-${cardId}-${month}`, cardId, month, amount };
}

const cashbacks: CashbackEntry[] = [];
for (let index = 0; index < 7; index += 1) {
  const month = `2026-${String(index + 3).padStart(2, "0")}`;
  cashbacks.push(
    rebate("demo-universo", month, universo[index]),
    rebate("demo-ctt-card", month, cttCard[index]),
    rebate("demo-revolut", month, revolut[index]),
  );
}

const incomeSources: IncomeSource[] = [
  { id: "demo-ordenado", name: "Empresa", kind: "ordenado" },
  { id: "demo-extra", name: "Freelance", kind: "extra" },
];

const extras = [0, 150, 0, 400, 0, 200, 0];

function earned(sourceId: string, month: string, amount: number): IncomeEntry {
  return { id: `demo-${sourceId}-${month}`, sourceId, month, amount };
}

const incomes: IncomeEntry[] = [];
for (let index = 0; index < 7; index += 1) {
  const month = `2026-${String(index + 3).padStart(2, "0")}`;
  incomes.push(earned("demo-ordenado", month, 2100));
  if (extras[index] > 0) incomes.push(earned("demo-extra", month, extras[index]));
}

for (let index = 0; index < 10; index += 1) {
  const month = `2025-${String(index + 3).padStart(2, "0")}`;
  expenses.push(
    spent("demo-renda", month, 750),
    spent("demo-comida", month, 240 + (index % 3) * 10),
    spent("demo-transp", month, 55),
    spent("demo-lazer", month, index % 2 === 0 ? 30 : 90),
  );
  incomes.push(earned("demo-ordenado", month, 1950));
  if (index % 4 === 0) incomes.push(earned("demo-extra", month, 120));
}

const products: Product[] = [
  { id: "demo-vwce", platformId: "demo-xtb", name: "VWCE" },
  { id: "demo-sxr8", platformId: "demo-xtb", name: "SXR8" },
];

const productEntries: ProductEntry[] = [
  { id: "demo-vwce-2026-09", productId: "demo-vwce", month: "2026-09", contributed: 200, endValue: 4200 },
  { id: "demo-sxr8-2026-09", productId: "demo-sxr8", month: "2026-09", contributed: 100, endValue: 2510 },
];

export function demoLedger(): LedgerData {
  return {
    platforms: platforms.map((platform) => ({ ...platform })),
    entries: entries.map((entry) => ({ ...entry })),
    products: products.map((product) => ({ ...product })),
    productEntries: productEntries.map((entry) => ({ ...entry })),
    expenseTypes: expenseTypes.map((type) => ({ ...type })),
    expenses: expenses.map((entry) => ({ ...entry })),
    cashbackCards: cashbackCards.map((card) => ({ ...card })),
    cashbacks: cashbacks.map((entry) => ({ ...entry })),
    incomeSources: incomeSources.map((source) => ({ ...source })),
    incomes: incomes.map((entry) => ({ ...entry })),
    currency: "EUR",
    monthlyGoal: 650,
    fireGoal: 50000,
    closingDay: 25,
    demo: true,
  };
}
