import { useEffect, useLayoutEffect } from "react";
import { parseBackup } from "@/lib/ledger/backup";
import { selectData, useLedger } from "@/lib/ledger/store";
import type { LedgerData } from "@/lib/ledger/types";

const LEGACY_KEY = "lastro-ledger-v1";

function readLegacyLocal(): LedgerData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LEGACY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { state?: Record<string, unknown> };
    const state = parsed?.state;
    if (!state || typeof state !== "object") return null;
    const result = parseBackup({
      version: 1,
      currency: state.currency,
      monthlyGoal: state.monthlyGoal ?? null,
      fireGoal: state.fireGoal ?? null,
      closingDay: state.closingDay ?? 1,
      platforms: state.platforms ?? [],
      entries: state.entries ?? [],
      products: state.products ?? [],
      productEntries: state.productEntries ?? [],
      expenseTypes: state.expenseTypes ?? [],
      expenses: state.expenses ?? [],
      cashbackCards: state.cashbackCards ?? [],
      cashbacks: state.cashbacks ?? [],
      incomeSources: state.incomeSources ?? [],
      incomes: state.incomes ?? [],
      demo: state.demo === true,
    });
    if (typeof result === "string") return null;
    const blank =
      result.platforms.length === 0 &&
      result.entries.length === 0 &&
      result.expenseTypes.length === 0 &&
      result.expenses.length === 0 &&
      result.cashbackCards.length === 0 &&
      result.cashbacks.length === 0 &&
      result.incomeSources.length === 0 &&
      result.incomes.length === 0 &&
      result.monthlyGoal == null &&
      result.fireGoal == null;
    return blank ? null : result;
  } catch {
    return null;
  }
}

export function LocalLedger() {
  const loadAttempt = useLedger((state) => state.loadAttempt);
  const ready = useLedger((state) => state.ready);

  useLayoutEffect(() => {
    useLedger.getState().adopt(readLegacyLocal());
  }, [loadAttempt]);

  useEffect(() => {
    if (!ready) return;
    const persist = () => {
      try {
        window.localStorage.setItem(
          LEGACY_KEY,
          JSON.stringify({ state: selectData(useLedger.getState()) }),
        );
        if (useLedger.getState().syncError) useLedger.setState({ syncError: null });
      } catch {
        useLedger.setState({ syncError: "Não consegui guardar neste dispositivo." });
      }
    };
    return useLedger.subscribe(persist);
  }, [ready]);

  return null;
}
