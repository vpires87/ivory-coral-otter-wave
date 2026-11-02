import { cents, clampClosingDay, isMonth } from "@/lib/ledger/money";
import {
  CURRENCIES,
  PLATFORM_KINDS,
  type CurrencyCode,
  type ExpenseEntry,
  type ExpenseType,
  type CashbackCard,
  type CashbackEntry,
  type IncomeEntry,
  type IncomeKind,
  type IncomeSource,
  type LedgerData,
  type PlatformKind,
  type Product,
  type ProductEntry,
} from "@/lib/ledger/types";

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

  let monthlyGoal: number | null = null;
  if (data.monthlyGoal != null) {
    const goal = asMoney(data.monthlyGoal);
    if (goal == null || goal < 0) return "A meta mensal é inválida.";
    monthlyGoal = goal > 0 ? goal : null;
  }

  let fireGoal: number | null = null;
  if (data.fireGoal != null) {
    const goal = asMoney(data.fireGoal);
    if (goal == null || goal < 0) return "O objetivo FIRE é inválido.";
    fireGoal = goal > 0 ? goal : null;
  }

  let closingDay = 1;
  if (data.closingDay != null) {
    if (typeof data.closingDay !== "number" || !Number.isInteger(data.closingDay)) {
      return "O dia de fecho é inválido.";
    }
    closingDay = clampClosingDay(data.closingDay);
    if (data.closingDay < 1 || data.closingDay > 31) return "O dia de fecho é inválido.";
  }

  const expenseTypes: ExpenseType[] = [];
  const seenTypes = new Set<string>();
  const typeRows = data.expenseTypes == null ? [] : data.expenseTypes;
  if (!Array.isArray(typeRows)) return "Os tipos de despesa do ficheiro são inválidos.";
  if (typeRows.length > 40) return "Há tipos de despesa a mais.";
  for (const item of typeRows) {
    const row = asRecord(item);
    if (!row) return "Há um tipo de despesa inválido.";
    if (typeof row.id !== "string" || row.id.length < 1 || row.id.length > 80) {
      return "Há um tipo de despesa sem identificador válido.";
    }
    if (seenTypes.has(row.id)) return "Há tipos de despesa repetidos.";
    seenTypes.add(row.id);
    if (typeof row.name !== "string" || row.name.trim().length < 1 || row.name.trim().length > 40) {
      return "Há um tipo de despesa com nome inválido.";
    }
    expenseTypes.push({ id: row.id, name: row.name.trim() });
  }

  const expenses: ExpenseEntry[] = [];
  const seenExpenses = new Set<string>();
  const expenseRows = data.expenses == null ? [] : data.expenses;
  if (!Array.isArray(expenseRows)) return "As despesas do ficheiro são inválidas.";
  if (expenseRows.length > 8000) return "O ficheiro é demasiado grande.";
  for (const item of expenseRows) {
    const row = asRecord(item);
    if (!row) return "Há uma despesa inválida.";
    if (typeof row.id !== "string" || row.id.length < 1 || row.id.length > 80) {
      return "Há uma despesa sem identificador válido.";
    }
    if (typeof row.typeId !== "string" || !seenTypes.has(row.typeId)) {
      return "Há uma despesa ligada a um tipo que não existe.";
    }
    if (typeof row.month !== "string" || !isMonth(row.month)) return "Há uma despesa com mês inválido.";
    const key = `${row.typeId}|${row.month}`;
    if (seenExpenses.has(key)) return "Há duas despesas do mesmo tipo no mesmo mês.";
    seenExpenses.add(key);
    const amount = asMoney(row.amount);
    if (amount == null || amount < 0) return "Há um valor de despesa inválido.";
    expenses.push({ id: row.id, typeId: row.typeId, month: row.month, amount });
  }

  const cashbackCards: CashbackCard[] = [];
  const seenCards = new Set<string>();
  const cardRows = data.cashbackCards == null ? [] : data.cashbackCards;
  if (!Array.isArray(cardRows)) return "Os cartões do ficheiro são inválidos.";
  if (cardRows.length > 30) return "Há cartões a mais.";
  for (const item of cardRows) {
    const row = asRecord(item);
    if (!row) return "Há um cartão inválido.";
    if (typeof row.id !== "string" || row.id.length < 1 || row.id.length > 80) {
      return "Há um cartão sem identificador válido.";
    }
    if (seenCards.has(row.id)) return "Há cartões repetidos.";
    seenCards.add(row.id);
    if (typeof row.name !== "string" || row.name.trim().length < 1 || row.name.trim().length > 40) {
      return "Há um cartão com nome inválido.";
    }
    cashbackCards.push({ id: row.id, name: row.name.trim() });
  }

  const cashbacks: CashbackEntry[] = [];
  const seenCash = new Set<string>();
  const cashRows = data.cashbacks == null ? [] : data.cashbacks;
  if (!Array.isArray(cashRows)) return "O cashback do ficheiro é inválido.";
  if (cashRows.length > 8000) return "O ficheiro é demasiado grande.";
  for (const item of cashRows) {
    const row = asRecord(item);
    if (!row) return "Há um cashback inválido.";
    if (typeof row.id !== "string" || row.id.length < 1 || row.id.length > 80) {
      return "Há um cashback sem identificador válido.";
    }
    if (typeof row.cardId !== "string" || !seenCards.has(row.cardId)) {
      return "Há cashback ligado a um cartão que não existe.";
    }
    if (typeof row.month !== "string" || !isMonth(row.month)) return "Há cashback com mês inválido.";
    const key = `${row.cardId}|${row.month}`;
    if (seenCash.has(key)) return "Há dois cashbacks do mesmo cartão no mesmo mês.";
    seenCash.add(key);
    const amount = asMoney(row.amount);
    if (amount == null || amount < 0) return "Há um valor de cashback inválido.";
    cashbacks.push({ id: row.id, cardId: row.cardId, month: row.month, amount });
  }

  const incomeKinds = new Set<string>(["ordenado", "extra"]);
  const incomeSources: IncomeSource[] = [];
  const seenSources = new Set<string>();
  const sourceRows = data.incomeSources == null ? [] : data.incomeSources;
  if (!Array.isArray(sourceRows)) return "Os ganhos do ficheiro são inválidos.";
  if (sourceRows.length > 40) return "Há fontes de rendimento a mais.";
  for (const item of sourceRows) {
    const row = asRecord(item);
    if (!row) return "Há um rendimento inválido.";
    if (typeof row.id !== "string" || row.id.length < 1 || row.id.length > 80) {
      return "Há um rendimento sem identificador válido.";
    }
    if (seenSources.has(row.id)) return "Há rendimentos repetidos.";
    seenSources.add(row.id);
    if (typeof row.name !== "string" || row.name.trim().length < 1 || row.name.trim().length > 40) {
      return "Há um rendimento com nome inválido.";
    }
    if (typeof row.kind !== "string" || !incomeKinds.has(row.kind)) return "Há um tipo de rendimento inválido.";
    incomeSources.push({ id: row.id, name: row.name.trim(), kind: row.kind as IncomeKind });
  }

  const incomes: IncomeEntry[] = [];
  const seenIncome = new Set<string>();
  const incomeRows = data.incomes == null ? [] : data.incomes;
  if (!Array.isArray(incomeRows)) return "Os valores ganhos do ficheiro são inválidos.";
  if (incomeRows.length > 8000) return "O ficheiro é demasiado grande.";
  for (const item of incomeRows) {
    const row = asRecord(item);
    if (!row) return "Há um ganho inválido.";
    if (typeof row.id !== "string" || row.id.length < 1 || row.id.length > 80) {
      return "Há um ganho sem identificador válido.";
    }
    if (typeof row.sourceId !== "string" || !seenSources.has(row.sourceId)) {
      return "Há um ganho ligado a uma fonte que não existe.";
    }
    if (typeof row.month !== "string" || !isMonth(row.month)) return "Há um ganho com mês inválido.";
    const key = `${row.sourceId}|${row.month}`;
    if (seenIncome.has(key)) return "Há dois ganhos da mesma fonte no mesmo mês.";
    seenIncome.add(key);
    const amount = asMoney(row.amount);
    if (amount == null || amount < 0) return "Há um valor de ganho inválido.";
    incomes.push({ id: row.id, sourceId: row.sourceId, month: row.month, amount });
  }

  const products: Product[] = [];
  const seenProducts = new Set<string>();
  const productRows = data.products == null ? [] : data.products;
  if (!Array.isArray(productRows)) return "Os produtos do ficheiro são inválidos.";
  if (productRows.length > 400) return "Há produtos a mais.";
  for (const item of productRows) {
    const row = asRecord(item);
    if (!row) return "Há um produto inválido.";
    if (typeof row.id !== "string" || row.id.length < 1 || row.id.length > 80) {
      return "Há um produto sem identificador válido.";
    }
    if (seenProducts.has(row.id)) return "Há produtos repetidos.";
    seenProducts.add(row.id);
    if (typeof row.platformId !== "string" || !seenPlatforms.has(row.platformId)) {
      return "Há um produto ligado a uma plataforma que não existe.";
    }
    if (typeof row.name !== "string" || row.name.trim().length < 1 || row.name.trim().length > 40) {
      return "Há um produto com nome inválido.";
    }
    products.push({ id: row.id, platformId: row.platformId, name: row.name.trim() });
  }

  const productEntries: ProductEntry[] = [];
  const seenProductMonths = new Set<string>();
  const productEntryRows = data.productEntries == null ? [] : data.productEntries;
  if (!Array.isArray(productEntryRows)) return "Os meses dos produtos são inválidos.";
  if (productEntryRows.length > 8000) return "O ficheiro é demasiado grande.";
  for (const item of productEntryRows) {
    const row = asRecord(item);
    if (!row) return "Há um mês de produto inválido.";
    if (typeof row.id !== "string" || row.id.length < 1 || row.id.length > 80) {
      return "Há um mês de produto sem identificador válido.";
    }
    if (typeof row.productId !== "string" || !seenProducts.has(row.productId)) {
      return "Há um mês ligado a um produto que não existe.";
    }
    if (typeof row.month !== "string" || !isMonth(row.month)) return "Há um produto com mês inválido.";
    const key = `${row.productId}|${row.month}`;
    if (seenProductMonths.has(key)) return "Há dois registos do mesmo produto no mesmo mês.";
    seenProductMonths.add(key);
    const contributed = asMoney(row.contributed);
    const endValue = asMoney(row.endValue);
    if (contributed == null || endValue == null || endValue < 0) return "Há um valor de produto inválido.";
    productEntries.push({
      id: row.id,
      productId: row.productId,
      month: row.month,
      contributed,
      endValue,
    });
  }

  return {
    currency: data.currency as CurrencyCode,
    platforms,
    entries,
    products,
    productEntries,
    expenseTypes,
    expenses,
    cashbackCards,
    cashbacks,
    incomeSources,
    incomes,
    monthlyGoal,
    fireGoal,
    closingDay,
    demo: data.demo === true,
  };
}

export function toBackup(data: LedgerData) {
  return {
    version: 1 as const,
    app: "lastro",
    exportedAt: new Date().toISOString(),
    currency: data.currency,
    monthlyGoal: data.monthlyGoal,
    fireGoal: data.fireGoal,
    closingDay: data.closingDay,
    platforms: data.platforms,
    entries: data.entries,
    products: data.products,
    productEntries: data.productEntries,
    expenseTypes: data.expenseTypes,
    expenses: data.expenses,
    cashbackCards: data.cashbackCards,
    cashbacks: data.cashbacks,
    incomeSources: data.incomeSources,
    incomes: data.incomes,
    demo: data.demo,
  };
}
