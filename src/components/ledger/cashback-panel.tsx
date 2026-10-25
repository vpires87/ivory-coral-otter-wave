import { useEffect, useState } from "react";
import { cashbackFor, cashbackRows, cashbackSeries, cashbackTotal } from "@/lib/ledger/calc";
import { formatMoney, formatMonth, formatPlain, parseAmount } from "@/lib/ledger/money";
import { useLedger } from "@/lib/ledger/store";
import { CashbackHistory, CashbackMonthChart } from "@/components/ledger/chart";
import { Button, MonthSwitcher } from "@/components/ledger/ui";

export function CashbackPanel({
  month,
  onMonth,
}: {
  month: string;
  onMonth: (month: string) => void;
}) {
  const cards = useLedger((state) => state.cashbackCards);
  const cashbacks = useLedger((state) => state.cashbacks);
  const currency = useLedger((state) => state.currency);
  const addCashbackCard = useLedger((state) => state.addCashbackCard);
  const renameCashbackCard = useLedger((state) => state.renameCashbackCard);
  const deleteCashbackCard = useLedger((state) => state.deleteCashbackCard);
  const upsertCashback = useLedger((state) => state.upsertCashback);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const next: Record<string, string> = {};
    for (const card of useLedger.getState().cashbackCards) {
      const saved = cashbackFor(useLedger.getState().cashbacks, card.id, month);
      next[card.id] = saved ? formatPlain(saved.amount) : "";
    }
    setDrafts(next);
    setErrors({});
    setConfirmId(null);
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

  function createCard() {
    const trimmed = name.trim();
    if (trimmed.length < 1) {
      setNameError("Dá um nome ao cartão.");
      return;
    }
    if (cards.some((card) => card.name.toLocaleLowerCase("pt") === trimmed.toLocaleLowerCase("pt"))) {
      setNameError("Já existe um cartão com esse nome.");
      return;
    }
    addCashbackCard(trimmed);
    setName("");
    setNameError("");
  }

  const rows = cashbackRows(cards, cashbacks, month);
  const series = cashbackSeries(cards, cashbacks);
  const total = cashbackTotal(cashbacks, month);
  const recorded = cards.filter((card) => cashbackFor(cashbacks, card.id, month)).length;
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
            ? "Cria os cartões e, no fecho, aponta o cashback que cada um deu."
            : leaders.length > 0
              ? `${recorded} de ${cards.length} cartões. Total ${formatMoney(total, currency)}.`
              : "Ainda sem cashback neste mês."}
        </p>
      </section>

      <section className="rounded-lg border border-line bg-card p-4 sm:p-5">
        <h2 className="font-serif text-2xl">Cartões</h2>
        <form
          className="mt-4 flex flex-col gap-2 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            createCard();
          }}
        >
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Novo cartão"
            maxLength={40}
            className="h-12 w-full rounded-md border border-line bg-paper px-3 text-base text-ink outline-none focus-visible:border-forest"
          />
          <Button type="submit">Adicionar</Button>
        </form>
        {nameError ? <p className="mt-2 text-sm text-loss">{nameError}</p> : null}
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
                {editingId === card.id ? (
                  <form
                    className="flex flex-col gap-2 sm:flex-row"
                    onSubmit={(event) => {
                      event.preventDefault();
                      const trimmed = editingName.trim();
                      if (trimmed.length < 1) return;
                      renameCashbackCard(card.id, trimmed);
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
                      <p className="font-medium">{card.name}</p>
                      <p className="text-sm text-muted">
                        {saved && !dirty ? "Registado" : dirty ? "Por guardar" : "Por registar"}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="h-11 px-2 text-sm font-medium text-forest"
                      onClick={() => {
                        setEditingId(card.id);
                        setEditingName(card.name);
                      }}
                    >
                      Renomear
                    </button>
                  </div>
                )}
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
                  {confirmId === card.id ? (
                    <>
                      <Button variant="danger" onClick={() => deleteCashbackCard(card.id)}>
                        Apagar cartão
                      </Button>
                      <Button variant="ghost" onClick={() => setConfirmId(null)}>
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <Button variant="ghost" onClick={() => setConfirmId(card.id)}>
                      Eliminar cartão
                    </Button>
                  )}
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
