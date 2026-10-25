import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { parseBackup, toBackup } from "@/lib/ledger/backup";
import type { LedgerData } from "@/lib/ledger/types";

export const loadLedger = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<LedgerData | null> => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql<{ data: unknown }>`
      select data from ledgers where user_id = ${context.userId}
    `;
    if (rows.length === 0) return null;
    const raw = rows[0]?.data;
    const value = typeof raw === "string" ? JSON.parse(raw) : raw;
    const parsed = parseBackup(value);
    if (typeof parsed === "string") throw new Error("Caderneta ilegível.");
    return parsed;
  });

export const saveLedger = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    const parsed = parseBackup(input);
    if (typeof parsed === "string") throw new Error("Caderneta inválida.");
    return parsed;
  })
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const payload = JSON.stringify(toBackup(data));
    await sql`
      insert into ledgers (user_id, data, updated_at)
      values (${context.userId}, ${payload}::jsonb, now())
      on conflict (user_id) do update
      set data = excluded.data, updated_at = now()
    `;
    return { ok: true as const };
  });
