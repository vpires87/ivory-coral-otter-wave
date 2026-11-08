import { useEffect, useLayoutEffect } from "react";
import { LastroApp } from "@/components/ledger/app";
import { AccountGate } from "@/components/ledger/account-gate";
import { parseBackup, toBackup } from "@/lib/ledger/backup";
import { loadLedger, saveLedger } from "@/lib/ledger/remote";
import { selectData, useLedger } from "@/lib/ledger/store";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import type { LedgerData } from "@/lib/ledger/types";

const LEGACY_KEY = "lastro-ledger-v1";

function readLegacyEnvelope(): { data: LedgerData; savedAt: number | null } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LEGACY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { state?: Record<string, unknown>; savedAt?: unknown };
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
    if (blank) return null;
    const savedAt = typeof parsed.savedAt === "number" && Number.isFinite(parsed.savedAt) ? parsed.savedAt : null;
    return { data: result, savedAt };
  } catch {
    return null;
  }
}

export function LocalLedger() {
  const loadAttempt = useLedger((state) => state.loadAttempt);
  const ready = useLedger((state) => state.ready);

  useLayoutEffect(() => {
    const found = readLegacyEnvelope();
    useLedger.getState().adopt(found?.data ?? null);
    if (found?.savedAt != null) useLedger.setState({ savedAt: found.savedAt });
  }, [loadAttempt]);

  useEffect(() => {
    if (!ready) return;
    let seen = JSON.stringify(selectData(useLedger.getState()));
    const persist = () => {
      const data = selectData(useLedger.getState());
      const payload = JSON.stringify(data);
      if (payload === seen) return;
      seen = payload;
      const savedAt = Date.now();
      try {
        window.localStorage.setItem(LEGACY_KEY, JSON.stringify({ state: data, savedAt }));
        useLedger.setState({ syncError: null, savedAt });
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

  useEffect(() => {
    let stop = false;
    let unsub = () => {};
    let timer = 0;
    let writing = false;
    let dirty = false;
    let applying = false;
    let conflicted = false;
    let forceNext = false;
    let last = "";
    let seen = "";
    let retries = 0;
    let expected: number | null = null;
    const snapshot = () => JSON.stringify(selectData(useLedger.getState()));

    const flush = () => {
      if (stop || applying || conflicted) return;
      if (writing) {
        dirty = true;
        return;
      }
      const payload = snapshot();
      const force = forceNext;
      forceNext = false;
      writing = true;
      dirty = false;
      useLedger.setState({ saving: true });
      void saveLedger({
        data: {
          ledger: toBackup(JSON.parse(payload) as LedgerData),
          expectedUpdatedAt: expected,
          force,
        },
      })
        .then((result) => {
          if (stop) return;
          writing = false;
          if (!result.ok) {
            conflicted = true;
            useLedger.setState({ saving: false, syncError: null, conflictAt: result.updatedAt });
            return;
          }
          last = payload;
          expected = result.updatedAt;
          retries = 0;
          useLedger.setState({
            saving: false,
            syncError: null,
            savedAt: result.updatedAt,
            conflictAt: null,
          });
          if (dirty || snapshot() !== last) flush();
        })
        .catch((err: unknown) => {
          if (stop) return;
          writing = false;
          retries += 1;
          const detail = err instanceof Error ? err.message.slice(0, 180) : "";
          useLedger.setState({
            saving: false,
            syncError: detail
              ? `Não consegui guardar na base de dados. ${detail}`
              : "Não consegui guardar na base de dados.",
          });
          if (retries >= 3) return;
          window.clearTimeout(timer);
          timer = window.setTimeout(() => {
            if (!stop && snapshot() !== last) flush();
          }, 1200);
        });
    };

    const schedule = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(flush, 250);
    };

    const reloadRemote = async () => {
      applying = true;
      window.clearTimeout(timer);
      try {
        const remote = await loadLedger();
        if (stop) return;
        useLedger.getState().adopt(remote.data);
        expected = remote.updatedAt;
        last = snapshot();
        seen = last;
        conflicted = false;
        useLedger.setState({
          savedAt: remote.updatedAt,
          conflictAt: null,
          syncError: null,
          saving: false,
        });
      } catch (err: unknown) {
        if (stop) return;
        const detail = err instanceof Error ? err.message.slice(0, 180) : "";
        useLedger.setState({
          saving: false,
          syncError: detail
            ? `Não consegui ler a caderneta na base de dados. ${detail}`
            : "Não consegui ler a caderneta na base de dados.",
        });
      } finally {
        applying = false;
      }
    };

    void (async () => {
      useLedger.getState().setRemote(true);
      useLedger.getState().prepareAccount();
      try {
        const remote = await loadLedger();
        if (stop) return;
        const local = readLegacyEnvelope();
        const bring = remote.data ?? (local && !local.data.demo ? local.data : null);
        useLedger.getState().adopt(bring);
        if (stop) return;
        expected = remote.updatedAt;
        if (!remote.data && local?.data.demo) useLedger.setState({ deviceDemo: true });
        if (remote.updatedAt != null) useLedger.setState({ savedAt: remote.updatedAt });
        last = snapshot();
        seen = last;
        unsub = useLedger.subscribe(() => {
          if (stop || applying) return;
          const choice = useLedger.getState().pendingSync;
          if (choice === "reload") {
            useLedger.setState({ pendingSync: null });
            void reloadRemote();
            return;
          }
          if (choice === "overwrite") {
            useLedger.setState({ pendingSync: null, conflictAt: null });
            conflicted = false;
            forceNext = true;
            flush();
            return;
          }
          const next = snapshot();
          if (next === seen) return;
          seen = next;
          retries = 0;
          if (conflicted) return;
          schedule();
        });
        if (!remote.data && bring) schedule();
      } catch (err: unknown) {
        if (stop) return;
        const detail = err instanceof Error ? err.message : "";
        useLedger.getState().failLoad(
          detail ? `Não consegui ler a caderneta na base de dados. ${detail}` : "Não consegui ler a caderneta na base de dados.",
        );
      }
    })();

    const onHide = () => {
      if (document.visibilityState === "hidden") flush();
    };
    document.addEventListener("visibilitychange", onHide);

    return () => {
      stop = true;
      unsub();
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onHide);
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
  if (isPending) {
    return (
      <main className="grid min-h-dvh place-items-center px-4">
        <p className="text-sm text-muted">A abrir a caderneta…</p>
      </main>
    );
  }
  if (!user || user.isDevFallback) return <AccountGate />;
  return (
    <>
      <PostgresLedger />
      <LastroApp />
    </>
  );
}
