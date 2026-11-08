import { useEffect, useState } from "react";
import { SavingsChart } from "@/components/ledger/chart";
import { incomeFor, incomeTotal, latestBefore, savingsRate, savingsSeries, contributedIn } from "@/lib/ledger/calc";
import { formatMoney, formatPlain, formatShare, parseAmount } from "@/lib/ledger/money";
import { useLedger } from "@/lib/ledger/store";
import { Button, MonthSwitcher } from "@/components/ledger/ui";

export function IncomePanel({
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
  const sources = useLedger((state) => state.incomeSources);
  const incomes = useLedger((state) => state.incomes);
  const entries = useLedger((state) => state.entries);
  const currency = useLedger((state) => state.currency);
  const upsertIncome = useLedger((state) => state.upsertIncome);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const next: Record<string, string> = {};
    for (const source of useLedger.getState().incomeSources) {
      const saved = incomeFor(useLedger.getState().incomes, source.id, month);
      next[source.id] = saved ? formatPlain(saved.amount) : "";
    }
    setDrafts(next);
    setErrors({});
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
  const dirtyCount = sources.filter((source) => {
    const draft = drafts[source.id] ?? "";
    const saved = incomeFor(incomes, source.id, month);
    const parsed = parseAmount(draft);
    return saved ? parsed !== saved.amount : draft.trim() !== "";
  }).length;
  const canCopy = sources.some((source) => {
    if ((drafts[source.id] ?? "").trim() !== "") return false;
    return latestBefore(
      incomes.filter((entry) => entry.sourceId === source.id),
      month,
    );
  });

  function copyPrevious() {
    setDrafts((current) => {
      const next = { ...current };
      for (const source of sources) {
        if ((next[source.id] ?? "").trim() !== "") continue;
        const earlier = latestBefore(
          incomes.filter((entry) => entry.sourceId === source.id),
          month,
        );
        if (earlier) next[source.id] = formatPlain(earlier.amount);
      }
      return next;
    });
  }

  function saveAll() {
    const updates: Record<string, string> = {};
    const nextErrors: Record<string, string> = {};
    for (const source of sources) {
      const draft = drafts[source.id] ?? "";
      const saved = incomeFor(incomes, source.id, month);
      const parsed = parseAmount(draft);
      const dirty = saved ? parsed !== saved.amount : draft.trim() !== "";
      if (!dirty) continue;
      if (draft.trim() === "" || parsed == null || parsed < 0) {
        nextErrors[source.id] = "Indica o valor. Se não entrou nada, escreve 0.";
        continue;
      }
      upsertIncome({ sourceId: source.id, month, amount: parsed });
      updates[source.id] = formatPlain(parsed);
      nextErrors[source.id] = "";
    }
    setDrafts((current) => ({ ...current, ...updates }));
    setErrors((current) => ({ ...current, ...nextErrors }));
  }

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-line bg-card p-4 sm:p-5">
        {embedded ? null : <MonthSwitcher month={month} onChange={onMonth} />}
        <p className={embedded ? "text-sm text-muted" : "mt-3 text-sm text-muted"}>
          {sources.length === 0
            ? "Ainda sem ordenados nem extras."
            : `${recorded} de ${sources.length} neste mês. Total ${formatMoney(earned, currency)}.`}
        </p>
        {sources.length === 0 ? (
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
                <p className="font-medium">{source.name}</p>
                <p className="text-sm text-muted">
                  {label}
                  {" · "}
                  {saved && !dirty ? "Registado" : dirty ? "Por guardar" : "Por registar"}
                </p>
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
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}

      {embedded ? null : <SavingsChart series={series} currency={currency} />}
    </div>
  );
}
