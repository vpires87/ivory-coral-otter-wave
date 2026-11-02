import { useEffect, useState } from "react";
import { entryFor, latestBefore, previousEntry, productEntryFor } from "@/lib/ledger/calc";
import { cents, formatMoney, formatPlain, parseAmount } from "@/lib/ledger/money";
import { useLedger } from "@/lib/ledger/store";
import { PLATFORM_KINDS, type MonthEntry } from "@/lib/ledger/types";
import { Button, GoalMeter, KindMark, MonthSwitcher, SignedMoney } from "@/components/ledger/ui";

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

function productDraftFrom(
  productId: string,
  entries: ReturnType<typeof useLedger.getState>["productEntries"],
  month: string,
): Draft {
  const saved = productEntryFor(entries, productId, month);
  if (!saved) return { contributed: "", endValue: "" };
  return { contributed: formatPlain(saved.contributed), endValue: formatPlain(saved.endValue) };
}

function parsedDraft(draft: Draft): { contributed: number; endValue: number } | string {
  if (draft.contributed.trim() === "" || parseAmount(draft.contributed) == null) {
    return "Indica o aporte. Se não meteste dinheiro, escreve 0.";
  }
  const contributed = parseAmount(draft.contributed);
  if (draft.endValue.trim() === "" || parseAmount(draft.endValue) == null) {
    return "Indica o valor que ficou no fim do mês.";
  }
  const endValue = parseAmount(draft.endValue);
  if (contributed == null || endValue == null) return "Indica o valor que ficou no fim do mês.";
  if (endValue < 0) return "O valor no fim do mês não pode ser negativo.";
  return { contributed, endValue };
}

function isDirty(draft: Draft, saved: MonthEntry | null) {
  if (!saved) return draft.contributed.trim() !== "" || draft.endValue.trim() !== "";
  const contributed = parseAmount(draft.contributed);
  const endValue = parseAmount(draft.endValue);
  return contributed !== saved.contributed || endValue !== saved.endValue;
}

export function MonthPanel({
  month,
  onMonth,
  onSetup,
}: {
  month: string;
  onMonth: (month: string) => void;
  onSetup: () => void;
}) {
  const platforms = useLedger((state) => state.platforms);
  const entries = useLedger((state) => state.entries);
  const products = useLedger((state) => state.products);
  const productEntries = useLedger((state) => state.productEntries);
  const currency = useLedger((state) => state.currency);
  const upsertEntry = useLedger((state) => state.upsertEntry);
  const deleteEntry = useLedger((state) => state.deleteEntry);
  const addProduct = useLedger((state) => state.addProduct);
  const saveProductMonth = useLedger((state) => state.saveProductMonth);
  const monthlyGoal = useLedger((state) => state.monthlyGoal);
  const [drafts, setDrafts] = useState(() => initialDrafts(platforms, entries, month));
  const [productDrafts, setProductDrafts] = useState<Record<string, Draft>>({});
  const [splitting, setSplitting] = useState<Record<string, boolean>>({});
  const [productNames, setProductNames] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    const state = useLedger.getState();
    setDrafts(initialDrafts(state.platforms, state.entries, month));
    const next: Record<string, Draft> = {};
    for (const product of state.products) next[product.id] = productDraftFrom(product.id, state.productEntries, month);
    setProductDrafts(next);
    setSplitting({});
    setProductNames({});
    setErrors({});
    setConfirmId(null);
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

  useEffect(() => {
    setProductDrafts((current) => {
      let changed = false;
      const next = { ...current };
      for (const product of products) {
        if (!next[product.id]) {
          next[product.id] = productDraftFrom(product.id, productEntries, month);
          changed = true;
        }
      }
      return changed ? next : current;
    });
  }, [products, productEntries, month]);

  if (platforms.length === 0) {
    return (
      <section className="rounded-lg border border-line bg-card p-5">
        <h2 className="font-serif text-2xl">Ainda não há plataformas</h2>
        <p className="mt-2 text-sm text-muted">Cria-as nas tabelas e depois apontas o mês.</p>
        <Button className="mt-4" onClick={onSetup}>
          Ir para tabelas
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
  const monthContributed = entries.reduce(
    (sum, entry) => (entry.month === month ? cents(sum + entry.contributed) : sum),
    0,
  );

  function mine(platformId: string) {
    return products.filter((product) => product.platformId === platformId);
  }

  function isSplit(platformId: string) {
    const lines = mine(platformId);
    if (lines.length === 0) return false;
    const saved = entryFor(entries, platformId, month);
    const recordedProducts = lines.some((product) => productEntryFor(productEntries, product.id, month));
    return Boolean(splitting[platformId] || recordedProducts || !saved);
  }

  function productIsDirty(productId: string) {
    const draft = productDrafts[productId] ?? { contributed: "", endValue: "" };
    const saved = productEntryFor(productEntries, productId, month);
    if (!saved) return draft.contributed.trim() !== "" || draft.endValue.trim() !== "";
    return parseAmount(draft.contributed) !== saved.contributed || parseAmount(draft.endValue) !== saved.endValue;
  }

  function platformIsDirty(platformId: string) {
    if (isSplit(platformId)) return mine(platformId).some((product) => productIsDirty(product.id));
    return isDirty(drafts[platformId] ?? { contributed: "", endValue: "" }, entryFor(entries, platformId, month));
  }

  function parsedProducts(platformId: string): { productId: string; contributed: number; endValue: number }[] | string {
    const lines: { productId: string; contributed: number; endValue: number }[] = [];
    for (const product of mine(platformId)) {
      const draft = productDrafts[product.id] ?? { contributed: "", endValue: "" };
      if (draft.contributed.trim() === "" && draft.endValue.trim() === "") continue;
      if (draft.contributed.trim() === "" || parseAmount(draft.contributed) == null) {
        return `Em ${product.name}, indica o aporte. Se não meteste dinheiro, escreve 0.`;
      }
      const contributed = parseAmount(draft.contributed);
      if (draft.endValue.trim() === "" || parseAmount(draft.endValue) == null) {
        return `Em ${product.name}, indica o valor que ficou.`;
      }
      const endValue = parseAmount(draft.endValue);
      if (contributed == null || endValue == null || endValue < 0) {
        return `Em ${product.name}, indica o valor que ficou.`;
      }
      lines.push({ productId: product.id, contributed, endValue });
    }
    if (lines.length === 0) return "Indica pelo menos um produto. Se não meteste dinheiro, escreve 0.";
    return lines;
  }

  const dirtyCount = platforms.filter((platform) => platformIsDirty(platform.id)).length;
  const canRepeat = platforms.some((platform) => {
    if (isSplit(platform.id)) {
      return mine(platform.id).some((product) => {
        const draft = productDrafts[product.id];
        if (draft && draft.contributed.trim() !== "") return false;
        return latestBefore(
          productEntries.filter((entry) => entry.productId === product.id),
          month,
        );
      });
    }
    const draft = drafts[platform.id];
    if (draft && draft.contributed.trim() !== "") return false;
    return previousEntry(entries, platform.id, month) != null;
  });

  function repeatContributions() {
    setDrafts((current) => {
      const next = { ...current };
      for (const platform of platforms) {
        if (isSplit(platform.id)) continue;
        const draft = next[platform.id] ?? { contributed: "", endValue: "" };
        if (draft.contributed.trim() !== "") continue;
        const earlier = previousEntry(entries, platform.id, month);
        if (!earlier) continue;
        next[platform.id] = { ...draft, contributed: formatPlain(earlier.contributed) };
      }
      return next;
    });
    setProductDrafts((current) => {
      const next = { ...current };
      for (const product of products) {
        const draft = next[product.id] ?? { contributed: "", endValue: "" };
        if (draft.contributed.trim() !== "") continue;
        const earlier = latestBefore(
          productEntries.filter((entry) => entry.productId === product.id),
          month,
        );
        if (!earlier) continue;
        next[product.id] = { ...draft, contributed: formatPlain(earlier.contributed) };
      }
      return next;
    });
  }

  function commit(platformId: string, contributed: number, endValue: number) {
    upsertEntry({ platformId, month, contributed, endValue });
    setDrafts((current) => ({
      ...current,
      [platformId]: {
        contributed: formatPlain(contributed),
        endValue: formatPlain(endValue),
      },
    }));
    setErrors((current) => ({ ...current, [platformId]: "" }));
  }

  function commitProducts(platformId: string, lines: { productId: string; contributed: number; endValue: number }[]) {
    saveProductMonth(platformId, month, lines);
    setProductDrafts((current) => {
      const next = { ...current };
      for (const line of lines) {
        next[line.productId] = {
          contributed: formatPlain(line.contributed),
          endValue: formatPlain(line.endValue),
        };
      }
      return next;
    });
    setErrors((current) => ({ ...current, [platformId]: "" }));
  }

  function saveAll() {
    const updates: Record<string, Draft> = {};
    const nextErrors: Record<string, string> = {};
    for (const platform of platforms) {
      if (!platformIsDirty(platform.id)) continue;
      if (isSplit(platform.id)) {
        const parsed = parsedProducts(platform.id);
        if (typeof parsed === "string") {
          nextErrors[platform.id] = parsed;
          continue;
        }
        commitProducts(platform.id, parsed);
        nextErrors[platform.id] = "";
        continue;
      }
      const draft = drafts[platform.id] ?? { contributed: "", endValue: "" };
      const parsed = parsedDraft(draft);
      if (typeof parsed === "string") {
        nextErrors[platform.id] = parsed;
        continue;
      }
      upsertEntry({ platformId: platform.id, month, ...parsed });
      updates[platform.id] = {
        contributed: formatPlain(parsed.contributed),
        endValue: formatPlain(parsed.endValue),
      };
      nextErrors[platform.id] = "";
    }
    setDrafts((current) => ({ ...current, ...updates }));
    setErrors((current) => ({ ...current, ...nextErrors }));
  }

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-line bg-card p-4 sm:p-5">
        <MonthSwitcher month={month} onChange={onMonth} />
        <p className="mt-3 text-sm text-muted">
          {recorded} de {platforms.length} plataformas neste mês. O aporte é o que entrou ou saiu. O valor é o
          que a plataforma mostrava no fim do mês.
        </p>
        <GoalMeter
          contributed={monthContributed}
          goal={monthlyGoal}
          currency={currency}
          recorded={recorded > 0}
        />
        {dirtyCount >= 2 || canRepeat ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {dirtyCount >= 2 ? <Button onClick={saveAll}>Guardar este mês</Button> : null}
            {canRepeat ? (
              <Button variant="soft" onClick={repeatContributions}>
                Repetir aportes
              </Button>
            ) : null}
          </div>
        ) : null}
      </section>
      <ul className="grid gap-3 lg:grid-cols-2">
        {ordered.map((platform) => {
          const draft = drafts[platform.id] ?? { contributed: "", endValue: "" };
          const saved = entryFor(entries, platform.id, month);
          const previous = previousEntry(entries, platform.id, month);
          const dirty = platformIsDirty(platform.id);
          const split = isSplit(platform.id);
          const lines = mine(platform.id);
          const kind = PLATFORM_KINDS.find((item) => item.id === platform.kind)?.label;
          const market =
            saved && !dirty && !split
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

          function updateProduct(productId: string, patch: Partial<Draft>) {
            setProductDrafts((current) => ({
              ...current,
              [productId]: { ...(current[productId] ?? { contributed: "", endValue: "" }), ...patch },
            }));
          }

          function save() {
            if (split) {
              const parsed = parsedProducts(platform.id);
              if (typeof parsed === "string") {
                setErrors((current) => ({ ...current, [platform.id]: parsed }));
                return;
              }
              commitProducts(platform.id, parsed);
              return;
            }
            const parsed = parsedDraft(draft);
            if (typeof parsed === "string") {
              setErrors((current) => ({ ...current, [platform.id]: parsed }));
              return;
            }
            commit(platform.id, parsed.contributed, parsed.endValue);
          }

          function addNamedProduct() {
            const name = (productNames[platform.id] ?? "").trim();
            if (!name) return;
            const id = addProduct(platform.id, name);
            setSplitting((current) => ({ ...current, [platform.id]: true }));
            setProductNames((current) => ({ ...current, [platform.id]: "" }));
            setProductDrafts((current) =>
              current[id] ? current : { ...current, [id]: { contributed: "", endValue: "" } },
            );
          }

          return (
            <li key={platform.id} className="rounded-lg border border-line bg-card p-4">
              <div className="flex items-center gap-3">
                <KindMark kind={platform.kind} />
                <div className="min-w-0">
                  <p className="truncate font-medium">{platform.name}</p>
                  <p className="text-sm text-muted">
                    {kind}
                    {split ? " · por produto" : ""}
                    {saved && !dirty ? " · registado" : dirty ? " · por guardar" : " · por registar"}
                  </p>
                </div>
              </div>
              {split ? (
                <ul className="mt-4 space-y-4">
                  {lines.map((product) => {
                    const line = productDrafts[product.id] ?? { contributed: "", endValue: "" };
                    const earlier = latestBefore(
                      productEntries.filter((entry) => entry.productId === product.id),
                      month,
                    );
                    return (
                      <li key={product.id}>
                        <p className="font-medium">{product.name}</p>
                        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <label className="block">
                            <span className="mb-1.5 block text-sm font-medium">Aporte</span>
                            <input
                              inputMode="decimal"
                              value={line.contributed}
                              placeholder="0,00"
                              onChange={(event) => updateProduct(product.id, { contributed: event.target.value })}
                              className="h-12 w-full rounded-md border border-line bg-paper px-3 text-base tabular-nums text-ink outline-none focus-visible:border-forest"
                            />
                          </label>
                          <label className="block">
                            <span className="mb-1.5 block text-sm font-medium">Valor no fim</span>
                            <input
                              inputMode="decimal"
                              value={line.endValue}
                              placeholder="0,00"
                              onChange={(event) => updateProduct(product.id, { endValue: event.target.value })}
                              className="h-12 w-full rounded-md border border-line bg-paper px-3 text-base tabular-nums text-ink outline-none focus-visible:border-forest"
                            />
                            {earlier ? (
                              <span className="mt-1.5 block text-sm text-muted">
                                Mês anterior: {formatMoney(earlier.endValue, currency)}
                              </span>
                            ) : null}
                          </label>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
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
              )}
              <form
                className="mt-4 flex flex-col gap-2 sm:flex-row"
                onSubmit={(event) => {
                  event.preventDefault();
                  addNamedProduct();
                }}
              >
                <input
                  value={productNames[platform.id] ?? ""}
                  placeholder="Nome do produto"
                  maxLength={40}
                  onChange={(event) =>
                    setProductNames((current) => ({ ...current, [platform.id]: event.target.value }))
                  }
                  className="h-12 min-w-0 flex-1 rounded-md border border-line bg-paper px-3 text-base text-ink outline-none focus-visible:border-forest"
                />
                <Button type="submit" variant="soft" disabled={(productNames[platform.id] ?? "").trim() === ""}>
                  Adicionar produto
                </Button>
              </form>
              {split ? (
                <p className="mt-3 text-sm text-muted">O total da plataforma é a soma destes produtos.</p>
              ) : lines.length > 0 ? (
                <Button className="mt-3" variant="ghost" onClick={() => setSplitting((current) => ({ ...current, [platform.id]: true }))}>
                  Dividir este mês por produto
                </Button>
              ) : null}
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
                {!split && previous ? (
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
                {split && lines.some((product) => latestBefore(productEntries.filter((entry) => entry.productId === product.id), month)) ? (
                  <Button
                    variant="soft"
                    onClick={() =>
                      setProductDrafts((current) => {
                        const next = { ...current };
                        for (const product of lines) {
                          const earlier = latestBefore(
                            productEntries.filter((entry) => entry.productId === product.id),
                            month,
                          );
                          if (!earlier) continue;
                          const line = next[product.id] ?? { contributed: "", endValue: "" };
                          next[product.id] = {
                            contributed: line.contributed.trim() === "" ? formatPlain(0) : line.contributed,
                            endValue: formatPlain(earlier.endValue),
                          };
                        }
                        return next;
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
