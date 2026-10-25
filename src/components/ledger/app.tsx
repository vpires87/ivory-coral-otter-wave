import { Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { currentMonth } from "@/lib/ledger/money";
import { useLedger } from "@/lib/ledger/store";
import { cn } from "@/lib/utils";
import { PlatformDialog, SettingsDialog } from "@/components/ledger/dialogs";
import { MonthPanel } from "@/components/ledger/month-panel";
import { PlatformsPanel } from "@/components/ledger/platforms-panel";
import { SummaryView } from "@/components/ledger/summary";
import { Button } from "@/components/ledger/ui";

type Tab = "resumo" | "mes" | "plataformas";

const TABS: { id: Tab; label: string }[] = [
  { id: "resumo", label: "Resumo" },
  { id: "mes", label: "Mês" },
  { id: "plataformas", label: "Plataformas" },
];

export function LastroApp() {
  usePersist();
  const platforms = useLedger((state) => state.platforms);
  const demo = useLedger((state) => state.demo);
  const currency = useLedger((state) => state.currency);
  const keepDemo = useLedger((state) => state.keepDemo);
  const reset = useLedger((state) => state.reset);
  const loadDemo = useLedger((state) => state.loadDemo);
  const [tab, setTab] = useState<Tab>("resumo");
  const [month, setMonth] = useState(currentMonth);
  const [platformId, setPlatformId] = useState<string | null>(null);
  const [platformOpen, setPlatformOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const editing = platforms.find((platform) => platform.id === editingId) ?? null;
  const empty = platforms.length === 0;

  function openCreate() {
    setEditingId(null);
    setPlatformOpen(true);
  }

  function openEdit(id: string) {
    setEditingId(id);
    setPlatformOpen(true);
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
              <p className="mt-1 text-sm text-muted">O que investes e o que fica</p>
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
            }}
          />
        ) : (
          <>
            <div role="tablist" aria-label="Secções" className="mt-6 grid grid-cols-3 gap-1 rounded-md bg-paper-2 p-1">
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
                    "h-11 rounded-md text-sm font-medium",
                    tab === item.id ? "bg-card text-ink" : "text-muted",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="mt-4">
              {tab === "resumo" ? (
                <SummaryView
                  month={month}
                  onMonth={setMonth}
                  onRegister={() => setTab("mes")}
                  onOpenPlatform={(id) => {
                    setPlatformId(id);
                    setTab("plataformas");
                  }}
                />
              ) : null}
              {tab === "mes" ? (
                <MonthPanel month={month} onMonth={setMonth} onAddPlatform={openCreate} />
              ) : null}
              {tab === "plataformas" ? (
                <PlatformsPanel
                  selectedId={platformId}
                  onOpen={setPlatformId}
                  onClose={() => setPlatformId(null)}
                  onAdd={openCreate}
                  onEdit={openEdit}
                  onGoMonth={(next) => {
                    setMonth(next);
                    setTab("mes");
                  }}
                />
              ) : null}
            </div>
          </>
        )}

        <p className="mt-10 text-sm text-muted">
          Os números ficam neste browser, neste aparelho. Nas definições podes exportar uma cópia.
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

function EmptyLedger({ onAdd, onDemo }: { onAdd: () => void; onDemo: () => void }) {
  return (
    <section className="mt-8 rounded-lg border border-line bg-card px-5 py-8 sm:px-8">
      <h2 className="font-serif text-3xl sm:text-4xl">Cada mês, duas perguntas.</h2>
      <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
        Quanto meteste em cada plataforma — e quanto é que lá ficou no fim do mês. O ganho, a perda e o que
        foi mercado calculam-se sozinhos.
      </p>
      <ol className="mt-6 max-w-xl space-y-3 text-sm">
        <li className="flex gap-3">
          <span className="font-serif text-forest">01</span>
          <span>Crias as plataformas: corretora, banco, PPR, cripto.</span>
        </li>
        <li className="flex gap-3">
          <span className="font-serif text-forest">02</span>
          <span>No fim do mês, apontas o aporte e o valor que ficou.</span>
        </li>
        <li className="flex gap-3">
          <span className="font-serif text-forest">03</span>
          <span>Vês o que investiste ao lado do que a carteira vale.</span>
        </li>
      </ol>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button onClick={onAdd}>Adicionar plataforma</Button>
        <Button variant="soft" onClick={onDemo}>
          Ver um exemplo
        </Button>
      </div>
    </section>
  );
}

function usePersist() {
  useEffect(() => {
    void Promise.resolve(useLedger.persist.rehydrate());
  }, []);
}
