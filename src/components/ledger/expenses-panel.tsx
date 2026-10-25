import { useEffect, useState } from "react";
import { expenseFor, expenseSeries, expenseTotal } from "@/lib/ledger/calc";
import { formatMoney, formatPlain, parseAmount } from "@/lib/ledger/money";
import { useLedger } from "@/lib/ledger/store";
import { ExpenseChart } from "@/components/ledger/chart";
import { Button, MonthSwitcher, ShareList } from "@/components/ledger/ui";

export function ExpensesPanel({
  month,
  onMonth,
}: {
  month: string;
  onMonth: (month: string) => void;
}) {
  const types = useLedger((state) => state.expenseTypes);
  const expenses = useLedger((state) => state.expenses);
  const currency = useLedger((state) => state.currency);
  const addExpenseType = useLedger((state) => state.addExpenseType);
  const renameExpenseType = useLedger((state) => state.renameExpenseType);
  const deleteExpenseType = useLedger((state) => state.deleteExpenseType);
  const upsertExpense = useLedger((state) => state.upsertExpense);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const next: Record<string, string> = {};
    for (const type of useLedger.getState().expenseTypes) {
      const saved = expenseFor(useLedger.getState().expenses, type.id, month);
      next[type.id] = saved ? formatPlain(saved.amount) : "";
    }
    setDrafts(next);
    setErrors({});
    setConfirmId(null);
  }, [month]);

  useEffect(() => {
    setDrafts((current) => {
      let changed = false;
      const next = { ...current };
      for (const type of types) {
        if (next[type.id] == null) {
          const saved = expenseFor(expenses, type.id, month);
          next[type.id] = saved ? formatPlain(saved.amount) : "";
          changed = true;
        }
      }
      return changed ? next : current;
    });
  }, [types, expenses, month]);

  function createType() {
    const trimmed = name.trim();
    if (trimmed.length < 1) {
      setNameError("Dá um nome ao tipo.");
      return;
    }
    if (types.some((type) => type.name.toLocaleLowerCase("pt") === trimmed.toLocaleLowerCase("pt"))) {
      setNameError("Já existe um tipo com esse nome.");
      return;
    }
    addExpenseType(trimmed);
    setName("");
    setNameError("");
  }

  const series = expenseSeries(types, expenses);
  const monthTotal = expenseTotal(expenses, month);
  const recorded = types.filter((type) => expenseFor(expenses, type.id, month)).length;
  const shares = types
    .map((type) => ({
      id: type.id,
      label: type.name,
      value: expenseFor(expenses, type.id, month)?.amount ?? 0,
    }))
    .filter((slice) => slice.value > 0)
    .sort((a, b) => b.value - a.value);
  const shareTotal = shares.reduce((sum, slice) => sum + slice.value, 0);
  const shareRows = shareTotal > 0 ? shares.map((slice) => ({ ...slice, share: slice.value / shareTotal })) : [];

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-line bg-card p-4 sm:p-5">
        <MonthSwitcher month={month} onChange={onMonth} />
        <p className="mt-3 text-sm text-muted">
          {types.length === 0
            ? "Cria os tipos — renda, alimentação, transportes — e em cada fecho apontas quanto saiu."
            : `${recorded} de ${types.length} tipos neste mês. Total ${formatMoney(monthTotal, currency)}.`}
        </p>
      </section>

      <section className="rounded-lg border border-line bg-card p-4 sm:p-5">
        <h2 className="font-serif text-2xl">Tipos</h2>
        <form
          className="mt-4 flex flex-col gap-2 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            createType();
          }}
        >
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Novo tipo"
            maxLength={40}
            className="h-12 w-full rounded-md border border-line bg-paper px-3 text-base text-ink outline-none focus-visible:border-forest"
          />
          <Button type="submit">Adicionar</Button>
        </form>
        {nameError ? <p className="mt-2 text-sm text-loss">{nameError}</p> : null}
      </section>

      {types.length > 0 ? (
        <ul className="space-y-3">
          {types.map((type) => {
            const draft = drafts[type.id] ?? "";
            const saved = expenseFor(expenses, type.id, month);
            const parsed = parseAmount(draft);
            const dirty = saved
              ? parsed !== saved.amount
              : draft.trim() !== "";
            return (
              <li key={type.id} className="rounded-lg border border-line bg-card p-4">
                {editingId === type.id ? (
                  <form
                    className="flex flex-col gap-2 sm:flex-row"
                    onSubmit={(event) => {
                      event.preventDefault();
                      const trimmed = editingName.trim();
                      if (trimmed.length < 1) return;
                      renameExpenseType(type.id, trimmed);
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
                      <p className="font-medium">{type.name}</p>
                      <p className="text-sm text-muted">
                        {saved && !dirty ? "Registado" : dirty ? "Por guardar" : "Por registar"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="h-11 px-2 text-sm font-medium text-forest"
                        onClick={() => {
                          setEditingId(type.id);
                          setEditingName(type.name);
                        }}
                      >
                        Renomear
                      </button>
                    </div>
                  </div>
                )}
                <label className="mt-3 block">
                  <span className="mb-1.5 block text-sm font-medium">Quanto saiu</span>
                  <input
                    inputMode="decimal"
                    value={draft}
                    placeholder="0,00"
                    onChange={(event) =>
                      setDrafts((current) => ({ ...current, [type.id]: event.target.value }))
                    }
                    className="h-12 w-full rounded-md border border-line bg-paper px-3 text-base tabular-nums text-ink outline-none focus-visible:border-forest"
                  />
                </label>
                {errors[type.id] ? <p className="mt-2 text-sm text-loss">{errors[type.id]}</p> : null}
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    disabled={!dirty}
                    onClick={() => {
                      if (draft.trim() === "" || parsed == null || parsed < 0) {
                        setErrors((current) => ({
                          ...current,
                          [type.id]: "Indica o valor. Se não gastaste, escreve 0.",
                        }));
                        return;
                      }
                      upsertExpense({ typeId: type.id, month, amount: parsed });
                      setDrafts((current) => ({ ...current, [type.id]: formatPlain(parsed) }));
                      setErrors((current) => ({ ...current, [type.id]: "" }));
                    }}
                  >
                    {saved ? "Atualizar" : "Guardar"}
                  </Button>
                  {confirmId === type.id ? (
                    <>
                      <Button variant="danger" onClick={() => deleteExpenseType(type.id)}>
                        Apagar tipo
                      </Button>
                      <Button variant="ghost" onClick={() => setConfirmId(null)}>
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <Button variant="ghost" onClick={() => setConfirmId(type.id)}>
                      Eliminar tipo
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}

      {shareRows.length > 1 ? (
        <section className="rounded-lg border border-line bg-card p-4 sm:p-5">
          <h2 className="mb-4 font-serif text-2xl">Este mês</h2>
          <ShareList title="Por tipo" slices={shareRows} currency={currency} />
        </section>
      ) : null}

      <ExpenseChart series={series} types={types} currency={currency} />
    </div>
  );
}
