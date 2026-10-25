export const PLATFORM_KINDS = [
  { id: "corretora", label: "Corretora" },
  { id: "banco", label: "Banco" },
  { id: "cripto", label: "Cripto" },
  { id: "ppr", label: "PPR" },
  { id: "poupanca", label: "Poupança" },
  { id: "outro", label: "Outro" },
] as const;

export type PlatformKind = (typeof PLATFORM_KINDS)[number]["id"];

export const CURRENCIES = [
  { id: "EUR", label: "Euro" },
  { id: "USD", label: "Dólar" },
  { id: "GBP", label: "Libra" },
  { id: "CHF", label: "Franco suíço" },
  { id: "BRL", label: "Real" },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]["id"];

export type Platform = {
  id: string;
  name: string;
  kind: PlatformKind;
  openingInvested: number;
};

export type MonthEntry = {
  id: string;
  platformId: string;
  month: string;
  contributed: number;
  endValue: number;
};

export type ExpenseType = {
  id: string;
  name: string;
};

export type ExpenseEntry = {
  id: string;
  typeId: string;
  month: string;
  amount: number;
};

export type CashbackCard = {
  id: string;
  name: string;
};

export type CashbackEntry = {
  id: string;
  cardId: string;
  month: string;
  amount: number;
};

export type LedgerData = {
  platforms: Platform[];
  entries: MonthEntry[];
  expenseTypes: ExpenseType[];
  expenses: ExpenseEntry[];
  cashbackCards: CashbackCard[];
  cashbacks: CashbackEntry[];
  currency: CurrencyCode;
  monthlyGoal: number | null;
  fireGoal: number | null;
  closingDay: number;
  demo: boolean;
};

export type MonthPoint = {
  month: string;
  contributed: number;
  invested: number;
  value: number;
  market: number;
  recorded: number;
};

export type Totals = {
  invested: number;
  value: number;
  result: number;
  resultRatio: number | null;
  latestMonth: string | null;
  withValue: number;
};

export type PlatformSnapshot = {
  invested: number;
  value: number | null;
  result: number | null;
  resultRatio: number | null;
  months: number;
  lastMonth: string | null;
};

export type YearRollup = {
  year: string;
  contributed: number;
  market: number;
  endValue: number;
};

export type ShareSlice = {
  id: string;
  label: string;
  value: number;
  share: number;
};

export type ExpenseMonth = {
  month: string;
  total: number;
  byType: Record<string, number>;
};
