import type { ReactNode } from "react";
import { buildSeries, platformSnapshot, pointFor, totals, yearlyRollup } from "@/lib/ledger/calc";
import { formatMoney, formatMonth, formatPercent } from "@/lib/ledger/money";
import { useLedger } from "@/lib/ledger/store";
import { PLATFORM_KINDS, type CurrencyCode } from "@/lib/ledger/types";
import { ValueChart } from "@/components/ledger/chart";
import { Button, CompareBars, KindMark, MonthSwitcher, SignedMoney } from "@/components/ledger/ui";

export function SummaryView({
  month,
  onMonth,
  onRegister,
  onOpenPlatform,
}: {
  month: string;
  onMonth: (month: string) => void;
  onRegister: () => void;
  onOpenPlatform: (id: string) => void;
}) {
  const platforms = useLedger((state) => state.platforms);
  const entries = useLedger((state) => state.entries);
  const currency = useLedger((state) => state.currency);
  const series = buildSeries(platforms, entries);
  const snapshot = totals(platforms, entries);
  const focus = pointFor(series, month);
  const years = yearlyRollup(series);
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

      <section className="rounded-lg border border-line bg-card p-4 sm:p-5">
        <MonthSwitcher month={month} onChange={onMonth} />
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
        <Button className="mt-4 w-full sm:w-auto" onClick={onRegister}>
          Registar este mês
        </Button>
      </section>

      <ValueChart points={series} currency={currency} />

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
