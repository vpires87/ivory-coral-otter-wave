import { Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { dueMonth, formatCloseDay, isClosingToday } from "@/lib/ledger/money";
import { useLedger } from "@/lib/ledger/store";
import { cn } from "@/lib/utils";
import { SettingsDialog } from "@/components/ledger/dialogs";
import { ExpensesPanel } from "@/components/ledger/expenses-panel";
import { IncomePanel } from "@/components/ledger/income-panel";
import { CashbackPanel } from "@/components/ledger/cashback-panel";
import { MonthPanel } from "@/components/ledger/month-panel";
import { SummaryView } from "@/components/ledger/summary";
import { TablesPanel } from "@/components/ledger/tables-panel";
import { Button } from "@/components/ledger/ui";

type Tab = "resumo" | "mes" | "ganhos" | "despesas" | "cashback" | "tabelas";

const TABS: { id: Tab; label: string }[] = [
  { id: "resumo", label: "Resumo" },
  { id: "mes", label: "Mês" },
  { id: "ganhos", label: "Ganhos" },
  { id: "despesas", label: "Despesas" },
  { id: "cashback", label: "Cartões" },
  { id: "tabelas", label: "Tabelas" },
];

export function LastroApp() {
  const ready = useLedger((state) => state.ready);
  const syncError = useLedger((state) => state.syncError);
  const saving = useLedger((state) => state.saving);
  const retryLoad = useLedger((state) => state.retryLoad);
  const platforms = useLedger((state) => state.platforms);
  const expenseTypes = useLedger((state) => state.expenseTypes);
  const cashbackCards = useLedger((state) => state.cashbackCards);
  const incomeSources = useLedger((state) => state.incomeSources);
  const demo = useLedger((state) => state.demo);
  const currency = useLedger((state) => state.currency);
  const closingDay = useLedger((state) => state.closingDay);
  const keepDemo = useLedger((state) => state.keepDemo);
  const reset = useLedger((state) => state.reset);
  const loadDemo = useLedger((state) => state.loadDemo);
  const [tab, setTab] = useState<Tab>("resumo");
  const [month, setMonth] = useState(() => dueMonth(1));
  const monthTouched = useRef(false);
  const routedEmpty = useRef(false);
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
    if (empty) setTab("tabelas");
  }, [ready, empty]);

  function changeMonth(next: string) {
    monthTouched.current = true;
    setMonth(next);
  }

  function openTables() {
    setPlatformId(null);
    setTab("tabelas");
  }

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
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            aria-label="Definições e moeda"
            className="inline-flex h-12 items-center gap-2 rounded-md bg-chip px-3 text-sm font-medium text-ink"
          >
            <Settings className="size-4" aria-hidden="true" />
            {currency}
          </button>
        </header>

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

        <div role="tablist" aria-label="Secções" className="mt-6 flex flex-wrap gap-1 rounded-md bg-paper-2 p-1">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              onClick={() => {
                setTab(item.id);
                if (item.id !== "tabelas") setPlatformId(null);
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
          {isClosingToday(closingDay)
            ? `Hoje é o dia de atualizar.`
            : `Atualizas sempre no dia ${closingDay}.`}{" "}
          Este fecho é {formatCloseDay(month, closingDay)}.
        </p>
        <div className="mt-4">
          {tab === "resumo" ? (
            <SummaryView
              month={month}
              onMonth={changeMonth}
              onRegister={() => setTab("mes")}
              onExpenses={() => setTab("despesas")}
              onCashback={() => setTab("cashback")}
              onIncome={() => setTab("ganhos")}
              onOpenPlatform={(id) => {
                setPlatformId(id);
                setTab("tabelas");
              }}
            />
          ) : null}
          {tab === "mes" ? <MonthPanel month={month} onMonth={changeMonth} onSetup={openTables} /> : null}
          {tab === "ganhos" ? <IncomePanel month={month} onMonth={changeMonth} onSetup={openTables} /> : null}
          {tab === "despesas" ? <ExpensesPanel month={month} onMonth={changeMonth} onSetup={openTables} /> : null}
          {tab === "cashback" ? <CashbackPanel month={month} onMonth={changeMonth} onSetup={openTables} /> : null}
          {tab === "tabelas" ? (
            <TablesPanel
              selectedId={platformId}
              onOpen={setPlatformId}
              onClose={() => setPlatformId(null)}
              onGoMonth={(next) => {
                changeMonth(next);
                setTab("mes");
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
          {syncError
            ? syncError
            : saving
              ? "A guardar…"
              : "Os números ficam neste dispositivo. Nas definições podes exportar uma cópia."}
        </p>
      </div>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}
