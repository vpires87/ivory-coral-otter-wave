import { useEffect, useState } from "react";
import { CashbackPanel } from "@/components/ledger/cashback-panel";
import { ExpensesPanel } from "@/components/ledger/expenses-panel";
import { IncomePanel } from "@/components/ledger/income-panel";
import { MonthPanel } from "@/components/ledger/month-panel";
import { Button, MonthSwitcher } from "@/components/ledger/ui";
import { useLedger } from "@/lib/ledger/store";

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
        <MonthNote month={month} />
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

function MonthNote({ month }: { month: string }) {
  const monthNotes = useLedger((state) => state.monthNotes);
  const setMonthNote = useLedger((state) => state.setMonthNote);
  const saved = monthNotes.find((item) => item.month === month)?.text ?? "";
  const [draft, setDraft] = useState(saved);

  useEffect(() => {
    setDraft(saved);
  }, [saved, month]);

  function save() {
    if (draft.trim() !== saved) setMonthNote(month, draft);
  }

  return (
    <form
      className="mt-4"
      onSubmit={(event) => {
        event.preventDefault();
        save();
      }}
    >
      <label className="block">
        <span className="text-sm font-medium">Nota deste mês</span>
        <input
          value={draft}
          maxLength={140}
          placeholder="Uma linha para daqui a um ano. Prémio, férias, carro."
          onChange={(event) => setDraft(event.target.value)}
          onBlur={save}
          className="mt-2 h-12 w-full rounded-md border border-line bg-paper px-3 text-base text-ink outline-none focus-visible:border-forest"
        />
      </label>
      <Button className="mt-2" type="submit" variant="soft">
        Guardar nota
      </Button>
    </form>
  );
}
