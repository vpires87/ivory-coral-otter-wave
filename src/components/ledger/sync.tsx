import { useEffect, useLayoutEffect } from "react";
import { LastroApp } from "@/components/ledger/app";
import { AccountGate } from "@/components/ledger/account-gate";
import { parseBackup, toBackup } from "@/lib/ledger/backup";
import { loadLedger, saveLedger } from "@/lib/ledger/remote";
import { selectData, useLedger } from "@/lib/ledger/store";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
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
        window.localStorage.setItem(LEGACY_KEY, JSON.stringify({ state: selectData(useLedger.getState()) }));
        if (useLedger.getState().syncError) useLedger.setState({ syncError: null });
      } catch {
        useLedger.setState({ syncError: "Não consegui guardar neste dispositivo." });
      }
    };
    return useLedger.subscribe(persist);
  }, [ready]);

  return null;
}

function PostgresLedger() {
  const loadAttempt = useLedger((state) => state.loadAttempt);

  useLayoutEffect(() => {
    useLedger.getState().setRemote(true);
    useLedger.getState().prepareAccount();
  }, [loadAttempt]);

  useEffect(() => {
    let stop = false;
    let unsub = () => {};
    let timer = 0;
    let last = "";
    let failed = "";
    let pending = "";
    const snapshot = () => JSON.stringify(selectData(useLedger.getState()));
    const push = (payload: string) => {
      pending = payload;
      useLedger.setState({ saving: true });
      void saveLedger({ data: toBackup(JSON.parse(payload) as LedgerData) })
        .then(() => {
          if (stop) return;
          last = payload;
          pending = "";
          failed = "";
          useLedger.setState({ saving: false, syncError: null });
        })
        .catch(() => {
          if (stop) return;
          failed = payload;
          pending = "";
          useLedger.setState({ saving: false, syncError: "Não consegui guardar na base de dados." });
        });
    };

    void (async () => {
      try {
        const remote = await loadLedger();
        if (stop) return;
        const local = readLegacyLocal();
        useLedger.getState().adopt(remote ?? local);
        if (!remote && local) await saveLedger({ data: toBackup(local) });
        if (stop) return;
        last = snapshot();
        unsub = useLedger.subscribe(() => {
          const next = snapshot();
          if (next === last || next === failed || next === pending) return;
          window.clearTimeout(timer);
          timer = window.setTimeout(() => push(next), 500);
        });
      } catch {
        if (!stop) useLedger.getState().failLoad("Não consegui ler a caderneta na base de dados.");
      }
    })();

    return () => {
      stop = true;
      unsub();
      window.clearTimeout(timer);
    };
  }, [loadAttempt]);

  return null;
}

export function LedgerHost({
  initial,
}: {
  initial: { mode: "local" | "postgres"; authOff: boolean };
}) {
  const backend = initial.mode === "postgres" && initial.authOff ? "blocked" : initial.mode;

  if (backend === "blocked") {
    return (
      <main className="grid min-h-dvh place-items-center px-4">
        <p className="max-w-sm text-sm text-muted">
          O PostgreSQL está ligado, mas a entrada está desligada. No Ubuntu, define VITE_AUTH_ENABLED=true antes de
          arrancar a aplicação.
        </p>
      </main>
    );
  }
  if (backend === "local") {
    return (
      <>
        <LocalLedger />
        <LastroApp />
      </>
    );
  }
  return <PostgresApp />;
}

function PostgresApp() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) return null;
  if (!user || user.isDevFallback) return <AccountGate />;
  return (
    <>
      <PostgresLedger />
      <LastroApp />
    </>
  );
}
