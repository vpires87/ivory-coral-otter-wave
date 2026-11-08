import { useState } from "react";
import { PlatformDialog } from "@/components/ledger/dialogs";
import { PlatformsPanel } from "@/components/ledger/platforms-panel";
import { formatMoney } from "@/lib/ledger/money";
import { useLedger } from "@/lib/ledger/store";
import { INCOME_KINDS, PLATFORM_KINDS, type IncomeKind } from "@/lib/ledger/types";
import { Button, KindMark } from "@/components/ledger/ui";
import { cn } from "@/lib/utils";

export function TablesPanel({
  selectedId,
  onOpen,
  onClose,
  onGoMonth,
  onDemo,
}: {
  selectedId: string | null;
  onOpen: (id: string) => void;
  onClose: () => void;
  onGoMonth: (month: string) => void;
  onDemo: () => void;
}) {
  const platforms = useLedger((state) => state.platforms);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const editing = platforms.find((platform) => platform.id === editingId) ?? null;

  function addPlatform() {
    setEditingId(null);
    setOpen(true);
  }

  function editPlatform(id: string) {
    setEditingId(id);
    setOpen(true);
  }

  return (
    <>
      {selectedId ? (
        <PlatformsPanel
          selectedId={selectedId}
          onOpen={onOpen}
          onClose={onClose}
          onAdd={addPlatform}
          onEdit={editPlatform}
          onGoMonth={onGoMonth}
        />
      ) : (
        <Catalog onOpen={onOpen} onAdd={addPlatform} onEdit={editPlatform} onDemo={onDemo} />
      )}
      <PlatformDialog
        open={open}
        platform={editing}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setEditingId(null);
        }}
      />
    </>
  );
}

function Catalog({
  onOpen,
  onAdd,
  onEdit,
  onDemo,
}: {
  onOpen: (id: string) => void;
  onAdd: () => void;
  onEdit: (id: string) => void;
  onDemo: () => void;
}) {
  const platforms = useLedger((state) => state.platforms);
  const sources = useLedger((state) => state.incomeSources);
  const types = useLedger((state) => state.expenseTypes);
  const cards = useLedger((state) => state.cashbackCards);
  const currency = useLedger((state) => state.currency);
  const empty = platforms.length + sources.length + types.length + cards.length === 0;

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-line bg-card p-4 sm:p-5">
        <h2 className="font-serif text-2xl">Contas</h2>
        <p className="mt-2 text-sm text-muted">
          Crias isto uma vez: onde está o dinheiro, o que ganhas, os tipos de despesa e os cartões. No fecho
          só apontas os valores do mês.
        </p>
        {empty ? (
          <Button className="mt-4" variant="ghost" onClick={onDemo}>
            Ver um exemplo
          </Button>
        ) : null}
      </section>

      <PlatformTable currency={currency} onOpen={onOpen} onAdd={onAdd} onEdit={onEdit} />
      <IncomeTable />
      <SimpleTable
        title="Despesas"
        hint="Renda, alimentação, transportes."
        placeholder="Novo tipo"
        empty="Ainda sem tipos."
        rows={types}
        onAdd={(name) => useLedger.getState().addExpenseType(name)}
        onRename={(id, name) => useLedger.getState().renameExpenseType(id, name)}
        onDelete={(id) => useLedger.getState().deleteExpenseType(id)}
      />
      <SimpleTable
        title="Cartões"
        hint="Os cartões com cashback."
        placeholder="Novo cartão"
        empty="Ainda sem cartões."
        rows={cards}
        onAdd={(name) => useLedger.getState().addCashbackCard(name)}
        onRename={(id, name) => useLedger.getState().renameCashbackCard(id, name)}
        onDelete={(id) => useLedger.getState().deleteCashbackCard(id)}
      />
    </div>
  );
}

function PlatformTable({
  currency,
  onOpen,
  onAdd,
  onEdit,
}: {
  currency: ReturnType<typeof useLedger.getState>["currency"];
  onOpen: (id: string) => void;
  onAdd: () => void;
  onEdit: (id: string) => void;
}) {
  const platforms = useLedger((state) => state.platforms);
  const deletePlatform = useLedger((state) => state.deletePlatform);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const ranked = [...platforms].sort((a, b) => a.name.localeCompare(b.name, "pt"));

  return (
    <section className="rounded-lg border border-line bg-card p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-serif text-2xl">Plataformas</h2>
          <p className="mt-1 text-sm text-muted">O capital inicial é o que já tinhas investido antes do primeiro mês.</p>
        </div>
        <Button onClick={onAdd}>Nova</Button>
      </div>
      {ranked.length === 0 ? (
        <p className="mt-4 text-sm text-muted">Ainda sem plataformas.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {ranked.map((platform) => {
            const kind = PLATFORM_KINDS.find((item) => item.id === platform.kind)?.label;
            return (
              <li key={platform.id} className="rounded-lg border border-line p-3">
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => onOpen(platform.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                    <KindMark kind={platform.kind} />
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{platform.name}</span>
                      <span className="block text-sm text-muted">
                        {kind} · inicial {formatMoney(platform.openingInvested, currency)}
                      </span>
                    </span>
                  </button>
                  <button type="button" className="h-11 px-2 text-sm font-medium text-forest" onClick={() => onEdit(platform.id)}>
                    Editar
                  </button>
                </div>
                <div className="mt-2">
                  {confirmId === platform.id ? (
                    <div className="flex gap-2">
                      <Button variant="danger" onClick={() => deletePlatform(platform.id)}>
                        Apagar
                      </Button>
                      <Button variant="ghost" onClick={() => setConfirmId(null)}>
                        Cancelar
                      </Button>
                    </div>
                  ) : (
                    <Button variant="ghost" onClick={() => setConfirmId(platform.id)}>
                      Eliminar
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function IncomeTable() {
  const sources = useLedger((state) => state.incomeSources);
  const addIncomeSource = useLedger((state) => state.addIncomeSource);
  const renameIncomeSource = useLedger((state) => state.renameIncomeSource);
  const setIncomeKind = useLedger((state) => state.setIncomeKind);
  const deleteIncomeSource = useLedger((state) => state.deleteIncomeSource);
  const [name, setName] = useState("");
  const [kind, setKind] = useState<IncomeKind>("ordenado");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const ordered = [...sources].sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === "ordenado" ? -1 : 1;
    return a.name.localeCompare(b.name, "pt");
  });

  function add() {
    const trimmed = name.trim();
    if (trimmed.length < 1) {
      setError("Dá um nome, por exemplo Empresa.");
      return;
    }
    if (sources.some((source) => source.name.toLocaleLowerCase("pt") === trimmed.toLocaleLowerCase("pt"))) {
      setError("Já existe um ganho com esse nome.");
      return;
    }
    addIncomeSource(trimmed, kind);
    setName("");
    setError("");
  }

  return (
    <section className="rounded-lg border border-line bg-card p-4 sm:p-5">
      <h2 className="font-serif text-2xl">Ganhos</h2>
      <p className="mt-1 text-sm text-muted">Ordenados e extras. O valor de cada mês fica no fecho.</p>
      <div className="mt-4 grid grid-cols-2 gap-1 rounded-md bg-paper-2 p-1">
        {INCOME_KINDS.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={kind === item.id}
            onClick={() => setKind(item.id)}
            className={cn("h-11 rounded-md text-sm font-medium", kind === item.id ? "bg-card text-ink" : "text-muted")}
          >
            {item.label}
          </button>
        ))}
      </div>
      <form
        className="mt-3 flex flex-col gap-2 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          add();
        }}
      >
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder={kind === "ordenado" ? "Nome do ordenado" : "Nome do extra"}
          maxLength={40}
          className="h-12 w-full rounded-md border border-line bg-paper px-3 text-base text-ink outline-none focus-visible:border-forest"
        />
        <Button type="submit">Adicionar</Button>
      </form>
      {error ? <p className="mt-2 text-sm text-loss">{error}</p> : null}
      <ul className="mt-4 space-y-2">
        {ordered.map((source) => (
          <li key={source.id} className="rounded-lg border border-line p-3">
            {editingId === source.id ? (
              <form
                className="flex flex-col gap-2 sm:flex-row"
                onSubmit={(event) => {
                  event.preventDefault();
                  const trimmed = editingName.trim();
                  if (trimmed.length < 1) return;
                  renameIncomeSource(source.id, trimmed);
                  setEditingId(null);
                }}
              >
                <input
                  value={editingName}
                  onChange={(event) => setEditingName(event.target.value)}
                  maxLength={40}
                  className="h-12 w-full rounded-md border border-line bg-paper px-3 text-base text-ink outline-none focus-visible:border-forest"
                />
                <Button type="submit">Guardar</Button>
                <Button variant="ghost" onClick={() => setEditingId(null)}>
                  Cancelar
                </Button>
              </form>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{source.name}</p>
                  <p className="text-sm text-muted">{source.kind === "ordenado" ? "Ordenado" : "Extra"}</p>
                </div>
                <button
                  type="button"
                  className="h-11 px-2 text-sm font-medium text-forest"
                  onClick={() => {
                    setEditingId(source.id);
                    setEditingName(source.name);
                  }}
                >
                  Renomear
                </button>
              </div>
            )}
            <div className="mt-3 grid grid-cols-2 gap-1 rounded-md bg-paper-2 p-1">
              {INCOME_KINDS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={source.kind === item.id}
                  onClick={() => setIncomeKind(source.id, item.id)}
                  className={cn(
                    "h-10 rounded-md text-sm font-medium",
                    source.kind === item.id ? "bg-card text-ink" : "text-muted",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="mt-2">
              {confirmId === source.id ? (
                <div className="flex gap-2">
                  <Button variant="danger" onClick={() => deleteIncomeSource(source.id)}>
                    Apagar
                  </Button>
                  <Button variant="ghost" onClick={() => setConfirmId(null)}>
                    Cancelar
                  </Button>
                </div>
              ) : (
                <Button variant="ghost" onClick={() => setConfirmId(source.id)}>
                  Eliminar
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SimpleTable({
  title,
  hint,
  placeholder,
  empty,
  rows,
  onAdd,
  onRename,
  onDelete,
}: {
  title: string;
  hint: string;
  placeholder: string;
  empty: string;
  rows: { id: string; name: string }[];
  onAdd: (name: string) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  function add() {
    const trimmed = name.trim();
    if (trimmed.length < 1) {
      setError("Dá um nome.");
      return;
    }
    if (rows.some((row) => row.name.toLocaleLowerCase("pt") === trimmed.toLocaleLowerCase("pt"))) {
      setError("Já existe um com esse nome.");
      return;
    }
    onAdd(trimmed);
    setName("");
    setError("");
  }

  return (
    <section className="rounded-lg border border-line bg-card p-4 sm:p-5">
      <h2 className="font-serif text-2xl">{title}</h2>
      <p className="mt-1 text-sm text-muted">{hint}</p>
      <form
        className="mt-4 flex flex-col gap-2 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          add();
        }}
      >
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder={placeholder}
          maxLength={40}
          className="h-12 w-full rounded-md border border-line bg-paper px-3 text-base text-ink outline-none focus-visible:border-forest"
        />
        <Button type="submit">Adicionar</Button>
      </form>
      {error ? <p className="mt-2 text-sm text-loss">{error}</p> : null}
      {rows.length === 0 ? (
        <p className="mt-4 text-sm text-muted">{empty}</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {rows.map((row) => (
            <li key={row.id} className="rounded-lg border border-line p-3">
              {editingId === row.id ? (
                <form
                  className="flex flex-col gap-2 sm:flex-row"
                  onSubmit={(event) => {
                    event.preventDefault();
                    const trimmed = editingName.trim();
                    if (trimmed.length < 1) return;
                    onRename(row.id, trimmed);
                    setEditingId(null);
                  }}
                >
                  <input
                    value={editingName}
                    onChange={(event) => setEditingName(event.target.value)}
                    maxLength={40}
                    className="h-12 w-full rounded-md border border-line bg-paper px-3 text-base text-ink outline-none focus-visible:border-forest"
                  />
                  <Button type="submit">Guardar</Button>
                  <Button variant="ghost" onClick={() => setEditingId(null)}>
                    Cancelar
                  </Button>
                </form>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{row.name}</p>
                  <button
                    type="button"
                    className="h-11 px-2 text-sm font-medium text-forest"
                    onClick={() => {
                      setEditingId(row.id);
                      setEditingName(row.name);
                    }}
                  >
                    Renomear
                  </button>
                </div>
              )}
              <div className="mt-2">
                {confirmId === row.id ? (
                  <div className="flex gap-2">
                    <Button variant="danger" onClick={() => onDelete(row.id)}>
                      Apagar
                    </Button>
                    <Button variant="ghost" onClick={() => setConfirmId(null)}>
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  <Button variant="ghost" onClick={() => setConfirmId(row.id)}>
                    Eliminar
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
