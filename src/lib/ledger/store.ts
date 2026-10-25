import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { parseBackup } from "@/lib/ledger/backup";
import { cents } from "@/lib/ledger/money";
import { demoLedger } from "@/lib/ledger/demo";
import type { CurrencyCode, LedgerData, Platform, PlatformKind } from "@/lib/ledger/types";

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
  hydrated: boolean;
  setCurrency: (currency: CurrencyCode) => void;
  addPlatform: (draft: DraftPlatform) => string;
  updatePlatform: (id: string, draft: DraftPlatform) => void;
  deletePlatform: (id: string) => void;
  upsertEntry: (input: EntryInput) => void;
  deleteEntry: (id: string) => void;
  loadDemo: () => void;
  keepDemo: () => void;
  reset: () => void;
  importData: (raw: unknown) => string | null;
};

const empty: LedgerData = {
  platforms: [],
  entries: [],
  currency: "EUR",
  demo: false,
};

function memoryStorage(): Storage {
  const jar = new Map<string, string>();
  return {
    get length() {
      return jar.size;
    },
    clear: () => jar.clear(),
    getItem: (key) => jar.get(key) ?? null,
    key: (index) => [...jar.keys()][index] ?? null,
    removeItem: (key) => {
      jar.delete(key);
    },
    setItem: (key, value) => {
      jar.set(key, value);
    },
  };
}

export const useLedger = create<Store>()(
  persist(
    (set) => ({
      ...empty,
      hydrated: false,
      setCurrency: (currency) => set({ currency }),
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
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
        })),
      loadDemo: () => set(demoLedger()),
      keepDemo: () => set({ demo: false }),
      reset: () => set(empty),
      importData: (raw) => {
        const parsed = parseBackup(raw);
        if (typeof parsed === "string") return parsed;
        set(parsed);
        return null;
      },
    }),
    {
      name: "lastro-ledger-v1",
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? memoryStorage() : localStorage,
      ),
      skipHydration: true,
      partialize: (state) => ({
        platforms: state.platforms,
        entries: state.entries,
        currency: state.currency,
        demo: state.demo,
      }),
    },
  ),
);

export function selectData(state: Store): LedgerData {
  return {
    platforms: state.platforms,
    entries: state.entries,
    currency: state.currency,
    demo: state.demo,
  };
}

export type { Platform };
