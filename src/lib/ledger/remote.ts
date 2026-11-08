import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { parseBackup, toBackup } from "@/lib/ledger/backup";
import type { LedgerData } from "@/lib/ledger/types";

async function ensureLedgers() {
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  await sql`
    create table if not exists ledgers (
      user_id text primary key,
      data jsonb not null,
      updated_at timestamptz not null default now()
    )
  `;
  return sql;
}

function asMillis(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return Math.trunc(value);
  if (typeof value === "bigint") return Number(value);
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return Math.trunc(parsed);
  }
  return null;
}

export type LedgerSnapshot = {
  data: LedgerData | null;
  updatedAt: number | null;
};

export type SaveLedgerResult =
  | { ok: true; updatedAt: number }
  | { ok: false; conflict: true; updatedAt: number | null };

export const ledgerBackend = createServerFn({ method: "GET" }).handler(async () => {
  const database = Boolean(process.env.DATABASE_URL?.trim());
  const authOff = process.env.VITE_AUTH_ENABLED === "false";
  return {
    mode: database ? ("postgres" as const) : ("local" as const),
    authOff,
  };
});

export const loadLedger = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<LedgerSnapshot> => {
    const sql = await ensureLedgers();
    const rows = await sql<{ data: unknown; updated_ms: unknown }>`
      select data,
             (extract(epoch from updated_at) * 1000)::bigint as updated_ms
      from ledgers
      where user_id = ${context.userId}
    `;
    if (rows.length === 0) return { data: null, updatedAt: null };
    const raw = rows[0]?.data;
    const value = typeof raw === "string" ? JSON.parse(raw) : raw;
    const parsed = parseBackup(value);
    if (typeof parsed === "string") throw new Error("Caderneta ilegível.");
    const updatedAt = asMillis(rows[0]?.updated_ms);
    if (updatedAt == null) throw new Error("Caderneta ilegível.");
    return { data: parsed, updatedAt };
  });

export const saveLedger = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    if (!input || typeof input !== "object") throw new Error("Caderneta ilegível.");
    const body = input as { ledger?: unknown; expectedUpdatedAt?: unknown; force?: unknown };
    const parsed = parseBackup(body.ledger);
    if (typeof parsed === "string") throw new Error(parsed);
    const expectedUpdatedAt = asMillis(body.expectedUpdatedAt);
    return { ledger: parsed, expectedUpdatedAt, force: body.force === true };
  })
  .middleware([authMiddleware])
  .handler(async ({ context, data }): Promise<SaveLedgerResult> => {
    const sql = await ensureLedgers();
    const payload = JSON.stringify(toBackup(data.ledger));
    const rows = await sql<{ updated_ms: unknown }>`
      insert into ledgers (user_id, data, updated_at)
      values (${context.userId}, ${payload}::jsonb, now())
      on conflict (user_id) do update
      set data = excluded.data,
          updated_at = now()
      where ${data.force}::boolean
         or (extract(epoch from ledgers.updated_at) * 1000)::bigint = ${data.expectedUpdatedAt}::bigint
      returning (extract(epoch from updated_at) * 1000)::bigint as updated_ms
    `;
    const updatedAt = asMillis(rows[0]?.updated_ms);
    if (rows.length === 0) {
      const current = await sql<{ updated_ms: unknown }>`
        select (extract(epoch from updated_at) * 1000)::bigint as updated_ms
        from ledgers
        where user_id = ${context.userId}
      `;
      return { ok: false, conflict: true, updatedAt: asMillis(current[0]?.updated_ms) };
    }
    if (updatedAt == null) throw new Error("Não consegui confirmar a gravação.");
    return { ok: true, updatedAt };
  });
