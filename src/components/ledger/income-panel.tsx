import { useEffect, useState } from "react";
import { SavingsChart } from "@/components/ledger/chart";
import { incomeFor, incomeTotal, savingsRate, savingsSeries, contributedIn } from "@/lib/ledger/calc";
import { formatMoney, formatPlain, formatShare, parseAmount } from "@/lib/ledger/money";
import { useLedger } from "@/lib/ledger/store";
import { INCOME_KINDS, type IncomeKind } from "@/lib/ledger/types";
import { Button, MonthSwitcher } from "@/components/ledger/ui";
import { cn } from "@/lib/utils";

export function IncomePanel({ month, onMonth }: { month: string; onMonth: (month: string) => void }) {
  const sources = useLedger((state) => state.incomeSources);
  const incomes = useLedger((state) => state.incomes);
  const entries = useLedger((state) => state.entries);
  const currency = useLedger((state) => state.currency);
  const addIncomeSource = useLedger((state) => state.addIncomeSource);
  const renameIncomeSource = useLedger((state) => state.renameIncomeSource);
  const setIncomeKind = useLedger((state) => state.setIncomeKind);
  const deleteIncomeSource = useLedger((state) => state.deleteIncomeSource);
  const upsertIncome = useLedger((state) => state.upsertIncome);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [name, setName] = useState("");
  const [kind, setKind] = useState<IncomeKind>("ordenado");
  const [nameError, setNameError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const next: Record<string, string> = {};
    for (const source of useLedger.getState().incomeSources) {
      const saved = incomeFor(useLedger.getState().incomes, source.id, month);
      next[source.id] = saved ? formatPlain(saved.amount) : "";
    }
    setDrafts(next);
    setErrors({});
    setConfirmId(null);
  }, [month]);

  useEffect(() => {
    setDrafts((current) => {
      let changed = false;
      const next = { ...current };
      for (const source of sources) {
        if (next[source.id] == null) {
          const saved = incomeFor(incomes, source.id, month);
          next[source.id] = saved ? formatPlain(saved.amount) : "";
          changed = true;
        }
      }
      return changed ? next : current;
    });
  }, [sources, incomes, month]);

  function createSource() {
    const trimmed = name.trim();
    if (trimmed.length < 1) {
      setNameError("Dá um nome, por exemplo Empresa.");
      return;
    }
    if (sources.some((source) => source.name.toLocaleLowerCase("pt") === trimmed.toLocaleLowerCase("pt"))) {
      setNameError("Já existe um ganho com esse nome.");
      return;
    }
    addIncomeSource(trimmed, kind);
    setName("");
    setNameError("");
  }

  const ordered = [...sources].sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === "ordenado" ? -1 : 1;
    return a.name.localeCompare(b.name, "pt");
  });
  const earned = incomeTotal(incomes, month);
  const invested = contributedIn(entries, month);
  const rate = savingsRate(invested, earned);
  const series = savingsSeries(entries, incomes);
  const earnedAll = incomes.reduce((sum, entry) => sum + entry.amount, 0);
  const investedAll = entries.reduce((sum, entry) => sum + entry.contributed, 0);
  const rateAll = savingsRate(investedAll, earnedAll);
  const recorded = sources.filter((source) => incomeFor(incomes, source.id, month)).length;

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-line bg-card p-4 sm:p-5">
        <MonthSwitcher month={month} onChange={onMonth} />
        <p className="mt-3 text-sm text-muted">
          {sources.length === 0
            ? "Cria o ordenado e os extras. Em cada fecho apontas quanto entrou."
            : `${recorded} de ${sources.length} neste mês. Total ${formatMoney(earned, currency)}.`}
        </p>
      </section>

      <section className="rounded-lg border border-line bg-card p-4 sm:p-5">
        <p className="text-sm text-muted">Poupança investida</p>
        <p className="mt-2 font-serif text-4xl tabular-nums">{rate == null ? "—" : formatShare(rate)}</p>
        <p className="mt-2 text-sm text-muted">
          {earned <= 0
            ? "Regista o que ganhaste para ver a percentagem."
            : `Ganhaste ${formatMoney(earned, currency)} e meteste ${formatMoney(invested, currency)} a investir.`}
        </p>
        {rateAll != null ? (
          <p className="mt-2 text-sm text-muted">
            No período registado, {formatShare(rateAll)} de {formatMoney(earnedAll, currency)}.
          </p>
        ) : null}
      </section>

      <section className="rounded-lg border border-line bg-card p-4 sm:p-5">
        <h2 className="font-serif text-2xl">Fontes</h2>
        <div className="mt-4 grid grid-cols-2 gap-1 rounded-md bg-paper-2 p-1">
          {INCOME_KINDS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={kind === item.id}
              onClick={() => setKind(item.id)}
              className={cn(
                "h-11 rounded-md text-sm font-medium",
                kind === item.id ? "bg-card text-ink" : "text-muted",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
        <form
          className="mt-3 flex flex-col gap-2 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            createSource();
          }}
        >
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={kind === "ordenado" ? "Nome do ordenado" : "Nome do extra"}
            maxLength={40}
            className="h-12 w-full rounded-md border border-line bg-paper px-3 text-base text-ink outline-none focus-visible:border-forest"
          />
          <Button type="submit">Adicionar</Button>
        </form>
        {nameError ? <p className="mt-2 text-sm text-loss">{nameError}</p> : null}
      </section>

      {ordered.length > 0 ? (
        <ul className="space-y-3">
          {ordered.map((source) => {
            const draft = drafts[source.id] ?? "";
            const saved = incomeFor(incomes, source.id, month);
            const parsed = parseAmount(draft);
            const dirty = saved ? parsed !== saved.amount : draft.trim() !== "";
            const label = source.kind === "ordenado" ? "Ordenado" : "Extra";
            return (
              <li key={source.id} className="rounded-lg border border-line bg-card p-4">
                {editingId === source.id ? (
                  <form
                    className="flex flex-col gap-2 sm:flex-row"
                    onSubmit={(event) => {
                      event.preventDefault();
                      const trimmed = editingName.trim();
                      if (trimmed.length < 1) return;
                      renameIncomeSource(source.id, trimmed);
                      setEditingId(null);
                    }}
                  >
                    <input
                      value={editingName}
                      onChange={(event) => setEditingName(event.target.value)}
                      maxLength={40}
                      className="h-12 w-full rounded-md border border-line bg-paper px-3 text-base text-ink outline-none focus-visible:border-forest"
                    />
                    <Button type="submit">Guardar nome</Button>
                    <Button variant="ghost" onClick={() => setEditingId(null)}>
                      Cancelar
                    </Button>
                  </form>
                ) : (
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{source.name}</p>
                      <p className="text-sm text-muted">
                        {label}
                        {" · "}
                        {saved && !dirty ? "Registado" : dirty ? "Por guardar" : "Por registar"}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="h-11 px-2 text-sm font-medium text-forest"
                      onClick={() => {
                        setEditingId(source.id);
                        setEditingName(source.name);
                      }}
                    >
                      Renomear
                    </button>
                  </div>
                )}
                <div className="mt-3 grid grid-cols-2 gap-1 rounded-md bg-paper-2 p-1">
                  {INCOME_KINDS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={source.kind === item.id}
                      onClick={() => setIncomeKind(source.id, item.id)}
                      className={cn(
                        "h-10 rounded-md text-sm font-medium",
                        source.kind === item.id ? "bg-card text-ink" : "text-muted",
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <label className="mt-3 block">
                  <span className="mb-1.5 block text-sm font-medium">Quanto entrou</span>
                  <input
                    inputMode="decimal"
                    value={draft}
                    placeholder="0,00"
                    onChange={(event) =>
                      setDrafts((current) => ({ ...current, [source.id]: event.target.value }))
                    }
                    className="h-12 w-full rounded-md border border-line bg-paper px-3 text-base tabular-nums text-ink outline-none focus-visible:border-forest"
                  />
                </label>
                {errors[source.id] ? <p className="mt-2 text-sm text-loss">{errors[source.id]}</p> : null}
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    disabled={!dirty}
                    onClick={() => {
                      if (draft.trim() === "" || parsed == null || parsed < 0) {
                        setErrors((current) => ({
                          ...current,
                          [source.id]: "Indica o valor. Se não entrou nada, escreve 0.",
                        }));
                        return;
                      }
                      upsertIncome({ sourceId: source.id, month, amount: parsed });
                      setDrafts((current) => ({ ...current, [source.id]: formatPlain(parsed) }));
                      setErrors((current) => ({ ...current, [source.id]: "" }));
                    }}
                  >
                    {saved ? "Atualizar" : "Guardar"}
                  </Button>
                  {confirmId === source.id ? (
                    <>
                      <Button variant="danger" onClick={() => deleteIncomeSource(source.id)}>
                        Apagar
                      </Button>
                      <Button variant="ghost" onClick={() => setConfirmId(null)}>
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <Button variant="ghost" onClick={() => setConfirmId(source.id)}>
                      Eliminar
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}

      <SavingsChart series={series} currency={currency} />
    </div>
  );
}
