import { useEffect, useLayoutEffect } from "react";
import { parseBackup, toBackup } from "@/lib/ledger/backup";
import { loadLedger, saveLedger } from "@/lib/ledger/remote";
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
      expenseTypes: state.expenseTypes ?? [],
      expenses: state.expenses ?? [],
      cashbackCards: state.cashbackCards ?? [],
      cashbacks: state.cashbacks ?? [],
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
      result.monthlyGoal == null &&
      result.fireGoal == null;
    return blank ? null : result;
  } catch {
    return null;
  }
}

export function LedgerSync({ userId }: { userId: string }) {
  const loadAttempt = useLedger((state) => state.loadAttempt);
  const ready = useLedger((state) => state.ready);

  useLayoutEffect(() => {
    useLedger.getState().prepareAccount();
  }, [userId, loadAttempt]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const remote = await loadLedger();
        if (cancelled) return;
        if (remote) {
          useLedger.getState().adopt(remote);
          return;
        }
        const local = readLegacyLocal();
        if (local) {
          useLedger.getState().adopt(local);
          try {
            await saveLedger({ data: toBackup(local) });
            window.localStorage.removeItem(LEGACY_KEY);
          } catch {
            useLedger.setState({
              syncError: "Encontrei os números neste telemóvel, mas ainda não os guardei na conta.",
            });
          }
          return;
        }
        useLedger.getState().adopt(null);
      } catch {
        if (!cancelled) useLedger.getState().failLoad("Não consegui abrir a tua caderneta.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId, loadAttempt]);

  useEffect(() => {
    if (!ready) return;
    let timer = 0;
    let last = JSON.stringify(selectData(useLedger.getState()));

    const flush = () => {
      const data = selectData(useLedger.getState());
      const sent = JSON.stringify(data);
      last = sent;
      useLedger.setState({ saving: true });
      void saveLedger({ data: toBackup(data) })
        .then(() => {
          if (JSON.stringify(selectData(useLedger.getState())) === sent) {
            useLedger.setState({ saving: false, syncError: null });
          }
        })
        .catch(() => {
          useLedger.setState({
            saving: false,
            syncError: "Não guardei esta alteração. Os números continuam neste ecrã.",
          });
        });
    };

    const unsub = useLedger.subscribe((state) => {
      const next = JSON.stringify(selectData(state));
      if (next === last) return;
      window.clearTimeout(timer);
      timer = window.setTimeout(flush, 450);
    });

    const onHide = () => {
      const next = JSON.stringify(selectData(useLedger.getState()));
      if (next === last) return;
      window.clearTimeout(timer);
      flush();
    };
    window.addEventListener("pagehide", onHide);

    return () => {
      unsub();
      window.clearTimeout(timer);
      window.removeEventListener("pagehide", onHide);
    };
  }, [ready, userId]);

  return null;
}
