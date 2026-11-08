import { CashbackPanel } from "@/components/ledger/cashback-panel";
import { ExpensesPanel } from "@/components/ledger/expenses-panel";
import { IncomePanel } from "@/components/ledger/income-panel";
import { MonthPanel } from "@/components/ledger/month-panel";
import { MonthSwitcher } from "@/components/ledger/ui";

export function CloseView({
  month,
  onMonth,
  onSetup,
}: {
  month: string;
  onMonth: (month: string) => void;
  onSetup: () => void;
}) {
  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-line bg-card p-4 sm:p-5">
        <MonthSwitcher month={month} onChange={onMonth} />
        <p className="mt-3 text-sm text-muted">
          Aponta o mês de uma vez: investimentos, ganhos, despesas e cartões.
        </p>
      </section>

      <section id="fecho-investimentos" className="scroll-mt-6 space-y-3">
        <h2 className="font-serif text-2xl">Investimentos</h2>
        <MonthPanel embedded month={month} onMonth={onMonth} onSetup={onSetup} />
      </section>

      <section id="fecho-ganhos" className="scroll-mt-6 space-y-3">
        <h2 className="font-serif text-2xl">Ganhos</h2>
        <IncomePanel embedded month={month} onMonth={onMonth} onSetup={onSetup} />
      </section>

      <section id="fecho-despesas" className="scroll-mt-6 space-y-3">
        <h2 className="font-serif text-2xl">Despesas</h2>
        <ExpensesPanel embedded month={month} onMonth={onMonth} onSetup={onSetup} />
      </section>

      <section id="fecho-cartoes" className="scroll-mt-6 space-y-3">
        <h2 className="font-serif text-2xl">Cartões</h2>
        <CashbackPanel embedded month={month} onMonth={onMonth} onSetup={onSetup} />
      </section>
    </div>
  );
}
