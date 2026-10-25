import { Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { dueMonth, formatCloseDay, isClosingToday } from "@/lib/ledger/money";
import { useLedger } from "@/lib/ledger/store";
import { cn } from "@/lib/utils";
import { PlatformDialog, SettingsDialog } from "@/components/ledger/dialogs";
import { ExpensesPanel } from "@/components/ledger/expenses-panel";
import { CashbackPanel } from "@/components/ledger/cashback-panel";
import { MonthPanel } from "@/components/ledger/month-panel";
import { PlatformsPanel } from "@/components/ledger/platforms-panel";
import { SummaryView } from "@/components/ledger/summary";
import { Button } from "@/components/ledger/ui";

type Tab = "resumo" | "mes" | "despesas" | "cashback" | "plataformas";

const TABS: { id: Tab; label: string }[] = [
  { id: "resumo", label: "Resumo" },
  { id: "mes", label: "Mês" },
  { id: "despesas", label: "Despesas" },
  { id: "cashback", label: "Cartões" },
  { id: "plataformas", label: "Plataformas" },
];

export function LastroApp() {
  const ready = useLedger((state) => state.ready);
  const syncError = useLedger((state) => state.syncError);
  const saving = useLedger((state) => state.saving);
  const retryLoad = useLedger((state) => state.retryLoad);
  const platforms = useLedger((state) => state.platforms);
  const expenseTypes = useLedger((state) => state.expenseTypes);
  const cashbackCards = useLedger((state) => state.cashbackCards);
  const addCashbackCard = useLedger((state) => state.addCashbackCard);
  const demo = useLedger((state) => state.demo);
  const currency = useLedger((state) => state.currency);
  const closingDay = useLedger((state) => state.closingDay);
  const addExpenseType = useLedger((state) => state.addExpenseType);
  const keepDemo = useLedger((state) => state.keepDemo);
  const reset = useLedger((state) => state.reset);
  const loadDemo = useLedger((state) => state.loadDemo);
  const [tab, setTab] = useState<Tab>("resumo");
  const [month, setMonth] = useState(() => dueMonth(1));
  const monthTouched = useRef(false);
  const [platformId, setPlatformId] = useState<string | null>(null);
  const [platformOpen, setPlatformOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const editing = platforms.find((platform) => platform.id === editingId) ?? null;
  const empty = platforms.length === 0 && expenseTypes.length === 0 && cashbackCards.length === 0;

  useEffect(() => {
    if (ready && !monthTouched.current) setMonth(dueMonth(closingDay));
  }, [ready, closingDay]);

  function changeMonth(next: string) {
    monthTouched.current = true;
    setMonth(next);
  }

  function openCreate() {
    setEditingId(null);
    setPlatformOpen(true);
  }

  function openEdit(id: string) {
    setEditingId(id);
    setPlatformOpen(true);
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

        {empty ? (
          <EmptyLedger
            onAdd={openCreate}
            onDemo={() => {
              loadDemo();
              setTab("resumo");
              monthTouched.current = false;
              setMonth(dueMonth(25));
            }}
            onCreateType={(label) => {
              addExpenseType(label);
              setTab("despesas");
            }}
            onCreateCard={(label) => {
              addCashbackCard(label);
              setTab("cashback");
            }}
          />
        ) : (
          <>
            <div role="tablist" aria-label="Secções" className="mt-6 flex flex-wrap gap-1 rounded-md bg-paper-2 p-1">
              {TABS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === item.id}
                  onClick={() => {
                    setTab(item.id);
                    if (item.id !== "plataformas") setPlatformId(null);
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
                  onOpenPlatform={(id) => {
                    setPlatformId(id);
                    setTab("plataformas");
                  }}
                />
              ) : null}
              {tab === "mes" ? (
                <MonthPanel month={month} onMonth={changeMonth} onAddPlatform={openCreate} />
              ) : null}
              {tab === "despesas" ? <ExpensesPanel month={month} onMonth={changeMonth} /> : null}
              {tab === "cashback" ? <CashbackPanel month={month} onMonth={changeMonth} /> : null}
              {tab === "plataformas" ? (
                <PlatformsPanel
                  selectedId={platformId}
                  onOpen={setPlatformId}
                  onClose={() => setPlatformId(null)}
                  onAdd={openCreate}
                  onEdit={openEdit}
                  onGoMonth={(next) => {
                    changeMonth(next);
                    setTab("mes");
                  }}
                />
              ) : null}
            </div>
          </>
        )}

        <p className="mt-10 text-sm text-muted">
          {syncError
            ? syncError
            : saving
              ? "A guardar na tua conta…"
              : "Os números ficam na tua conta. Nas definições podes exportar uma cópia."}
        </p>
      </div>

      <PlatformDialog
        open={platformOpen}
        platform={editing}
        onOpenChange={(open) => {
          setPlatformOpen(open);
          if (!open) setEditingId(null);
        }}
      />
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}

function EmptyLedger({
  onAdd,
  onDemo,
  onCreateType,
  onCreateCard,
}: {
  onAdd: () => void;
  onDemo: () => void;
  onCreateType: (name: string) => void;
  onCreateCard: (name: string) => void;
}) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardError, setCardError] = useState("");

  return (
    <section className="mt-8 rounded-lg border border-line bg-card px-5 py-8 sm:px-8">
      <h2 className="font-serif text-3xl sm:text-4xl">O mesmo dia, todos os meses.</h2>
      <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
        Escolhes o dia de fecho. Nesse dia apontas investimentos, despesas e o cashback de cada cartão.
      </p>
      <ol className="mt-6 max-w-xl space-y-3 text-sm">
        <li className="flex gap-3">
          <span className="font-serif text-forest">01</span>
          <span>Crias plataformas, tipos de despesa e cartões.</span>
        </li>
        <li className="flex gap-3">
          <span className="font-serif text-forest">02</span>
          <span>No dia de fecho, registas aportes, valores e gastos.</span>
        </li>
        <li className="flex gap-3">
          <span className="font-serif text-forest">03</span>
          <span>Vês a carteira, as despesas e qual o cartão que deu mais cashback.</span>
        </li>
      </ol>
      <form
        className="mt-8 flex max-w-xl flex-col gap-2 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          const trimmed = name.trim();
          if (trimmed.length < 1) {
            setError("Dá um nome ao primeiro tipo, por exemplo Renda.");
            return;
          }
          onCreateType(trimmed);
        }}
      >
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Primeiro tipo de despesa"
          maxLength={40}
          className="h-12 w-full rounded-md border border-line bg-paper px-3 text-base text-ink outline-none focus-visible:border-forest"
        />
        <Button type="submit">Criar tipo</Button>
      </form>
      {error ? <p className="mt-2 text-sm text-loss">{error}</p> : null}
      <form
        className="mt-3 flex max-w-xl flex-col gap-2 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          const trimmed = cardName.trim();
          if (trimmed.length < 1) {
            setCardError("Dá um nome ao cartão, por exemplo Universo.");
            return;
          }
          onCreateCard(trimmed);
        }}
      >
        <input
          value={cardName}
          onChange={(event) => setCardName(event.target.value)}
          placeholder="Primeiro cartão de cashback"
          maxLength={40}
          className="h-12 w-full rounded-md border border-line bg-paper px-3 text-base text-ink outline-none focus-visible:border-forest"
        />
        <Button type="submit" variant="soft">
          Criar cartão
        </Button>
      </form>
      {cardError ? <p className="mt-2 text-sm text-loss">{cardError}</p> : null}
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <Button variant="soft" onClick={onAdd}>
          Adicionar plataforma
        </Button>
        <Button variant="ghost" onClick={onDemo}>
          Ver um exemplo
        </Button>
      </div>
    </section>
  );
}
