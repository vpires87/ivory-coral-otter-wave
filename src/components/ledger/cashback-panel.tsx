import { useEffect, useState } from "react";
import { cashbackFor, cashbackRows, cashbackSeries, cashbackTotal, latestBefore } from "@/lib/ledger/calc";
import { formatMoney, formatMonth, formatPlain, parseAmount } from "@/lib/ledger/money";
import { useLedger } from "@/lib/ledger/store";
import { CashbackHistory, CashbackMonthChart } from "@/components/ledger/chart";
import { Button, MonthSwitcher } from "@/components/ledger/ui";

export function CashbackPanel({
  month,
  onMonth,
  onSetup,
}: {
  month: string;
  onMonth: (month: string) => void;
  onSetup: () => void;
}) {
  const cards = useLedger((state) => state.cashbackCards);
  const cashbacks = useLedger((state) => state.cashbacks);
  const currency = useLedger((state) => state.currency);
  const upsertCashback = useLedger((state) => state.upsertCashback);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const next: Record<string, string> = {};
    for (const card of useLedger.getState().cashbackCards) {
      const saved = cashbackFor(useLedger.getState().cashbacks, card.id, month);
      next[card.id] = saved ? formatPlain(saved.amount) : "";
    }
    setDrafts(next);
    setErrors({});
  }, [month]);

  useEffect(() => {
    setDrafts((current) => {
      let changed = false;
      const next = { ...current };
      for (const card of cards) {
        if (next[card.id] == null) {
          const saved = cashbackFor(cashbacks, card.id, month);
          next[card.id] = saved ? formatPlain(saved.amount) : "";
          changed = true;
        }
      }
      return changed ? next : current;
    });
  }, [cards, cashbacks, month]);

  const rows = cashbackRows(cards, cashbacks, month);
  const series = cashbackSeries(cards, cashbacks);
  const total = cashbackTotal(cashbacks, month);
  const recorded = cards.filter((card) => cashbackFor(cashbacks, card.id, month)).length;
  const dirtyCount = cards.filter((card) => {
    const draft = drafts[card.id] ?? "";
    const saved = cashbackFor(cashbacks, card.id, month);
    const parsed = parseAmount(draft);
    return saved ? parsed !== saved.amount : draft.trim() !== "";
  }).length;
  const canCopy = cards.some((card) => {
    if ((drafts[card.id] ?? "").trim() !== "") return false;
    return latestBefore(
      cashbacks.filter((entry) => entry.cardId === card.id),
      month,
    );
  });

  function copyPrevious() {
    setDrafts((current) => {
      const next = { ...current };
      for (const card of cards) {
        if ((next[card.id] ?? "").trim() !== "") continue;
        const earlier = latestBefore(
          cashbacks.filter((entry) => entry.cardId === card.id),
          month,
        );
        if (earlier) next[card.id] = formatPlain(earlier.amount);
      }
      return next;
    });
  }

  function saveAll() {
    const updates: Record<string, string> = {};
    const nextErrors: Record<string, string> = {};
    for (const card of cards) {
      const draft = drafts[card.id] ?? "";
      const saved = cashbackFor(cashbacks, card.id, month);
      const parsed = parseAmount(draft);
      const dirty = saved ? parsed !== saved.amount : draft.trim() !== "";
      if (!dirty) continue;
      if (draft.trim() === "" || parsed == null || parsed < 0) {
        nextErrors[card.id] = "Indica o cashback. Se não houve, escreve 0.";
        continue;
      }
      upsertCashback({ cardId: card.id, month, amount: parsed });
      updates[card.id] = formatPlain(parsed);
      nextErrors[card.id] = "";
    }
    setDrafts((current) => ({ ...current, ...updates }));
    setErrors((current) => ({ ...current, ...nextErrors }));
  }
  const leaders = rows.filter((row) => row.amount > 0 && row.amount === rows[0]?.amount);
  const fallback = [...series].reverse().find((point) => point.total > 0);
  const chartRows = leaders.length > 0 ? rows : (fallback?.rows ?? []);
  const chartTitle =
    leaders.length > 0
      ? leaders.length === 1
        ? `${leaders[0].name} deu mais em ${formatMonth(month).toLowerCase()}.`
        : `${leaders.map((row) => row.name).join(" e ")} empataram em ${formatMonth(month).toLowerCase()}.`
      : fallback
        ? `Neste mês ainda não há cashback. O último foi ${formatMonth(fallback.month).toLowerCase()}.`
        : "";

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-line bg-card p-4 sm:p-5">
        <MonthSwitcher month={month} onChange={onMonth} />
        <p className="mt-3 text-sm text-muted">
          {cards.length === 0
            ? "Ainda sem cartões."
            : leaders.length > 0
              ? `${recorded} de ${cards.length} cartões. Total ${formatMoney(total, currency)}.`
              : "Ainda sem cashback neste mês."}
        </p>
        {cards.length === 0 ? (
          <Button className="mt-4" variant="soft" onClick={onSetup}>
            Criar nas tabelas
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

      {cards.length > 0 ? (
        <ul className="space-y-3">
          {cards.map((card) => {
            const draft = drafts[card.id] ?? "";
            const saved = cashbackFor(cashbacks, card.id, month);
            const parsed = parseAmount(draft);
            const dirty = saved ? parsed !== saved.amount : draft.trim() !== "";
            return (
              <li key={card.id} className="rounded-lg border border-line bg-card p-4">
                <p className="font-medium">{card.name}</p>
                <p className="text-sm text-muted">
                  {saved && !dirty ? "Registado" : dirty ? "Por guardar" : "Por registar"}
                </p>
                <label className="mt-3 block">
                  <span className="mb-1.5 block text-sm font-medium">Cashback do mês</span>
                  <input
                    inputMode="decimal"
                    value={draft}
                    placeholder="0,00"
                    onChange={(event) =>
                      setDrafts((current) => ({ ...current, [card.id]: event.target.value }))
                    }
                    className="h-12 w-full rounded-md border border-line bg-paper px-3 text-base tabular-nums text-ink outline-none focus-visible:border-forest"
                  />
                </label>
                {errors[card.id] ? <p className="mt-2 text-sm text-loss">{errors[card.id]}</p> : null}
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    disabled={!dirty}
                    onClick={() => {
                      if (draft.trim() === "" || parsed == null || parsed < 0) {
                        setErrors((current) => ({
                          ...current,
                          [card.id]: "Indica o cashback. Se não houve, escreve 0.",
                        }));
                        return;
                      }
                      upsertCashback({ cardId: card.id, month, amount: parsed });
                      setDrafts((current) => ({ ...current, [card.id]: formatPlain(parsed) }));
                      setErrors((current) => ({ ...current, [card.id]: "" }));
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

      {chartRows.some((row) => row.amount > 0) ? (
        <CashbackMonthChart rows={chartRows} currency={currency} title={chartTitle} />
      ) : null}
      <CashbackHistory series={series} cards={cards} currency={currency} />
    </div>
  );
}
