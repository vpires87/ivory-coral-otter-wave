import { useEffect, useState } from "react";
import { entryFor, previousEntry } from "@/lib/ledger/calc";
import { cents, formatMoney, formatPlain, parseAmount } from "@/lib/ledger/money";
import { useLedger } from "@/lib/ledger/store";
import { PLATFORM_KINDS } from "@/lib/ledger/types";
import { Button, KindMark, MonthSwitcher, SignedMoney } from "@/components/ledger/ui";

type Draft = { contributed: string; endValue: string };

function draftFrom(
  platformId: string,
  entries: ReturnType<typeof useLedger.getState>["entries"],
  month: string,
): Draft {
  const saved = entryFor(entries, platformId, month);
  if (!saved) return { contributed: "", endValue: "" };
  return {
    contributed: formatPlain(saved.contributed),
    endValue: formatPlain(saved.endValue),
  };
}

function initialDrafts(
  platforms: ReturnType<typeof useLedger.getState>["platforms"],
  entries: ReturnType<typeof useLedger.getState>["entries"],
  month: string,
) {
  const drafts: Record<string, Draft> = {};
  for (const platform of platforms) drafts[platform.id] = draftFrom(platform.id, entries, month);
  return drafts;
}

export function MonthPanel({
  month,
  onMonth,
  onAddPlatform,
}: {
  month: string;
  onMonth: (month: string) => void;
  onAddPlatform: () => void;
}) {
  const platforms = useLedger((state) => state.platforms);
  const entries = useLedger((state) => state.entries);
  const currency = useLedger((state) => state.currency);
  const upsertEntry = useLedger((state) => state.upsertEntry);
  const deleteEntry = useLedger((state) => state.deleteEntry);
  const [drafts, setDrafts] = useState(() => initialDrafts(platforms, entries, month));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    setDrafts(initialDrafts(platforms, entries, month));
    setErrors({});
    setConfirmId(null);
    // Reset only when the month changes. Saving one card must not wipe the others.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month]);

  useEffect(() => {
    setDrafts((current) => {
      let changed = false;
      const next = { ...current };
      for (const platform of platforms) {
        if (!next[platform.id]) {
          next[platform.id] = draftFrom(platform.id, entries, month);
          changed = true;
        }
      }
      return changed ? next : current;
    });
  }, [platforms, entries, month]);

  if (platforms.length === 0) {
    return (
      <section className="rounded-lg border border-line bg-card p-5">
        <h2 className="font-serif text-2xl">Ainda não há plataformas</h2>
        <p className="mt-2 text-sm text-muted">Cria a primeira e depois apontas o mês.</p>
        <Button className="mt-4" onClick={onAddPlatform}>
          Adicionar plataforma
        </Button>
      </section>
    );
  }

  const ordered = [...platforms].sort((a, b) => {
    const aSaved = entryFor(entries, a.id, month) != null;
    const bSaved = entryFor(entries, b.id, month) != null;
    if (aSaved !== bSaved) return aSaved ? 1 : -1;
    return a.name.localeCompare(b.name, "pt");
  });
  const recorded = platforms.filter((platform) => entryFor(entries, platform.id, month)).length;

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-line bg-card p-4 sm:p-5">
        <MonthSwitcher month={month} onChange={onMonth} />
        <p className="mt-3 text-sm text-muted">
          {recorded} de {platforms.length} plataformas neste mês. O aporte é o que entrou ou saiu. O valor é o
          que a plataforma mostrava no fim do mês.
        </p>
      </section>
      <ul className="grid gap-3 lg:grid-cols-2">
        {ordered.map((platform) => {
          const draft = drafts[platform.id] ?? { contributed: "", endValue: "" };
          const saved = entryFor(entries, platform.id, month);
          const previous = previousEntry(entries, platform.id, month);
          const contributed = parseAmount(draft.contributed);
          const endValue = parseAmount(draft.endValue);
          const dirty = saved
            ? contributed !== saved.contributed || endValue !== saved.endValue
            : draft.contributed.trim() !== "" || draft.endValue.trim() !== "";
          const kind = PLATFORM_KINDS.find((item) => item.id === platform.kind)?.label;
          const market =
            saved && !dirty
              ? previous
                ? cents(saved.endValue - previous.endValue - saved.contributed)
                : cents(saved.endValue - (platform.openingInvested + saved.contributed))
              : null;

          function update(patch: Partial<Draft>) {
            setDrafts((current) => ({
              ...current,
              [platform.id]: { ...draft, ...patch },
            }));
          }

          function save() {
            if (draft.contributed.trim() === "" || contributed == null) {
              setErrors((current) => ({
                ...current,
                [platform.id]: "Indica o aporte. Se não meteste dinheiro, escreve 0.",
              }));
              return;
            }
            if (draft.endValue.trim() === "" || endValue == null) {
              setErrors((current) => ({
                ...current,
                [platform.id]: "Indica o valor que ficou no fim do mês.",
              }));
              return;
            }
            if (endValue < 0) {
              setErrors((current) => ({
                ...current,
                [platform.id]: "O valor no fim do mês não pode ser negativo.",
              }));
              return;
            }
            upsertEntry({
              platformId: platform.id,
              month,
              contributed,
              endValue,
            });
            setDrafts((current) => ({
              ...current,
              [platform.id]: {
                contributed: formatPlain(contributed),
                endValue: formatPlain(endValue),
              },
            }));
            setErrors((current) => ({ ...current, [platform.id]: "" }));
          }

          return (
            <li key={platform.id} className="rounded-lg border border-line bg-card p-4">
              <div className="flex items-center gap-3">
                <KindMark kind={platform.kind} />
                <div className="min-w-0">
                  <p className="truncate font-medium">{platform.name}</p>
                  <p className="text-sm text-muted">
                    {kind}
                    {saved && !dirty ? " · registado" : dirty ? " · por guardar" : " · por registar"}
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium">Aporte</span>
                  <input
                    inputMode="decimal"
                    value={draft.contributed}
                    placeholder="0,00"
                    onChange={(event) => update({ contributed: event.target.value })}
                    className="h-12 w-full rounded-md border border-line bg-paper px-3 text-base tabular-nums text-ink outline-none focus-visible:border-forest"
                  />
                  <span className="mt-1.5 block text-sm text-muted">Negativo se tiraste dinheiro.</span>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium">Valor no fim</span>
                  <input
                    inputMode="decimal"
                    value={draft.endValue}
                    placeholder="0,00"
                    onChange={(event) => update({ endValue: event.target.value })}
                    className="h-12 w-full rounded-md border border-line bg-paper px-3 text-base tabular-nums text-ink outline-none focus-visible:border-forest"
                  />
                  <span className="mt-1.5 block text-sm text-muted">
                    {previous
                      ? `Mês anterior: ${formatMoney(previous.endValue, currency)}`
                      : "Primeiro mês desta plataforma."}
                  </span>
                </label>
              </div>
              {errors[platform.id] ? <p className="mt-3 text-sm text-loss">{errors[platform.id]}</p> : null}
              {market != null ? (
                <p className="mt-3 text-sm">
                  O mercado mexeu <SignedMoney value={market} currency={currency} />
                </p>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-2">
                <Button onClick={save} disabled={!dirty}>
                  {saved ? "Atualizar" : "Guardar"}
                </Button>
                {previous ? (
                  <Button
                    variant="soft"
                    onClick={() =>
                      update({
                        contributed: draft.contributed.trim() === "" ? formatPlain(0) : draft.contributed,
                        endValue: formatPlain(previous.endValue),
                      })
                    }
                  >
                    Usar último valor
                  </Button>
                ) : null}
                {saved && confirmId === saved.id ? (
                  <>
                    <Button
                      variant="danger"
                      onClick={() => {
                        deleteEntry(saved.id);
                        setDrafts((current) => ({
                          ...current,
                          [platform.id]: { contributed: "", endValue: "" },
                        }));
                        setConfirmId(null);
                      }}
                    >
                      Confirmar
                    </Button>
                    <Button variant="ghost" onClick={() => setConfirmId(null)}>
                      Cancelar
                    </Button>
                  </>
                ) : saved ? (
                  <Button variant="ghost" onClick={() => setConfirmId(saved.id)}>
                    Eliminar
                  </Button>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
