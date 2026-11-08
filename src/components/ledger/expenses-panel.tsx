import { useEffect, useState } from "react";
import { expenseFor, expenseSeries, expenseTotal, latestBefore } from "@/lib/ledger/calc";
import { formatMoney, formatPlain, parseAmount } from "@/lib/ledger/money";
import { useLedger } from "@/lib/ledger/store";
import { ExpenseChart } from "@/components/ledger/chart";
import { Button, MonthSwitcher, ShareList } from "@/components/ledger/ui";

export function ExpensesPanel({
  month,
  onMonth,
  onSetup,
  embedded = false,
}: {
  month: string;
  onMonth: (month: string) => void;
  onSetup: () => void;
  embedded?: boolean;
}) {
  const types = useLedger((state) => state.expenseTypes);
  const expenses = useLedger((state) => state.expenses);
  const currency = useLedger((state) => state.currency);
  const upsertExpense = useLedger((state) => state.upsertExpense);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const next: Record<string, string> = {};
    for (const type of useLedger.getState().expenseTypes) {
      const saved = expenseFor(useLedger.getState().expenses, type.id, month);
      next[type.id] = saved ? formatPlain(saved.amount) : "";
    }
    setDrafts(next);
    setErrors({});
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

  const series = expenseSeries(types, expenses);
  const monthTotal = expenseTotal(expenses, month);
  const recorded = types.filter((type) => expenseFor(expenses, type.id, month)).length;
  const dirtyCount = types.filter((type) => {
    const draft = drafts[type.id] ?? "";
    const saved = expenseFor(expenses, type.id, month);
    const parsed = parseAmount(draft);
    return saved ? parsed !== saved.amount : draft.trim() !== "";
  }).length;
  const canCopy = types.some((type) => {
    if ((drafts[type.id] ?? "").trim() !== "") return false;
    return latestBefore(
      expenses.filter((entry) => entry.typeId === type.id),
      month,
    );
  });

  function copyPrevious() {
    setDrafts((current) => {
      const next = { ...current };
      for (const type of types) {
        if ((next[type.id] ?? "").trim() !== "") continue;
        const earlier = latestBefore(
          expenses.filter((entry) => entry.typeId === type.id),
          month,
        );
        if (earlier) next[type.id] = formatPlain(earlier.amount);
      }
      return next;
    });
  }

  function saveAll() {
    const updates: Record<string, string> = {};
    const nextErrors: Record<string, string> = {};
    for (const type of types) {
      const draft = drafts[type.id] ?? "";
      const saved = expenseFor(expenses, type.id, month);
      const parsed = parseAmount(draft);
      const dirty = saved ? parsed !== saved.amount : draft.trim() !== "";
      if (!dirty) continue;
      if (draft.trim() === "" || parsed == null || parsed < 0) {
        nextErrors[type.id] = "Indica o valor. Se não gastaste, escreve 0.";
        continue;
      }
      upsertExpense({ typeId: type.id, month, amount: parsed });
      updates[type.id] = formatPlain(parsed);
      nextErrors[type.id] = "";
    }
    setDrafts((current) => ({ ...current, ...updates }));
    setErrors((current) => ({ ...current, ...nextErrors }));
  }
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
        {embedded ? null : <MonthSwitcher month={month} onChange={onMonth} />}
        <p className={embedded ? "text-sm text-muted" : "mt-3 text-sm text-muted"}>
          {types.length === 0
            ? "Ainda sem tipos de despesa."
            : `${recorded} de ${types.length} tipos neste mês. Total ${formatMoney(monthTotal, currency)}.`}
        </p>
        {types.length === 0 ? (
          <Button className="mt-4" variant="soft" onClick={onSetup}>
            Criar nas contas
          </Button>
        ) : dirtyCount >= 2 || canCopy ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {dirtyCount >= 2 ? <Button onClick={saveAll}>Guardar este mês</Button> : null}
            {canCopy ? (
              <Button variant="soft" onClick={copyPrevious}>
                Trazer o mês anterior
              </Button>
            ) : null}
          </div>
        ) : null}
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
                <p className="font-medium">{type.name}</p>
                <p className="text-sm text-muted">
                  {saved && !dirty ? "Registado" : dirty ? "Por guardar" : "Por registar"}
                </p>
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
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}

      {embedded || shareRows.length < 2 ? null : (
        <section className="rounded-lg border border-line bg-card p-4 sm:p-5">
          <h2 className="mb-4 font-serif text-2xl">Este mês</h2>
          <ShareList title="Por tipo" slices={shareRows} currency={currency} />
        </section>
      )}

      {embedded ? null : <ExpenseChart series={series} types={types} currency={currency} />}
    </div>
  );
}
