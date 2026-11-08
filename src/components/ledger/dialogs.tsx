import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { toBackup } from "@/lib/ledger/backup";
import { clampClosingDay, formatPlain, parseAmount } from "@/lib/ledger/money";
import { selectData, useLedger } from "@/lib/ledger/store";
import { signOut } from "@/lib/auth/client";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { CURRENCIES, PLATFORM_KINDS, type CurrencyCode, type Platform, type PlatformKind } from "@/lib/ledger/types";
import { Button, Field, inputClassName } from "@/components/ledger/ui";
import { THEMES, readTheme, storeTheme, type ThemeChoice } from "@/lib/theme";
import { cn } from "@/lib/utils";

function Sheet({
  open,
  onOpenChange,
  title,
  description,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 max-h-[92dvh] overflow-y-auto rounded-t-lg border border-line bg-card p-5 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:max-h-[85dvh] sm:w-full sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-lg">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <Dialog.Title className="font-serif text-2xl">{title}</Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-muted">{description}</Dialog.Description>
            </div>
            <Dialog.Close
              aria-label="Fechar"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-md text-ink hover:bg-chip"
            >
              <X className="size-5" />
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function PlatformDialog({
  open,
  platform,
  onOpenChange,
}: {
  open: boolean;
  platform: Platform | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title={platform ? "Editar plataforma" : "Nova plataforma"}
      description="Uma corretora, um banco, um PPR — cada sítio onde o dinheiro está."
    >
      {open ? (
        <PlatformForm
          platform={platform}
          onDone={() => onOpenChange(false)}
        />
      ) : null}
    </Sheet>
  );
}

function PlatformForm({ platform, onDone }: { platform: Platform | null; onDone: () => void }) {
  const addPlatform = useLedger((state) => state.addPlatform);
  const updatePlatform = useLedger((state) => state.updatePlatform);
  const [name, setName] = useState(platform?.name ?? "");
  const [kind, setKind] = useState<PlatformKind>(platform?.kind ?? "corretora");
  const [opening, setOpening] = useState(
    platform ? formatPlain(platform.openingInvested) : "",
  );
  const [error, setError] = useState("");

  function save() {
    const trimmed = name.trim();
    if (trimmed.length < 1) {
      setError("Dá um nome à plataforma.");
      return;
    }
    const parsed = opening.trim() === "" ? 0 : parseAmount(opening);
    if (parsed == null || parsed < 0) {
      setError("O capital inicial tem de ser zero ou um valor positivo.");
      return;
    }
    const draft = { name: trimmed, kind, openingInvested: parsed };
    if (platform) updatePlatform(platform.id, draft);
    else addPlatform(draft);
    onDone();
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        save();
      }}
    >
      <Field label="Nome">
        <input
          autoFocus
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="XTB, Trade Republic, banco…"
          maxLength={80}
          className={inputClassName()}
        />
      </Field>
      <div>
        <p className="mb-1.5 text-sm font-medium">Tipo</p>
        <div className="grid grid-cols-2 gap-2">
          {PLATFORM_KINDS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={kind === item.id}
              onClick={() => setKind(item.id)}
              className={cn(
                "min-h-11 rounded-md border px-3 py-2 text-sm",
                kind === item.id ? "border-forest bg-forest-soft text-ink" : "border-line bg-card text-ink",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <Field
        label="Capital já investido"
        hint="O que já tinhas metido antes do primeiro mês que vais registar. Não é o valor de mercado."
      >
        <input
          inputMode="decimal"
          value={opening}
          onChange={(event) => setOpening(event.target.value)}
          placeholder="0,00"
          className={cn(inputClassName(), "tabular-nums")}
        />
      </Field>
      {platform ? (
        <p className="text-sm text-muted">Mudar o capital inicial recalcula o resultado desde o início.</p>
      ) : null}
      {error ? <p className="text-sm text-loss">{error}</p> : null}
      <Button type="submit" className="w-full">
        {platform ? "Guardar alterações" : "Adicionar plataforma"}
      </Button>
    </form>
  );
}

export function SettingsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const currency = useLedger((state) => state.currency);
  const setCurrency = useLedger((state) => state.setCurrency);
  const importData = useLedger((state) => state.importData);
  const reset = useLedger((state) => state.reset);
  const loadDemo = useLedger((state) => state.loadDemo);
  const remote = useLedger((state) => state.remote);
  const account = useCurrentUser();
  const hasData = useLedger(
    (state) =>
      state.platforms.length > 0 ||
      state.entries.length > 0 ||
      state.expenseTypes.length > 0 ||
      state.expenses.length > 0 ||
      state.cashbackCards.length > 0 ||
      state.cashbacks.length > 0 ||
      state.incomeSources.length > 0 ||
      state.incomes.length > 0,
  );
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [confirmWipe, setConfirmWipe] = useState(false);
  const [confirmDemo, setConfirmDemo] = useState(false);
  const [theme, setTheme] = useState<ThemeChoice>("papel");

  useEffect(() => {
    if (open) setTheme(readTheme());
  }, [open]);

  function exportFile() {
    const payload = toBackup(selectData(useLedger.getState()));
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "lastro-caderneta.json";
    link.click();
    URL.revokeObjectURL(url);
    setMessage("Ficheiro descarregado.");
  }

  async function onFile(file: File) {
    try {
      const parsed = JSON.parse(await file.text()) as unknown;
      const error = importData(parsed);
      setMessage(error ?? "Caderneta importada. A anterior foi substituída.");
      if (!error) onOpenChange(false);
    } catch {
      setMessage("Não consegui ler esse ficheiro.");
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          setConfirmWipe(false);
          setConfirmDemo(false);
          setMessage("");
        }
        onOpenChange(next);
      }}
      title="Definições"
      description={
        remote
          ? "Os números ficam no PostgreSQL. Exporta uma cópia se quiseres um ficheiro teu."
          : "Os números ficam neste dispositivo. Exporta uma cópia se quiseres um ficheiro teu."
      }
    >
      <div className="space-y-5">
        {remote ? (
          <div className="rounded-md bg-paper px-3 py-3 text-sm">
            {account?.primaryEmail ? <p className="font-medium">{account.primaryEmail}</p> : null}
            <p className={account?.primaryEmail ? "mt-1 text-muted" : "text-muted"}>
              Não há forma de recuperar a palavra-passe. Se a esqueceres, esta caderneta fica fechada. Exporta uma
              cópia enquanto estás aqui.
            </p>
          </div>
        ) : null}
        <div>
          <p className="mb-2 text-sm font-medium">Aparência</p>
          <div className="grid grid-cols-3 gap-2">
            {THEMES.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={theme === item.id}
                onClick={() => {
                  setTheme(item.id);
                  storeTheme(item.id);
                }}
                className={cn(
                  "flex min-h-16 flex-col items-center justify-center gap-2 rounded-md border px-2 py-3 text-sm font-medium",
                  theme === item.id ? "border-forest bg-forest-soft" : "border-line bg-card",
                )}
              >
                <span className="flex h-6 w-10 overflow-hidden rounded border border-line">
                  <span className="flex-1" style={{ background: item.paper }} />
                  <span className="flex-1" style={{ background: item.accent }} />
                </span>
                {item.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm text-muted">Sistema segue o claro ou o escuro do telemóvel.</p>
        </div>
        <div>
          <p className="mb-2 text-sm font-medium">Moeda</p>
          <div className="grid grid-cols-1 gap-2">
            {CURRENCIES.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={currency === item.id}
                onClick={() => setCurrency(item.id as CurrencyCode)}
                className={cn(
                  "flex h-12 items-center justify-between rounded-md border px-3 text-sm",
                  currency === item.id ? "border-forest bg-forest-soft" : "border-line bg-card",
                )}
              >
                <span>{item.label}</span>
                <span className="tabular-nums text-muted">{item.id}</span>
              </button>
            ))}
          </div>
        </div>
        {open ? <GoalEditor /> : null}
        {open ? <FireEditor /> : null}
        {open ? <ClosingDayEditor /> : null}
        <div className="grid gap-2 sm:grid-cols-2">
          <Button variant="soft" onClick={exportFile}>
            Exportar
          </Button>
          <Button variant="soft" onClick={() => fileRef.current?.click()}>
            Importar
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (file) void onFile(file);
            }}
          />
        </div>
        {confirmDemo ? (
          <div className="rounded-md bg-brass-soft p-3 text-sm">
            <p>O exemplo substitui o que está nesta caderneta.</p>
            <div className="mt-3 flex gap-2">
              <Button
                onClick={() => {
                  loadDemo();
                  setConfirmDemo(false);
                  onOpenChange(false);
                }}
              >
                Substituir
              </Button>
              <Button variant="ghost" onClick={() => setConfirmDemo(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            onClick={() => {
              if (hasData) setConfirmDemo(true);
              else {
                loadDemo();
                onOpenChange(false);
              }
            }}
          >
            Carregar exemplo
          </Button>
        )}
        {confirmWipe ? (
          <div className="rounded-md bg-loss-soft p-3 text-sm">
            <p>
              {remote
                ? "Isto apaga a caderneta na base de dados. Não dá para desfazer."
                : "Isto apaga a caderneta neste dispositivo. Não dá para desfazer."}
            </p>
            <div className="mt-3 flex gap-2">
              <Button
                variant="danger"
                onClick={() => {
                  reset();
                  setConfirmWipe(false);
                  onOpenChange(false);
                }}
              >
                Apagar tudo
              </Button>
              <Button variant="ghost" onClick={() => setConfirmWipe(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="ghost" className="text-loss" onClick={() => setConfirmWipe(true)}>
            Apagar caderneta
          </Button>
        )}
        {message ? <p className="text-sm text-muted">{message}</p> : null}
        {remote ? (
          <Button
            variant="ghost"
            onClick={() => {
              void signOut("/").catch(() => setMessage("Não consegui sair. Tenta outra vez."));
            }}
          >
            Sair da conta
          </Button>
        ) : null}
      </div>
    </Sheet>
  );
}

function GoalEditor() {
  const monthlyGoal = useLedger((state) => state.monthlyGoal);
  const setMonthlyGoal = useLedger((state) => state.setMonthlyGoal);
  const [value, setValue] = useState(monthlyGoal == null ? "" : formatPlain(monthlyGoal));
  const [error, setError] = useState("");

  function save() {
    if (value.trim() === "") {
      setMonthlyGoal(null);
      setError("");
      return;
    }
    const parsed = parseAmount(value);
    if (parsed == null || parsed <= 0) {
      setError("A meta tem de ser um valor positivo. Deixa vazio para a tirar.");
      return;
    }
    setMonthlyGoal(parsed);
    setValue(formatPlain(parsed));
    setError("");
  }

  return (
    <form
      className="space-y-2"
      onSubmit={(event) => {
        event.preventDefault();
        save();
      }}
    >
      <Field
        label="Meta de aporte por mês"
        hint="O total que queres meter, somando todas as plataformas. Vazio se não quiseres meta."
      >
        <input
          inputMode="decimal"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="0,00"
          className={cn(inputClassName(), "tabular-nums")}
        />
      </Field>
      {error ? <p className="text-sm text-loss">{error}</p> : null}
      <Button type="submit" variant="soft">
        Guardar meta
      </Button>
    </form>
  );
}

function FireEditor() {
  const fireGoal = useLedger((state) => state.fireGoal);
  const setFireGoal = useLedger((state) => state.setFireGoal);
  const [value, setValue] = useState(fireGoal == null ? "" : formatPlain(fireGoal));
  const [error, setError] = useState("");

  function save() {
    if (value.trim() === "") {
      setFireGoal(null);
      setError("");
      return;
    }
    const parsed = parseAmount(value);
    if (parsed == null || parsed <= 0) {
      setError("O objetivo FIRE tem de ser um valor positivo. Deixa vazio para o tirar.");
      return;
    }
    setFireGoal(parsed);
    setValue(formatPlain(parsed));
    setError("");
  }

  return (
    <form
      className="space-y-2"
      onSubmit={(event) => {
        event.preventDefault();
        save();
      }}
    >
      <Field
        label="Objetivo FIRE"
        hint="O valor que a carteira tem de atingir. O progresso usa o último valor registado de cada ativo."
      >
        <input
          inputMode="decimal"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="0,00"
          className={cn(inputClassName(), "tabular-nums")}
        />
      </Field>
      {error ? <p className="text-sm text-loss">{error}</p> : null}
      <Button type="submit" variant="soft">
        Guardar objetivo
      </Button>
    </form>
  );
}

function ClosingDayEditor() {
  const closingDay = useLedger((state) => state.closingDay);
  const setClosingDay = useLedger((state) => state.setClosingDay);
  const [value, setValue] = useState(String(closingDay));
  const [error, setError] = useState("");

  function save() {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 31) {
      setError("Escolhe um dia entre 1 e 31.");
      return;
    }
    setClosingDay(clampClosingDay(parsed));
    setValue(String(parsed));
    setError("");
  }

  return (
    <form
      className="space-y-2"
      onSubmit={(event) => {
        event.preventDefault();
        save();
      }}
    >
      <Field
        label="Dia de fecho"
        hint="O dia em que atualizas a caderneta, todos os meses. Se o mês for mais curto, fecha no último dia."
      >
        <input
          inputMode="numeric"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className={cn(inputClassName(), "tabular-nums")}
        />
      </Field>
      {error ? <p className="text-sm text-loss">{error}</p> : null}
      <Button type="submit" variant="soft">
        Guardar dia
      </Button>
    </form>
  );
}
