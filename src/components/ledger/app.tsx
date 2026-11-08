import { Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cashbackFor, entryFor, expenseFor, incomeFor } from "@/lib/ledger/calc";
import { dueMonth, formatCloseDay, formatMonth, formatSavedAt, formatWhen, isClosingToday } from "@/lib/ledger/money";
import { useLedger } from "@/lib/ledger/store";
import { cn } from "@/lib/utils";
import { CloseView } from "@/components/ledger/close-view";
import { SettingsDialog } from "@/components/ledger/dialogs";
import { SummaryView } from "@/components/ledger/summary";
import { TablesPanel } from "@/components/ledger/tables-panel";
import { Button } from "@/components/ledger/ui";

type Tab = "resumo" | "fecho" | "contas";

const TABS: { id: Tab; label: string }[] = [
  { id: "resumo", label: "Resumo" },
  { id: "fecho", label: "Fechar" },
  { id: "contas", label: "Contas" },
];

export function LastroApp() {
  const ready = useLedger((state) => state.ready);
  const syncError = useLedger((state) => state.syncError);
  const saving = useLedger((state) => state.saving);
  const savedAt = useLedger((state) => state.savedAt);
  const conflictAt = useLedger((state) => state.conflictAt);
  const overwriteRemote = useLedger((state) => state.overwriteRemote);
  const takeRemote = useLedger((state) => state.takeRemote);
  const deviceDemo = useLedger((state) => state.deviceDemo);
  const dismissDeviceDemo = useLedger((state) => state.dismissDeviceDemo);
  const retryLoad = useLedger((state) => state.retryLoad);
  const platforms = useLedger((state) => state.platforms);
  const entries = useLedger((state) => state.entries);
  const expenseTypes = useLedger((state) => state.expenseTypes);
  const expenses = useLedger((state) => state.expenses);
  const cashbackCards = useLedger((state) => state.cashbackCards);
  const cashbacks = useLedger((state) => state.cashbacks);
  const incomeSources = useLedger((state) => state.incomeSources);
  const incomes = useLedger((state) => state.incomes);
  const demo = useLedger((state) => state.demo);
  const currency = useLedger((state) => state.currency);
  const closingDay = useLedger((state) => state.closingDay);
  const keepDemo = useLedger((state) => state.keepDemo);
  const reset = useLedger((state) => state.reset);
  const loadDemo = useLedger((state) => state.loadDemo);
  const remote = useLedger((state) => state.remote);
  const [tab, setTab] = useState<Tab>("resumo");
  const [month, setMonth] = useState(() => dueMonth(1));
  const monthTouched = useRef(false);
  const routedEmpty = useRef(false);
  const scrollTo = useRef<string | null>(null);
  const [platformId, setPlatformId] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const empty =
    platforms.length === 0 &&
    expenseTypes.length === 0 &&
    cashbackCards.length === 0 &&
    incomeSources.length === 0;

  useEffect(() => {
    if (ready && !monthTouched.current) setMonth(dueMonth(closingDay));
  }, [ready, closingDay]);

  useEffect(() => {
    if (!ready || routedEmpty.current) return;
    routedEmpty.current = true;
    if (empty) setTab("contas");
  }, [ready, empty]);

  useEffect(() => {
    if (tab !== "fecho" || !scrollTo.current) return;
    const id = scrollTo.current;
    scrollTo.current = null;
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [tab]);

  function changeMonth(next: string) {
    monthTouched.current = true;
    setMonth(next);
  }

  function openTables() {
    setPlatformId(null);
    setTab("contas");
  }

  function openClose(anchor = "fecho-investimentos") {
    if (tab === "fecho") {
      document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    scrollTo.current = anchor;
    setTab("fecho");
  }

  const tracked =
    platforms.length + incomeSources.length + expenseTypes.length + cashbackCards.length > 0;
  const monthClosed =
    tracked &&
    platforms.every((platform) => entryFor(entries, platform.id, month)) &&
    incomeSources.every((source) => incomeFor(incomes, source.id, month)) &&
    expenseTypes.every((type) => expenseFor(expenses, type.id, month)) &&
    cashbackCards.every((card) => cashbackFor(cashbacks, card.id, month));
  const saveLabel = conflictAt != null ? "Por guardar" : saving ? "A guardar…" : savedAt != null ? formatSavedAt(savedAt) : "";

  if (!ready) {
    return (
      <div className="min-h-dvh">
        <div className="mx-auto w-full max-w-sm px-4 pt-16">
          {syncError ? (
            <>
              <h1 className="font-serif text-3xl">Não abri a caderneta</h1>
              <p className="mt-3 text-sm text-muted">{syncError}</p>
              <button
                type="button"
                onClick={retryLoad}
                className="mt-6 h-12 rounded-md bg-forest px-4 text-sm font-medium text-card"
              >
                Tentar outra vez
              </button>
            </>
          ) : (
            <div className="h-8 w-40 animate-pulse rounded-md bg-paper-2" />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh">
      <div className="mx-auto w-full max-w-5xl px-4 pt-6 pb-16 sm:px-6">
        <header className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-forest font-serif text-2xl text-card">
              L
            </div>
            <div className="min-w-0">
              <h1 className="font-serif text-2xl leading-none">Lastro</h1>
              <p className="mt-1 text-sm text-muted">O que investes, o que fica e o que gastas</p>
              {saveLabel ? <p className="mt-1 text-sm text-muted">{saveLabel}</p> : null}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            aria-label="Definições"
            className="inline-flex h-12 items-center gap-2 rounded-md bg-chip px-3 text-sm font-medium text-ink"
          >
            <Settings className="size-4" aria-hidden="true" />
            {currency}
          </button>
        </header>

        {syncError ? (
          <p className="mt-4 rounded-md bg-loss-soft px-4 py-3 text-sm text-loss">{syncError}</p>
        ) : null}

        {conflictAt != null ? (
          <div className="mt-4 rounded-md bg-brass-soft px-4 py-3 text-sm">
            <p>
              A caderneta mudou noutro aparelho {formatWhen(conflictAt)}. O que está neste ecrã ainda não substituiu
              essa versão.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button onClick={overwriteRemote}>Ficar com este ecrã</Button>
              <Button variant="soft" onClick={takeRemote}>
                Trazer o outro aparelho
              </Button>
            </div>
          </div>
        ) : null}

        {demo ? (
          <div className="mt-4 flex flex-col gap-3 rounded-lg bg-brass-soft px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm">Isto é um exemplo, não são os teus números.</p>
            <div className="flex gap-2">
              <Button variant="soft" onClick={keepDemo}>
                Ficar com estes dados
              </Button>
              <Button variant="ghost" onClick={reset}>
                Apagar
              </Button>
            </div>
          </div>
        ) : null}

        {deviceDemo && !demo ? (
          <div className="mt-4 flex flex-col gap-3 rounded-lg bg-brass-soft px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm">Neste dispositivo há um exemplo. Não o trouxe para esta conta.</p>
            <div className="flex gap-2">
              <Button variant="soft" onClick={loadDemo}>
                Usar o exemplo
              </Button>
              <Button variant="ghost" onClick={dismissDeviceDemo}>
                Ignorar
              </Button>
            </div>
          </div>
        ) : null}

        <div role="tablist" aria-label="Secções" className="mt-6 flex flex-wrap gap-1 rounded-md bg-paper-2 p-1">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              onClick={() => {
                setTab(item.id);
                if (item.id !== "contas") setPlatformId(null);
              }}
              className={cn(
                "h-11 min-w-24 flex-1 rounded-md px-2 text-xs font-medium sm:text-sm",
                tab === item.id ? "bg-card text-ink" : "text-muted",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-muted">
          {monthClosed
            ? `${formatMonth(month)} está fechado.`
            : isClosingToday(closingDay)
              ? `Hoje é o dia de atualizar. Este fecho é ${formatCloseDay(month, closingDay)}.`
              : `Atualizas sempre no dia ${closingDay}. Este fecho é ${formatCloseDay(month, closingDay)}.`}
        </p>
        <div className="mt-4">
          {tab === "resumo" ? (
            <SummaryView
              month={month}
              onMonth={changeMonth}
              onRegister={() => openClose("fecho-investimentos")}
              onExpenses={() => openClose("fecho-despesas")}
              onCashback={() => openClose("fecho-cartoes")}
              onIncome={() => openClose("fecho-ganhos")}
              onOpenPlatform={(id) => {
                setPlatformId(id);
                setTab("contas");
              }}
            />
          ) : null}
          {tab === "fecho" ? <CloseView month={month} onMonth={changeMonth} onSetup={openTables} /> : null}
          {tab === "contas" ? (
            <TablesPanel
              selectedId={platformId}
              onOpen={setPlatformId}
              onClose={() => setPlatformId(null)}
              onGoMonth={(next) => {
                changeMonth(next);
                openClose();
              }}
              onDemo={() => {
                loadDemo();
                setTab("resumo");
                monthTouched.current = false;
                setMonth(dueMonth(25));
              }}
            />
          ) : null}
        </div>

        <p className="mt-10 text-sm text-muted">
          {remote
            ? "Os números ficam no PostgreSQL. Nas definições podes exportar uma cópia."
            : "Os números ficam neste dispositivo. Nas definições podes exportar uma cópia."}
        </p>
      </div>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}
