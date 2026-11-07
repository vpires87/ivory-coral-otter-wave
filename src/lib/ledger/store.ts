import { create } from "zustand";
import { parseBackup } from "@/lib/ledger/backup";
import { cents, clampClosingDay } from "@/lib/ledger/money";
import { demoLedger } from "@/lib/ledger/demo";
import type { CurrencyCode, IncomeKind, LedgerData, Platform, PlatformKind } from "@/lib/ledger/types";

type DraftPlatform = {
  name: string;
  kind: PlatformKind;
  openingInvested: number;
};

type EntryInput = {
  platformId: string;
  month: string;
  contributed: number;
  endValue: number;
};

type Store = LedgerData & {
  ready: boolean;
  saving: boolean;
  syncError: string | null;
  loadAttempt: number;
  setCurrency: (currency: CurrencyCode) => void;
  setMonthlyGoal: (goal: number | null) => void;
  setFireGoal: (goal: number | null) => void;
  setClosingDay: (day: number) => void;
  addPlatform: (draft: DraftPlatform) => string;
  updatePlatform: (id: string, draft: DraftPlatform) => void;
  deletePlatform: (id: string) => void;
  upsertEntry: (input: EntryInput) => void;
  deleteEntry: (id: string) => void;
  addProduct: (platformId: string, name: string) => string;
  renameProduct: (id: string, name: string) => void;
  deleteProduct: (id: string) => void;
  saveProductMonth: (
    platformId: string,
    month: string,
    lines: { productId: string; contributed: number; endValue: number }[],
  ) => void;
  addExpenseType: (name: string) => string;
  renameExpenseType: (id: string, name: string) => void;
  deleteExpenseType: (id: string) => void;
  upsertExpense: (input: { typeId: string; month: string; amount: number }) => void;
  addCashbackCard: (name: string) => string;
  renameCashbackCard: (id: string, name: string) => void;
  deleteCashbackCard: (id: string) => void;
  upsertCashback: (input: { cardId: string; month: string; amount: number }) => void;
  addIncomeSource: (name: string, kind: IncomeKind) => string;
  renameIncomeSource: (id: string, name: string) => void;
  setIncomeKind: (id: string, kind: IncomeKind) => void;
  deleteIncomeSource: (id: string) => void;
  upsertIncome: (input: { sourceId: string; month: string; amount: number }) => void;
  loadDemo: () => void;
  keepDemo: () => void;
  reset: () => void;
  importData: (raw: unknown) => string | null;
  prepareAccount: () => void;
  adopt: (data: LedgerData | null) => void;
  failLoad: (message: string) => void;
  retryLoad: () => void;
  remote: boolean;
  setRemote: (remote: boolean) => void;
};

const empty: LedgerData = {
  platforms: [],
  entries: [],
  products: [],
  productEntries: [],
  expenseTypes: [],
  expenses: [],
  cashbackCards: [],
  cashbacks: [],
  incomeSources: [],
  incomes: [],
  currency: "EUR",
  monthlyGoal: null,
  fireGoal: null,
  closingDay: 1,
  demo: false,
};

export const useLedger = create<Store>()((set) => ({
  ...empty,
  ready: true,
  saving: false,
  syncError: null,
  loadAttempt: 0,
  remote: false,
  setCurrency: (currency) => set({ currency }),
  setMonthlyGoal: (goal) => set({ monthlyGoal: goal == null || goal <= 0 ? null : cents(goal) }),
  setFireGoal: (goal) => set({ fireGoal: goal == null || goal <= 0 ? null : cents(goal) }),
  setClosingDay: (day) => set({ closingDay: clampClosingDay(day) }),
  addPlatform: (draft) => {
    const id = crypto.randomUUID();
    set((state) => ({
      platforms: [
        ...state.platforms,
        {
          id,
          name: draft.name.trim(),
          kind: draft.kind,
          openingInvested: cents(draft.openingInvested),
        },
      ],
    }));
    return id;
  },
  updatePlatform: (id, draft) =>
    set((state) => ({
      platforms: state.platforms.map((platform) =>
        platform.id === id
          ? {
              ...platform,
              name: draft.name.trim(),
              kind: draft.kind,
              openingInvested: cents(draft.openingInvested),
            }
          : platform,
      ),
    })),
  deletePlatform: (id) =>
    set((state) => ({
      platforms: state.platforms.filter((platform) => platform.id !== id),
      entries: state.entries.filter((entry) => entry.platformId !== id),
      products: state.products.filter((product) => product.platformId !== id),
      productEntries: state.productEntries.filter((entry) =>
        state.products.some((product) => product.platformId !== id && product.id === entry.productId),
      ),
    })),
  upsertEntry: (input) =>
    set((state) => {
      const index = state.entries.findIndex(
        (entry) => entry.platformId === input.platformId && entry.month === input.month,
      );
      const next = {
        contributed: cents(input.contributed),
        endValue: cents(input.endValue),
      };
      if (index >= 0) {
        const entries = state.entries.slice();
        entries[index] = { ...entries[index], ...next };
        return { entries };
      }
      return {
        entries: [
          ...state.entries,
          {
            id: crypto.randomUUID(),
            platformId: input.platformId,
            month: input.month,
            ...next,
          },
        ],
      };
    }),
  deleteEntry: (id) =>
    set((state) => {
      const entry = state.entries.find((item) => item.id === id);
      const productIds = new Set(
        entry ? state.products.filter((product) => product.platformId === entry.platformId).map((product) => product.id) : [],
      );
      return {
        entries: state.entries.filter((item) => item.id !== id),
        productEntries: entry
          ? state.productEntries.filter((item) => item.month !== entry.month || !productIds.has(item.productId))
          : state.productEntries,
      };
    }),
  addProduct: (platformId, name) => {
    const trimmed = name.trim();
    const created = crypto.randomUUID();
    let result: string = created;
    set((state) => {
      const existing = state.products.find(
        (product) => product.platformId === platformId && product.name.toLowerCase() === trimmed.toLowerCase(),
      );
      if (existing) {
        result = existing.id;
        return {};
      }
      return { products: [...state.products, { id: created, platformId, name: trimmed }] };
    });
    return result;
  },
  renameProduct: (id, name) =>
    set((state) => ({
      products: state.products.map((product) => (product.id === id ? { ...product, name: name.trim() } : product)),
    })),
  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((product) => product.id !== id),
      productEntries: state.productEntries.filter((entry) => entry.productId !== id),
    })),
  saveProductMonth: (platformId, month, lines) =>
    set((state) => {
      const ids = new Set(state.products.filter((product) => product.platformId === platformId).map((product) => product.id));
      const kept = state.productEntries.filter((entry) => entry.month !== month || !ids.has(entry.productId));
      let contributed = 0;
      let endValue = 0;
      const nextLines = lines
        .filter((line) => ids.has(line.productId))
        .map((line) => {
          contributed = cents(contributed + line.contributed);
          endValue = cents(endValue + line.endValue);
          const previous = state.productEntries.find(
            (entry) => entry.productId === line.productId && entry.month === month,
          );
          return {
            id: previous?.id ?? crypto.randomUUID(),
            productId: line.productId,
            month,
            contributed: cents(line.contributed),
            endValue: cents(line.endValue),
          };
        });
      const entryIndex = state.entries.findIndex((entry) => entry.platformId === platformId && entry.month === month);
      const entries = state.entries.slice();
      if (entryIndex >= 0) {
        entries[entryIndex] = { ...entries[entryIndex], contributed, endValue };
      } else {
        entries.push({
          id: crypto.randomUUID(),
          platformId,
          month,
          contributed,
          endValue,
        });
      }
      return { productEntries: [...kept, ...nextLines], entries };
    }),
  addExpenseType: (name) => {
    const id = crypto.randomUUID();
    set((state) => ({
      expenseTypes: [...state.expenseTypes, { id, name: name.trim() }],
    }));
    return id;
  },
  renameExpenseType: (id, name) =>
    set((state) => ({
      expenseTypes: state.expenseTypes.map((type) =>
        type.id === id ? { ...type, name: name.trim() } : type,
      ),
    })),
  deleteExpenseType: (id) =>
    set((state) => ({
      expenseTypes: state.expenseTypes.filter((type) => type.id !== id),
      expenses: state.expenses.filter((entry) => entry.typeId !== id),
    })),
  upsertExpense: (input) =>
    set((state) => {
      const index = state.expenses.findIndex(
        (entry) => entry.typeId === input.typeId && entry.month === input.month,
      );
      const amount = cents(input.amount);
      if (index >= 0) {
        const expenses = state.expenses.slice();
        expenses[index] = { ...expenses[index], amount };
        return { expenses };
      }
      return {
        expenses: [
          ...state.expenses,
          { id: crypto.randomUUID(), typeId: input.typeId, month: input.month, amount },
        ],
      };
    }),
  addCashbackCard: (name) => {
    const id = crypto.randomUUID();
    set((state) => ({
      cashbackCards: [...state.cashbackCards, { id, name: name.trim() }],
    }));
    return id;
  },
  renameCashbackCard: (id, name) =>
    set((state) => ({
      cashbackCards: state.cashbackCards.map((card) =>
        card.id === id ? { ...card, name: name.trim() } : card,
      ),
    })),
  deleteCashbackCard: (id) =>
    set((state) => ({
      cashbackCards: state.cashbackCards.filter((card) => card.id !== id),
      cashbacks: state.cashbacks.filter((entry) => entry.cardId !== id),
    })),
  upsertCashback: (input) =>
    set((state) => {
      const index = state.cashbacks.findIndex(
        (entry) => entry.cardId === input.cardId && entry.month === input.month,
      );
      const amount = cents(input.amount);
      if (index >= 0) {
        const cashbacks = state.cashbacks.slice();
        cashbacks[index] = { ...cashbacks[index], amount };
        return { cashbacks };
      }
      return {
        cashbacks: [
          ...state.cashbacks,
          { id: crypto.randomUUID(), cardId: input.cardId, month: input.month, amount },
        ],
      };
    }),
  addIncomeSource: (name, kind) => {
    const id = crypto.randomUUID();
    set((state) => ({
      incomeSources: [...state.incomeSources, { id, name: name.trim(), kind }],
    }));
    return id;
  },
  renameIncomeSource: (id, name) =>
    set((state) => ({
      incomeSources: state.incomeSources.map((source) =>
        source.id === id ? { ...source, name: name.trim() } : source,
      ),
    })),
  setIncomeKind: (id, kind) =>
    set((state) => ({
      incomeSources: state.incomeSources.map((source) => (source.id === id ? { ...source, kind } : source)),
    })),
  deleteIncomeSource: (id) =>
    set((state) => ({
      incomeSources: state.incomeSources.filter((source) => source.id !== id),
      incomes: state.incomes.filter((entry) => entry.sourceId !== id),
    })),
  upsertIncome: (input) =>
    set((state) => {
      const index = state.incomes.findIndex(
        (entry) => entry.sourceId === input.sourceId && entry.month === input.month,
      );
      const amount = cents(input.amount);
      if (index >= 0) {
        const incomes = state.incomes.slice();
        incomes[index] = { ...incomes[index], amount };
        return { incomes };
      }
      return {
        incomes: [
          ...state.incomes,
          { id: crypto.randomUUID(), sourceId: input.sourceId, month: input.month, amount },
        ],
      };
    }),
  loadDemo: () => set({ ...demoLedger(), ready: true }),
  keepDemo: () => set({ demo: false }),
  reset: () => set({ ...empty, ready: true }),
  importData: (raw) => {
    const parsed = parseBackup(raw);
    if (typeof parsed === "string") return parsed;
    set({ ...parsed, ready: true });
    return null;
  },
  prepareAccount: () => set({ ...empty, ready: false, saving: false, syncError: null }),
  adopt: (data) => set({ ...(data ?? empty), ready: true, saving: false, syncError: null }),
  failLoad: (message) => set({ ...empty, ready: false, saving: false, syncError: message }),
  retryLoad: () => set((state) => ({ loadAttempt: state.loadAttempt + 1, syncError: null, ready: false })),
  setRemote: (remote) => set({ remote }),
}));

export function selectData(state: Store): LedgerData {
  return {
    platforms: state.platforms,
    entries: state.entries,
    products: state.products,
    productEntries: state.productEntries,
    expenseTypes: state.expenseTypes,
    expenses: state.expenses,
    cashbackCards: state.cashbackCards,
    cashbacks: state.cashbacks,
    incomeSources: state.incomeSources,
    incomes: state.incomes,
    currency: state.currency,
    monthlyGoal: state.monthlyGoal,
    fireGoal: state.fireGoal,
    closingDay: state.closingDay,
    demo: state.demo,
  };
}

export type { Platform };
