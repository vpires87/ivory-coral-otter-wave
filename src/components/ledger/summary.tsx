import { useEffect, useState, type ReactNode } from "react";
import { buildSeries, cashbackFor, cashbackRows, cashbackTotal, contributedIn, entryFor, expenseFor, expenseTotal, incomeFor, incomeTotal, kindShares, platformSnapshot, pointFor, productShares, savingsRate, savingsSeries, sumByMonth, totals, valueShares, yearlyRollup } from "@/lib/ledger/calc";
import { cents, formatMoney, formatMonth, formatPercent, formatPlain, formatShare, parseAmount } from "@/lib/ledger/money";
import { useLedger } from "@/lib/ledger/store";
import { PLATFORM_KINDS, type CurrencyCode } from "@/lib/ledger/types";
import { ValueChart, YearCompareChart } from "@/components/ledger/chart";
import { Button, CompareBars, GoalMeter, KindMark, MonthSwitcher, ShareList, SignedMoney } from "@/components/ledger/ui";

export function SummaryView({
  month,
  onMonth,
  onRegister,
  onExpenses,
  onCashback,
  onIncome,
  onOpenPlatform,
}: {
  month: string;
  onMonth: (month: string) => void;
  onRegister: () => void;
  onExpenses: () => void;
  onCashback: () => void;
  onIncome: () => void;
  onOpenPlatform: (id: string) => void;
}) {
  const platforms = useLedger((state) => state.platforms);
  const entries = useLedger((state) => state.entries);
  const products = useLedger((state) => state.products);
  const productEntries = useLedger((state) => state.productEntries);
  const expenseTypes = useLedger((state) => state.expenseTypes);
  const expenses = useLedger((state) => state.expenses);
  const cashbackCards = useLedger((state) => state.cashbackCards);
  const cashbacks = useLedger((state) => state.cashbacks);
  const incomeSources = useLedger((state) => state.incomeSources);
  const incomes = useLedger((state) => state.incomes);
  const currency = useLedger((state) => state.currency);
  const monthlyGoal = useLedger((state) => state.monthlyGoal);
  const series = buildSeries(platforms, entries);
  const snapshot = totals(platforms, entries);
  const focus = pointFor(series, month);
  const years = yearlyRollup(series);
  const shares = valueShares(platforms, entries);
  const kinds = kindShares(platforms, entries);
  const portfolio = productShares(platforms, products, entries, productEntries);
  const pending = platforms.filter((platform) => !entryFor(entries, platform.id, month));
  const pendingExpenses = expenseTypes.filter((type) => !expenseFor(expenses, type.id, month));
  const spent = expenseTotal(expenses, month);
  const cashRows = cashbackRows(cashbackCards, cashbacks, month);
  const cashTotal = cashbackTotal(cashbacks, month);
  const cashLeaders = cashRows.filter((row) => row.amount > 0 && row.amount === cashRows[0]?.amount);
  const pendingCash = cashbackCards.filter((card) => !cashbackFor(cashbacks, card.id, month));
  const monthContributed = contributedIn(entries, month);
  const earned = incomeTotal(incomes, month);
  const saveRate = savingsRate(monthContributed, earned);
  const pendingIncome = incomeSources.filter((source) => !incomeFor(incomes, source.id, month));
  const period = savingsSeries(entries, incomes);
  const earnedAll = period.reduce((sum, point) => sum + point.earned, 0);
  const investedAll = period.reduce((sum, point) => sum + point.invested, 0);
  const rateAll = savingsRate(investedAll, earnedAll);
  const ranked = platforms
    .map((platform) => ({ platform, snap: platformSnapshot(platform, entries) }))
    .sort((a, b) => (b.snap.value ?? -1) - (a.snap.value ?? -1));

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-line bg-card p-5 sm:p-6">
        <p className="text-sm text-muted">Valor da carteira</p>
        {snapshot.withValue === 0 ? (
          <h2 className="mt-2 font-serif text-4xl">Ainda sem meses</h2>
        ) : (
          <p className="mt-2 font-serif text-4xl tabular-nums sm:text-5xl">
            {formatMoney(snapshot.value, currency)}
          </p>
        )}
        <p className="mt-3 max-w-xl text-sm leading-relaxed">{story(snapshot, currency)}</p>
        {snapshot.latestMonth ? (
          <p className="mt-2 text-sm text-muted">
            Atualizado em {formatMonth(snapshot.latestMonth).toLowerCase()}
            {snapshot.resultRatio != null ? ` · ${formatPercent(snapshot.resultRatio)}` : ""}
          </p>
        ) : null}
        {snapshot.withValue > 0 ? (
          <CompareBars invested={snapshot.invested} value={snapshot.value} currency={currency} />
        ) : null}
      </section>

      <FireCard value={snapshot.value} recorded={snapshot.withValue > 0} currency={currency} />

      <section className="rounded-lg border border-line bg-card p-4 sm:p-5">
        <MonthSwitcher month={month} onChange={onMonth} />
        <MonthBalance
          earned={earned}
          spent={spent}
          invested={monthContributed}
          incomeKnown={incomeSources.length === 0 || pendingIncome.length === 0}
          spendKnown={expenseTypes.length === 0 || pendingExpenses.length === 0}
          investKnown={platforms.length === 0 || Boolean(focus && focus.recorded > 0)}
          incomeRecorded={incomeSources.length > 0 && pendingIncome.length < incomeSources.length}
          spendRecorded={expenseTypes.length > 0 && pendingExpenses.length < expenseTypes.length}
          investRecorded={Boolean(focus && focus.recorded > 0)}
          currency={currency}
        />
        <CloseSteps
          steps={[
            platforms.length > 0
              ? {
                  id: "mes",
                  label: "Investimentos",
                  done: pending.length === 0,
                  detail: `${platforms.length - pending.length} de ${platforms.length}`,
                  go: onRegister,
                }
              : null,
            incomeSources.length > 0
              ? {
                  id: "ganhos",
                  label: "Ganhos",
                  done: pendingIncome.length === 0,
                  detail: `${incomeSources.length - pendingIncome.length} de ${incomeSources.length}`,
                  go: onIncome,
                }
              : null,
            expenseTypes.length > 0
              ? {
                  id: "despesas",
                  label: "Despesas",
                  done: pendingExpenses.length === 0,
                  detail: `${expenseTypes.length - pendingExpenses.length} de ${expenseTypes.length}`,
                  go: onExpenses,
                }
              : null,
            cashbackCards.length > 0
              ? {
                  id: "cartoes",
                  label: "Cartões",
                  done: pendingCash.length === 0,
                  detail: `${cashbackCards.length - pendingCash.length} de ${cashbackCards.length}`,
                  go: onCashback,
                }
              : null,
          ].filter((step) => step != null)}
        />
        <p className="mt-4 text-sm leading-relaxed">{monthStory(focus, platforms.length, currency)}</p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Mini
            label="Aporte do mês"
            value={
              focus && focus.recorded > 0 ? (
                <SignedMoney value={focus.contributed} currency={currency} />
              ) : (
                "—"
              )
            }
          />
          <Mini
            label="Mercado"
            value={
              focus && focus.recorded > 0 ? <SignedMoney value={focus.market} currency={currency} /> : "—"
            }
          />
          <Mini
            label="Plataformas"
            value={focus && focus.recorded > 0 ? `${focus.recorded} de ${platforms.length}` : "por registar"}
          />
        </div>
        <GoalMeter
          contributed={monthContributed}
          goal={monthlyGoal}
          currency={currency}
          recorded={Boolean(focus && focus.recorded > 0)}
        />
        {pending.length > 0 ? (
          <p className="mt-4 text-sm text-muted">
            Falta registar {pending.map((platform) => platform.name).join(", ")}.
          </p>
        ) : null}
        <Button className="mt-4 w-full sm:w-auto" onClick={onRegister}>
          Registar este mês
        </Button>
      </section>

      {incomeSources.length > 0 ? (
        <section className="rounded-lg border border-line bg-card p-4 sm:p-5">
          <p className="text-sm text-muted">Poupança investida</p>
          <p className="mt-2 font-serif text-4xl tabular-nums">{saveRate == null ? "—" : formatShare(saveRate)}</p>
          <p className="mt-2 text-sm text-muted">
            {earned <= 0
              ? "Ainda sem ganhos neste mês."
              : `Ganhaste ${formatMoney(earned, currency)} e investiste ${formatMoney(monthContributed, currency)}.`}
          </p>
          {pendingIncome.length > 0 && earned > 0 ? (
            <p className="mt-2 text-sm text-muted">Falta {pendingIncome.map((source) => source.name).join(", ")}.</p>
          ) : null}
          {rateAll != null ? (
            <p className="mt-2 text-sm text-muted">
              No período, {formatShare(rateAll)} de {formatMoney(earnedAll, currency)}.
            </p>
          ) : null}
          <Button className="mt-4" variant="soft" onClick={onIncome}>
            Registar ganhos
          </Button>
        </section>
      ) : null}

      {expenseTypes.length > 0 ? (
        <section className="rounded-lg border border-line bg-card p-4 sm:p-5">
          <p className="text-sm text-muted">Despesas do mês</p>
          <p className="mt-2 font-serif text-3xl tabular-nums">
            {pendingExpenses.length === expenseTypes.length && spent === 0
              ? "Ainda por registar"
              : formatMoney(spent, currency)}
          </p>
          {pendingExpenses.length > 0 ? (
            <p className="mt-2 text-sm text-muted">
              Falta {pendingExpenses.map((type) => type.name).join(", ")}.
            </p>
          ) : null}
          <Button className="mt-4" variant="soft" onClick={onExpenses}>
            Registar despesas
          </Button>
        </section>
      ) : null}

      {cashbackCards.length > 0 ? (
        <section className="rounded-lg border border-line bg-card p-4 sm:p-5">
          <p className="text-sm text-muted">Cashback do mês</p>
          <p className="mt-2 font-serif text-3xl tabular-nums">
            {cashLeaders.length === 0 ? "Ainda por registar" : formatMoney(cashTotal, currency)}
          </p>
          {cashLeaders.length === 1 ? (
            <p className="mt-2 text-sm text-muted">{cashLeaders[0].name} deu mais.</p>
          ) : null}
          {pendingCash.length > 0 && cashLeaders.length > 0 ? (
            <p className="mt-2 text-sm text-muted">Falta {pendingCash.map((card) => card.name).join(", ")}.</p>
          ) : null}
          <Button className="mt-4" variant="soft" onClick={onCashback}>
            Registar cashback
          </Button>
        </section>
      ) : null}

      <ValueChart points={series} currency={currency} />

      <YearCompareChart
        currency={currency}
        metrics={[
          {
            id: "valor",
            label: "Carteira",
            points: series
              .filter((point) => point.recorded > 0)
              .map((point) => ({ month: point.month, amount: point.value })),
          },
          {
            id: "aportes",
            label: "Aportes",
            points: series
              .filter((point) => point.recorded > 0)
              .map((point) => ({ month: point.month, amount: point.contributed })),
          },
          { id: "ganhos", label: "Ganhos", points: sumByMonth(incomes) },
          { id: "despesas", label: "Despesas", points: sumByMonth(expenses) },
        ]}
      />

      {shares.length > 1 || (products.length > 0 && portfolio.length > 1) ? (
        <section className="rounded-lg border border-line bg-card p-4 sm:p-5">
          <h2 className="mb-4 font-serif text-2xl">Onde está o dinheiro</h2>
          {shares.length > 1 ? <ShareList title="Por plataforma" slices={shares} currency={currency} /> : null}
          {kinds.length > 1 ? (
            <div className="mt-6">
              <ShareList title="Por tipo" slices={kinds} currency={currency} />
            </div>
          ) : null}
          {products.length > 0 && portfolio.length > 1 ? (
            <div className="mt-6">
              <ShareList title="Por produto" slices={portfolio} currency={currency} />
              <p className="mt-3 text-sm text-muted">
                A percentagem é o último valor de cada produto. O que não dividiste fica com o nome da plataforma.
              </p>
            </div>
          ) : null}
        </section>
      ) : null}

      {years.length > 0 ? (
        <section className="rounded-lg border border-line bg-card px-4 py-2 sm:px-5">
          <h2 className="py-3 font-serif text-2xl">Por ano</h2>
          <ul>
            {years.map((year) => (
              <li
                key={year.year}
                className="flex items-start justify-between gap-4 border-t border-line py-3"
              >
                <p className="font-serif text-xl">{year.year}</p>
                <div className="text-right text-sm">
                  <p className="tabular-nums">Aportes {formatMoney(year.contributed, currency)}</p>
                  <p>
                    Mercado <SignedMoney value={year.market} currency={currency} />
                  </p>
                  <p className="tabular-nums text-muted">No fim {formatMoney(year.endValue, currency)}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {ranked.length > 0 ? (
        <section>
          <h2 className="mb-3 font-serif text-2xl">Plataformas</h2>
          <ul className="space-y-2">
            {ranked.map(({ platform, snap }) => {
              const kind = PLATFORM_KINDS.find((item) => item.id === platform.kind)?.label;
              return (
                <li key={platform.id}>
                  <button
                    type="button"
                    onClick={() => onOpenPlatform(platform.id)}
                    className="flex w-full items-center gap-3 rounded-lg border border-line bg-card p-3 text-left hover:border-forest"
                  >
                    <KindMark kind={platform.kind} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{platform.name}</span>
                      <span className="block text-sm text-muted">{kind}</span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="block font-serif text-lg tabular-nums">
                        {snap.value == null ? "—" : formatMoney(snap.value, currency)}
                      </span>
                      <span className="block text-sm">
                        {snap.result == null ? (
                          <span className="text-muted">Sem meses</span>
                        ) : (
                          <SignedMoney value={snap.result} currency={currency} />
                        )}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function Mini({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-md bg-paper px-3 py-3">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-base font-medium">{value}</p>
    </div>
  );
}

function MonthBalance({
  earned,
  spent,
  invested,
  incomeKnown,
  spendKnown,
  investKnown,
  incomeRecorded,
  spendRecorded,
  investRecorded,
  currency,
}: {
  earned: number;
  spent: number;
  invested: number;
  incomeKnown: boolean;
  spendKnown: boolean;
  investKnown: boolean;
  incomeRecorded: boolean;
  spendRecorded: boolean;
  investRecorded: boolean;
  currency: CurrencyCode;
}) {
  if (!incomeRecorded && !spendRecorded && !investRecorded) return null;
  const missing = [
    !incomeKnown && incomeRecorded ? "ganhos" : null,
    !spendKnown && spendRecorded ? "despesas" : null,
    !investKnown && investRecorded ? "investimentos" : null,
  ].filter((item) => item != null);
  const blocked =
    (!incomeRecorded && !incomeKnown) || (!spendRecorded && !spendKnown) || (!investRecorded && !investKnown);
  const leftover = cents(earned - spent - invested);
  const leftoverText =
    leftover > 0
      ? `Sobrou ${formatMoney(leftover, currency)} depois das despesas e do que meteste a investir.`
      : leftover < 0
        ? `Saíram ${formatMoney(Math.abs(leftover), currency)} a mais do que entrou.`
        : "O que entrou foi para despesas e investimentos.";
  return (
    <div className="mt-4">
      <div className="grid grid-cols-2 gap-3">
        <Mini label="Ganhaste" value={incomeRecorded ? formatMoney(earned, currency) : "—"} />
        <Mini label="Gastaste" value={spendRecorded ? formatMoney(spent, currency) : "—"} />
        <Mini label="Investiste" value={investRecorded ? formatMoney(invested, currency) : "—"} />
        <Mini
          label="Sobrou"
          value={blocked ? "—" : <SignedMoney value={leftover} currency={currency} />}
        />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        {blocked
          ? "A sobra fecha quando ganhos, despesas e investimentos deste mês estiverem apontados."
          : missing.length > 0
            ? `${leftoverText} Ainda falta fechar ${missing.join(" e ")}.`
            : leftoverText}
      </p>
    </div>
  );
}

function CloseSteps({
  steps,
}: {
  steps: { id: string; label: string; done: boolean; detail: string; go: () => void }[];
}) {
  if (steps.length === 0) return null;
  const open = steps.find((step) => !step.done);
  return (
    <div className="mt-4">
      <ul className="overflow-hidden rounded-md border border-line">
        {steps.map((step) => (
          <li key={step.id} className="border-t border-line first:border-t-0">
            <button
              type="button"
              onClick={step.go}
              className="flex h-12 w-full items-center justify-between gap-3 px-3 text-left text-sm"
            >
              <span className="font-medium">{step.label}</span>
              <span className="text-muted">{step.done ? "Feito" : step.detail}</span>
            </button>
          </li>
        ))}
      </ul>
      {open ? (
        <Button className="mt-3 w-full sm:w-auto" onClick={open.go}>
          Continuar o fecho
        </Button>
      ) : (
        <p className="mt-3 text-sm text-muted">Fecho deste mês completo.</p>
      )}
    </div>
  );
}

function FireCard({
  value,
  recorded,
  currency,
}: {
  value: number;
  recorded: boolean;
  currency: CurrencyCode;
}) {
  const fireGoal = useLedger((state) => state.fireGoal);
  const setFireGoal = useLedger((state) => state.setFireGoal);
  const [editing, setEditing] = useState(fireGoal == null);
  const [draft, setDraft] = useState(fireGoal == null ? "" : formatPlain(fireGoal));
  const [error, setError] = useState("");

  useEffect(() => {
    setDraft(fireGoal == null ? "" : formatPlain(fireGoal));
    setEditing(fireGoal == null);
  }, [fireGoal]);

  const width =
    fireGoal == null || fireGoal <= 0 ? 0 : Math.max(0, Math.min(100, (Math.max(value, 0) / fireGoal) * 100));
  const left = fireGoal == null ? 0 : cents(fireGoal - value);

  function save() {
    if (draft.trim() === "") {
      setFireGoal(null);
      setError("");
      setEditing(true);
      return;
    }
    const parsed = parseAmount(draft);
    if (parsed == null || parsed <= 0) {
      setError("O objetivo tem de ser um valor positivo.");
      return;
    }
    setFireGoal(parsed);
    setError("");
    setEditing(false);
  }

  return (
    <section className="rounded-lg border border-line bg-card p-5 sm:p-6">
      <p className="text-sm text-muted">Objetivo FIRE</p>
      {fireGoal != null && !editing ? (
        <>
          <p className="mt-2 font-serif text-4xl tabular-nums">
            {recorded ? formatShare(Math.max(value, 0) / fireGoal) : formatMoney(fireGoal, currency)}
          </p>
          <p className="mt-3 text-sm leading-relaxed">
            {recorded
              ? value >= fireGoal
                ? `A carteira vale ${formatMoney(value, currency)} e já passou o objetivo de ${formatMoney(fireGoal, currency)}.`
                : `Os ativos registados valem ${formatMoney(value, currency)}. Faltam ${formatMoney(left, currency)}.`
              : `O objetivo é ${formatMoney(fireGoal, currency)}. Ainda não há valores de ativos registados.`}
          </p>
          <div
            className="mt-4 h-2 overflow-hidden rounded-full bg-chip"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(width)}
            aria-label="Progresso do objetivo FIRE"
          >
            <div className="h-full rounded-full bg-forest" style={{ width: `${width}%` }} />
          </div>
          <p className="mt-2 text-sm tabular-nums text-muted">
            {formatMoney(Math.max(value, 0), currency)} / {formatMoney(fireGoal, currency)}
          </p>
          <Button className="mt-4" variant="soft" onClick={() => setEditing(true)}>
            Alterar objetivo
          </Button>
        </>
      ) : (
        <form
          className="mt-3 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            save();
          }}
        >
          <p className="text-sm leading-relaxed text-muted">
            O valor que a carteira tem de atingir. Conta o último valor que registares em cada ativo.
          </p>
          <input
            inputMode="decimal"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="0,00"
            className="h-12 w-full rounded-md border border-line bg-paper px-3 text-base tabular-nums text-ink outline-none focus-visible:border-forest"
          />
          {error ? <p className="text-sm text-loss">{error}</p> : null}
          <div className="flex flex-wrap gap-2">
            <Button type="submit">Guardar objetivo</Button>
            {fireGoal != null ? (
              <Button variant="ghost" onClick={() => setEditing(false)}>
                Cancelar
              </Button>
            ) : null}
          </div>
        </form>
      )}
    </section>
  );
}

function story(snapshot: ReturnType<typeof totals>, currency: CurrencyCode) {
  if (snapshot.withValue === 0) {
    return "Quando registares o primeiro fim de mês, comparas aqui o que meteste com o que ficou.";
  }
  const invested = formatMoney(snapshot.invested, currency);
  if (snapshot.result > 0) {
    return `Investiste ${invested}. Ficou ${formatMoney(snapshot.result, currency)} acima do que meteste.`;
  }
  if (snapshot.result < 0) {
    return `Investiste ${invested}. Ficou ${formatMoney(Math.abs(snapshot.result), currency)} abaixo do que meteste.`;
  }
  return `Investiste ${invested}, e a carteira vale o mesmo.`;
}

function monthStory(
  focus: ReturnType<typeof pointFor>,
  platformCount: number,
  currency: CurrencyCode,
) {
  if (!focus || focus.recorded === 0) {
    return "Este mês ainda não tem registos. Em cada plataforma, indica o aporte e o valor no fim do mês.";
  }
  const aporte =
    focus.contributed === 0
      ? "não houve aportes"
      : focus.contributed > 0
        ? `entraram ${formatMoney(focus.contributed, currency)}`
        : `saíram ${formatMoney(Math.abs(focus.contributed), currency)}`;
  const market =
    focus.market === 0
      ? "o mercado não mexeu o saldo"
      : focus.market > 0
        ? `o mercado somou ${formatMoney(focus.market, currency)}`
        : `o mercado tirou ${formatMoney(Math.abs(focus.market), currency)}`;
  const coverage =
    focus.recorded < platformCount ? ` ${focus.recorded} de ${platformCount} plataformas.` : "";
  return `Neste mês ${aporte} e ${market}.${coverage}`;
}
