import { i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { S as toBackup, b as parseBackup, i as authMiddleware } from "./backup-RJsyLcKr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/remote-Dapdlkhp.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
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
	const { getSql } = await import("./db-Dsl80zee.mjs").then((n) => n.t).then((n) => n.t);
	const rows = await (await getSql())`
      select data from ledgers where user_id = ${context.userId}
    `;
	if (rows.length === 0) return null;
	const raw = rows[0]?.data;
	const value = typeof raw === "string" ? JSON.parse(raw) : raw;
	const parsed = parseBackup(value);
	if (typeof parsed === "string") throw new Error("Caderneta ilegível.");
	return parsed;
});
var saveLedger_createServerFn_handler = createServerRpc({
	id: "94336ba60ad5fd3d3e26c0a812bda93c8cfff06ef5eb6a9fdc20d41278839862",
	name: "saveLedger",
	filename: "src/lib/ledger/remote.ts"
}, (opts) => saveLedger.__executeServer(opts));
var saveLedger = createServerFn({ method: "POST" }).validator((input) => {
	const parsed = parseBackup(input);
	if (typeof parsed === "string") throw new Error("Caderneta inválida.");
	return parsed;
}).middleware([authMiddleware]).handler(saveLedger_createServerFn_handler, async ({ context, data }) => {
	const { getSql } = await import("./db-Dsl80zee.mjs").then((n) => n.t).then((n) => n.t);
	const sql = await getSql();
	const payload = JSON.stringify(toBackup(data));
	await sql`
      insert into ledgers (user_id, data, updated_at)
      values (${context.userId}, ${payload}::jsonb, now())
      on conflict (user_id) do update
      set data = excluded.data, updated_at = now()
    `;
	return { ok: true };
});
//#endregion
export { ledgerBackend_createServerFn_handler, loadLedger_createServerFn_handler, saveLedger_createServerFn_handler };
