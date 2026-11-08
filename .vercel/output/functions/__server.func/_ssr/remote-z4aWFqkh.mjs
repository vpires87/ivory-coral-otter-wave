import { i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { S as parseBackup, i as authMiddleware, w as toBackup } from "./backup-CoUVcS4P.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/remote-z4aWFqkh.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
async function ensureLedgers() {
	const { getSql } = await import("./db-Dsl80zee.mjs").then((n) => n.t).then((n) => n.t);
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
function asMillis(value) {
	if (typeof value === "number" && Number.isFinite(value)) return Math.trunc(value);
	if (typeof value === "bigint") return Number(value);
	if (typeof value === "string" && value.trim() !== "") {
		const parsed = Number(value);
		if (Number.isFinite(parsed)) return Math.trunc(parsed);
	}
	return null;
}
var ledgerBackend_createServerFn_handler = createServerRpc({
	id: "7f84c3db189cdf5bb13ff81656de165a11d3e83638c0ed2e4630f03baf81d1cc",
	name: "ledgerBackend",
	filename: "src/lib/ledger/remote.ts"
}, (opts) => ledgerBackend.__executeServer(opts));
var ledgerBackend = createServerFn({ method: "GET" }).handler(ledgerBackend_createServerFn_handler, async () => {
	const database = Boolean(process.env.DATABASE_URL?.trim());
	const authOff = process.env.VITE_AUTH_ENABLED === "false";
	return {
		mode: database ? "postgres" : "local",
		authOff
	};
});
var loadLedger_createServerFn_handler = createServerRpc({
	id: "b1169f5b85e3d12f18a4ae8bfa2efe3c74a72d6fa29cb184412a323254a7101b",
	name: "loadLedger",
	filename: "src/lib/ledger/remote.ts"
}, (opts) => loadLedger.__executeServer(opts));
var loadLedger = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(loadLedger_createServerFn_handler, async ({ context }) => {
	const rows = await (await ensureLedgers())`
      select data,
             (extract(epoch from updated_at) * 1000)::bigint as updated_ms
      from ledgers
      where user_id = ${context.userId}
    `;
	if (rows.length === 0) return {
		data: null,
		updatedAt: null
	};
	const raw = rows[0]?.data;
	const value = typeof raw === "string" ? JSON.parse(raw) : raw;
	const parsed = parseBackup(value);
	if (typeof parsed === "string") throw new Error("Caderneta ilegível.");
	const updatedAt = asMillis(rows[0]?.updated_ms);
	if (updatedAt == null) throw new Error("Caderneta ilegível.");
	return {
		data: parsed,
		updatedAt
	};
});
var saveLedger_createServerFn_handler = createServerRpc({
	id: "94336ba60ad5fd3d3e26c0a812bda93c8cfff06ef5eb6a9fdc20d41278839862",
	name: "saveLedger",
	filename: "src/lib/ledger/remote.ts"
}, (opts) => saveLedger.__executeServer(opts));
var saveLedger = createServerFn({ method: "POST" }).validator((input) => {
	if (!input || typeof input !== "object") throw new Error("Caderneta ilegível.");
	const body = input;
	const parsed = parseBackup(body.ledger);
	if (typeof parsed === "string") throw new Error(parsed);
	return {
		ledger: parsed,
		expectedUpdatedAt: asMillis(body.expectedUpdatedAt),
		force: body.force === true
	};
}).middleware([authMiddleware]).handler(saveLedger_createServerFn_handler, async ({ context, data }) => {
	const sql = await ensureLedgers();
	const payload = JSON.stringify(toBackup(data.ledger));
	const rows = await sql`
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
	if (rows.length === 0) return {
		ok: false,
		conflict: true,
		updatedAt: asMillis((await sql`
        select (extract(epoch from updated_at) * 1000)::bigint as updated_ms
        from ledgers
        where user_id = ${context.userId}
      `)[0]?.updated_ms)
	};
	if (updatedAt == null) throw new Error("Não consegui confirmar a gravação.");
	return {
		ok: true,
		updatedAt
	};
});
//#endregion
export { ledgerBackend_createServerFn_handler, loadLedger_createServerFn_handler, saveLedger_createServerFn_handler };
