import { useState, type ReactNode } from "react";
import { platformRows, platformSnapshot } from "@/lib/ledger/calc";
import { formatMoney, formatMonth, formatPercent } from "@/lib/ledger/money";
import { useLedger } from "@/lib/ledger/store";
import { PLATFORM_KINDS } from "@/lib/ledger/types";
import { Button, KindMark, SignedMoney } from "@/components/ledger/ui";

export function PlatformsPanel({
  selectedId,
  onOpen,
  onClose,
  onAdd,
  onEdit,
  onGoMonth,
}: {
  selectedId: string | null;
  onOpen: (id: string) => void;
  onClose: () => void;
  onAdd: () => void;
  onEdit: (id: string) => void;
  onGoMonth: (month: string) => void;
}) {
  const platforms = useLedger((state) => state.platforms);
  const entries = useLedger((state) => state.entries);
  const currency = useLedger((state) => state.currency);
  const selected = platforms.find((platform) => platform.id === selectedId) ?? null;

  if (selected) {
    return (
      <PlatformDetail
        platformId={selected.id}
        onClose={onClose}
        onEdit={() => onEdit(selected.id)}
        onGoMonth={onGoMonth}
      />
    );
  }

  const ranked = [...platforms].sort((a, b) => a.name.localeCompare(b.name, "pt"));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-serif text-2xl">Plataformas</h2>
        <Button onClick={onAdd}>Nova</Button>
      </div>
      {ranked.length === 0 ? (
        <section className="rounded-lg border border-line bg-card p-5">
          <p className="text-sm text-muted">Ainda não adicionaste nenhuma.</p>
        </section>
      ) : (
        <ul className="space-y-2">
          {ranked.map((platform) => {
            const snap = platformSnapshot(platform, entries);
            const kind = PLATFORM_KINDS.find((item) => item.id === platform.kind)?.label;
            return (
              <li key={platform.id}>
                <button
                  type="button"
                  onClick={() => onOpen(platform.id)}
                  className="flex w-full items-center gap-3 rounded-lg border border-line bg-card p-3 text-left hover:border-forest"
                >
                  <KindMark kind={platform.kind} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{platform.name}</span>
                    <span className="block text-sm text-muted">
                      {kind}
                      {snap.months > 0 ? ` · ${snap.months} ${snap.months === 1 ? "mês" : "meses"}` : ""}
                    </span>
                  </span>
                  <span className="text-right">
                    <span className="block font-serif text-lg tabular-nums">
                      {snap.value == null ? "—" : formatMoney(snap.value, currency)}
                    </span>
                    <span className="block text-sm text-muted">
                      {snap.invested > 0 || snap.months > 0
                        ? `investido ${formatMoney(snap.invested, currency)}`
                        : "sem capital"}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function PlatformDetail({
  platformId,
  onClose,
  onEdit,
  onGoMonth,
}: {
  platformId: string;
  onClose: () => void;
  onEdit: () => void;
  onGoMonth: (month: string) => void;
}) {
  const platform = useLedger((state) => state.platforms.find((item) => item.id === platformId));
  const entries = useLedger((state) => state.entries);
  const currency = useLedger((state) => state.currency);
  const deletePlatform = useLedger((state) => state.deletePlatform);
  const deleteEntry = useLedger((state) => state.deleteEntry);
  const [confirmPlatform, setConfirmPlatform] = useState(false);
  const [confirmEntry, setConfirmEntry] = useState<string | null>(null);

  if (!platform) {
    return (
      <section className="rounded-lg border border-line bg-card p-5">
        <p>Esta plataforma já não existe.</p>
        <Button className="mt-4" variant="soft" onClick={onClose}>
          Voltar
        </Button>
      </section>
    );
  }

  const snap = platformSnapshot(platform, entries);
  const rows = platformRows(platform, entries);
  const kind = PLATFORM_KINDS.find((item) => item.id === platform.kind)?.label;

  return (
    <div className="space-y-4">
      <button type="button" onClick={onClose} className="inline-flex h-11 items-center text-sm font-medium text-forest">
        Voltar às plataformas
      </button>
      <section className="rounded-lg border border-line bg-card p-5">
        <div className="flex items-start gap-3">
          <KindMark kind={platform.kind} />
          <div className="min-w-0 flex-1">
            <h2 className="truncate font-serif text-3xl">{platform.name}</h2>
            <p className="text-sm text-muted">{kind}</p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Stat label="Investido" value={formatMoney(snap.invested, currency)} />
          <Stat label="Valor" value={snap.value == null ? "—" : formatMoney(snap.value, currency)} />
          <Stat
            label="Resultado"
            value={
              snap.result == null ? (
                "—"
              ) : (
                <span>
                  <SignedMoney value={snap.result} currency={currency} />
                  {snap.resultRatio != null ? (
                    <span className="ml-2 text-sm text-muted">{formatPercent(snap.resultRatio)}</span>
                  ) : null}
                </span>
              )
            }
          />
        </div>
        {platform.openingInvested > 0 ? (
          <p className="mt-4 text-sm text-muted">
            Capital inicial {formatMoney(platform.openingInvested, currency)}, antes do primeiro mês registado.
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="soft" onClick={onEdit}>
            Editar
          </Button>
          {confirmPlatform ? (
            <>
              <Button
                variant="danger"
                onClick={() => {
                  deletePlatform(platform.id);
                  onClose();
                }}
              >
                Apagar plataforma
              </Button>
              <Button variant="ghost" onClick={() => setConfirmPlatform(false)}>
                Cancelar
              </Button>
            </>
          ) : (
            <Button variant="ghost" onClick={() => setConfirmPlatform(true)}>
              Apagar
            </Button>
          )}
        </div>
      </section>

      <ProductList platformId={platform.id} />

      <section className="rounded-lg border border-line bg-card px-4 py-2 sm:px-5">
        <h3 className="py-3 font-serif text-2xl">Meses</h3>
        {rows.length === 0 ? (
          <p className="pb-4 text-sm text-muted">Ainda não há um fim de mês nesta plataforma.</p>
        ) : (
          <ul>
            {rows.map((row) => (
              <li key={row.id} className="border-t border-line py-3 first:border-t-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <button
                      type="button"
                      onClick={() => onGoMonth(row.month)}
                      className="font-medium text-forest"
                    >
                      {formatMonth(row.month)}
                    </button>
                    <p className="mt-1 text-sm tabular-nums">
                      Aporte <SignedMoney value={row.contributed} currency={currency} />
                    </p>
                    <p className="text-sm">
                      Mercado <SignedMoney value={row.market} currency={currency} />
                    </p>
                  </div>
                  <p className="font-serif text-xl tabular-nums">{formatMoney(row.endValue, currency)}</p>
                </div>
                <div className="mt-2">
                  {confirmEntry === row.id ? (
                    <div className="flex gap-2">
                      <Button variant="danger" onClick={() => deleteEntry(row.id)}>
                        Eliminar mês
                      </Button>
                      <Button variant="ghost" onClick={() => setConfirmEntry(null)}>
                        Cancelar
                      </Button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmEntry(row.id)}
                      className="text-sm text-muted hover:text-loss"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-md bg-paper px-3 py-3">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 font-medium tabular-nums">{value}</p>
    </div>
  );
}

function ProductList({ platformId }: { platformId: string }) {
  const allProducts = useLedger((state) => state.products);
  const products = allProducts.filter((product) => product.platformId === platformId);
  const addProduct = useLedger((state) => state.addProduct);
  const renameProduct = useLedger((state) => state.renameProduct);
  const deleteProduct = useLedger((state) => state.deleteProduct);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  return (
    <section className="rounded-lg border border-line bg-card p-4 sm:p-5">
      <h3 className="font-serif text-2xl">Produtos</h3>
      <p className="mt-1 text-sm text-muted">
        Opcional. No fecho do mês divides o aporte e o valor que ficou por produto.
      </p>
      {products.length > 0 ? (
        <ul className="mt-4 divide-y divide-line border-t border-line">
          {products.map((product) => (
            <li key={product.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center">
              {editing === product.id ? (
                <input
                  value={draft}
                  maxLength={40}
                  onChange={(event) => setDraft(event.target.value)}
                  className="h-12 min-w-0 flex-1 rounded-md border border-line bg-paper px-3 text-base text-ink outline-none focus-visible:border-forest"
                />
              ) : (
                <p className="min-w-0 flex-1 truncate font-medium">{product.name}</p>
              )}
              <div className="flex gap-2">
                {editing === product.id ? (
                  <Button
                    variant="soft"
                    onClick={() => {
                      if (draft.trim() === "") return;
                      renameProduct(product.id, draft);
                      setEditing(null);
                    }}
                  >
                    Guardar
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setEditing(product.id);
                      setDraft(product.name);
                    }}
                  >
                    Mudar nome
                  </Button>
                )}
                <Button variant="ghost" onClick={() => (confirmId === product.id ? deleteProduct(product.id) : setConfirmId(product.id))}>
                  {confirmId === product.id ? "Confirmar" : "Tirar"}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
      <form
        className="mt-4 flex flex-col gap-2 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          if (name.trim() === "") return;
          addProduct(platformId, name);
          setName("");
        }}
      >
        <input
          value={name}
          maxLength={40}
          placeholder="Nome do produto"
          onChange={(event) => setName(event.target.value)}
          className="h-12 min-w-0 flex-1 rounded-md border border-line bg-paper px-3 text-base text-ink outline-none focus-visible:border-forest"
        />
        <Button type="submit" disabled={name.trim() === ""}>
          Adicionar
        </Button>
      </form>
    </section>
  );
}
