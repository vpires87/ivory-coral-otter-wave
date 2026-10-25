import { n as createMiddleware } from "./ssr.mjs";
import { n as parse, r as format, t as pt } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/backup-CGc3vTvo.js
/**
* Auth middleware for server functions — the standard way to get the caller's
* verified user id. When deployed the session cookie is same-origin and rides
* along automatically. In the live preview the client also forwards the bearer
* token (partitioned cookies) via the `.client` hook below — call sites do not
* thread it themselves.
*
*   import { createServerFn } from "@tanstack/react-start";
*   import { getSql } from "@/lib/db";
*   import { authMiddleware } from "@/lib/auth/middleware";
*
*   export const listTodos = createServerFn({ method: "GET" })
*     .middleware([authMiddleware])
*     .handler(async ({ context }) => {
*       const sql = await getSql();
*       return sql`select * from todos where user_id = ${context.userId}`;
*     });
*
* Signed out with auth on (live preview included) -> throws `UnauthorizedError`
* (see `verify.server.ts`). With auth disabled (`VITE_AUTH_ENABLED=false`, the
* shipped default) it resolves the shared dev user — but throws instead when a
* `DATABASE_URL` is also set, so an app without sign-in must not use this at
* all. On the auth-on path, use it on every server function that touches
* per-user data and scope every query by `context.userId`.
*/
var authMiddleware = createMiddleware({ type: "function" }).client(async ({ next }) => {
	const { getBearerToken } = await import("./client-IWHfIGH2.mjs").then((n) => n.n).then((n) => n.n);
	return next({ sendContext: { bearerToken: getBearerToken() ?? void 0 } });
}).server(async ({ next, context }) => {
	const { assertSameSiteRequest } = await import("./isolation.server-CGNg1r0B.mjs");
	const { requireUserId } = await import("./verify.server-gVw1DZS2.mjs");
	assertSameSiteRequest();
	return next({ context: { userId: await requireUserId(context.bearerToken) } });
});
function cents(n) {
	return Math.round(n * 100) / 100;
}
function currentMonth(now = /* @__PURE__ */ new Date()) {
	return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}
function clampClosingDay(day) {
	if (!Number.isInteger(day) || day < 1 || day > 31) return 1;
	return day;
}
function daysInMonth(ym) {
	const [year, month] = ym.split("-").map(Number);
	return new Date(Date.UTC(year, month, 0)).getUTCDate();
}
function dueMonth(closingDay, now = /* @__PURE__ */ new Date()) {
	const month = currentMonth(now);
	const day = Math.min(clampClosingDay(closingDay), daysInMonth(month));
	return now.getDate() >= day ? month : shiftMonth(month, -1);
}
function isClosingToday(closingDay, now = /* @__PURE__ */ new Date()) {
	const month = currentMonth(now);
	const day = Math.min(clampClosingDay(closingDay), daysInMonth(month));
	return now.getDate() === day;
}
function formatCloseDay(ym, closingDay) {
	const [year, month] = ym.split("-").map(Number);
	const day = Math.min(clampClosingDay(closingDay), daysInMonth(ym));
	const date = new Date(year, month - 1, day);
	return format(date, "d 'de' LLLL", { locale: pt });
}
function shiftMonth(ym, delta) {
	const [y, m] = ym.split("-").map(Number);
	const date = new Date(Date.UTC(y, m - 1 + delta, 1));
	return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}
function eachMonth(from, to) {
	const out = [];
	let cursor = from;
	while (cursor <= to && out.length < 600) {
		out.push(cursor);
		cursor = shiftMonth(cursor, 1);
	}
	return out;
}
function isMonth(value) {
	return /^\d{4}-(0[1-9]|1[0-2])$/.test(value);
}
function formatMonth(ym, style = "long") {
	const date = parse(`${ym}-01`, "yyyy-MM-dd", /* @__PURE__ */ new Date());
	const text = format(date, style === "long" ? "LLLL 'de' yyyy" : "LLL yy", { locale: pt });
	return text.charAt(0).toUpperCase() + text.slice(1);
}
function formatMoney(value, currency, options) {
	return new Intl.NumberFormat("pt-PT", {
		style: "currency",
		currency,
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
		signDisplay: options?.sign ? "exceptZero" : "auto"
	}).format(value);
}
function formatPlain(value) {
	return new Intl.NumberFormat("pt-PT", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(value);
}
function formatPercent(ratio) {
	return new Intl.NumberFormat("pt-PT", {
		style: "percent",
		minimumFractionDigits: 1,
		maximumFractionDigits: 1,
		signDisplay: "exceptZero"
	}).format(ratio);
}
function formatShare(ratio) {
	return new Intl.NumberFormat("pt-PT", {
		style: "percent",
		maximumFractionDigits: 0
	}).format(ratio);
}
function formatCompact(value) {
	return new Intl.NumberFormat("pt-PT", {
		notation: "compact",
		maximumFractionDigits: 1
	}).format(value);
}
function parseAmount(raw) {
	const trimmed = raw.trim().replace(/\s/g, "").replace(/[€$£]/g, "");
	if (!trimmed || trimmed === "-" || trimmed === "+" || trimmed === "," || trimmed === ".") return null;
	const normalized = trimmed.includes(",") ? trimmed.replace(/\./g, "").replace(",", ".") : trimmed;
	if (!/^[+-]?\d+(\.\d+)?$/.test(normalized)) return null;
	const value = Number(normalized);
	if (!Number.isFinite(value)) return null;
	return cents(value);
}
var PLATFORM_KINDS = [
	{
		id: "corretora",
		label: "Corretora"
	},
	{
		id: "banco",
		label: "Banco"
	},
	{
		id: "cripto",
		label: "Cripto"
	},
	{
		id: "ppr",
		label: "PPR"
	},
	{
		id: "poupanca",
		label: "Poupança"
	},
	{
		id: "outro",
		label: "Outro"
	}
];
var CURRENCIES = [
	{
		id: "EUR",
		label: "Euro"
	},
	{
		id: "USD",
		label: "Dólar"
	},
	{
		id: "GBP",
		label: "Libra"
	},
	{
		id: "CHF",
		label: "Franco suíço"
	},
	{
		id: "BRL",
		label: "Real"
	}
];
var kinds = new Set(PLATFORM_KINDS.map((kind) => kind.id));
var currencies = new Set(CURRENCIES.map((currency) => currency.id));
function asRecord(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return null;
	return value;
}
function asMoney(value) {
	if (typeof value !== "number" || !Number.isFinite(value)) return null;
	if (Math.abs(value) > 0xe8d4a51000) return null;
	return cents(value);
}
function parseBackup(raw) {
	const data = asRecord(raw);
	if (!data || data.version !== 1) return "Este ficheiro não é uma caderneta Lastro.";
	if (!Array.isArray(data.platforms) || !Array.isArray(data.entries)) return "Faltam plataformas ou meses no ficheiro.";
	if (data.platforms.length > 200 || data.entries.length > 8e3) return "O ficheiro é demasiado grande.";
	if (typeof data.currency !== "string" || !currencies.has(data.currency)) return "A moeda do ficheiro não é reconhecida.";
	const platforms = [];
	const seenPlatforms = /* @__PURE__ */ new Set();
	for (const item of data.platforms) {
		const row = asRecord(item);
		if (!row) return "Há uma plataforma inválida no ficheiro.";
		if (typeof row.id !== "string" || row.id.length < 1 || row.id.length > 80) return "Há uma plataforma sem identificador válido.";
		if (seenPlatforms.has(row.id)) return "Há plataformas repetidas no ficheiro.";
		seenPlatforms.add(row.id);
		if (typeof row.name !== "string" || row.name.trim().length < 1 || row.name.trim().length > 80) return "Há uma plataforma com nome inválido.";
		if (typeof row.kind !== "string" || !kinds.has(row.kind)) return "Há um tipo de plataforma inválido.";
		const opening = asMoney(row.openingInvested);
		if (opening == null || opening < 0) return "O capital inicial de uma plataforma é inválido.";
		platforms.push({
			id: row.id,
			name: row.name.trim(),
			kind: row.kind,
			openingInvested: opening
		});
	}
	const entries = [];
	const seenMonths = /* @__PURE__ */ new Set();
	for (const item of data.entries) {
		const row = asRecord(item);
		if (!row) return "Há um mês inválido no ficheiro.";
		if (typeof row.id !== "string" || row.id.length < 1 || row.id.length > 80) return "Há um mês sem identificador válido.";
		if (typeof row.platformId !== "string" || !seenPlatforms.has(row.platformId)) return "Há um mês ligado a uma plataforma que não existe.";
		if (typeof row.month !== "string" || !isMonth(row.month)) return "Há um mês com data inválida.";
		const key = `${row.platformId}|${row.month}`;
		if (seenMonths.has(key)) return "Há dois registos para a mesma plataforma no mesmo mês.";
		seenMonths.add(key);
		const contributed = asMoney(row.contributed);
		const endValue = asMoney(row.endValue);
		if (contributed == null || endValue == null || endValue < 0) return "Há um valor mensal inválido.";
		entries.push({
			id: row.id,
			platformId: row.platformId,
			month: row.month,
			contributed,
			endValue
		});
	}
	let monthlyGoal = null;
	if (data.monthlyGoal != null) {
		const goal = asMoney(data.monthlyGoal);
		if (goal == null || goal < 0) return "A meta mensal é inválida.";
		monthlyGoal = goal > 0 ? goal : null;
	}
	let fireGoal = null;
	if (data.fireGoal != null) {
		const goal = asMoney(data.fireGoal);
		if (goal == null || goal < 0) return "O objetivo FIRE é inválido.";
		fireGoal = goal > 0 ? goal : null;
	}
	let closingDay = 1;
	if (data.closingDay != null) {
		if (typeof data.closingDay !== "number" || !Number.isInteger(data.closingDay)) return "O dia de fecho é inválido.";
		closingDay = clampClosingDay(data.closingDay);
		if (data.closingDay < 1 || data.closingDay > 31) return "O dia de fecho é inválido.";
	}
	const expenseTypes = [];
	const seenTypes = /* @__PURE__ */ new Set();
	const typeRows = data.expenseTypes == null ? [] : data.expenseTypes;
	if (!Array.isArray(typeRows)) return "Os tipos de despesa do ficheiro são inválidos.";
	if (typeRows.length > 40) return "Há tipos de despesa a mais.";
	for (const item of typeRows) {
		const row = asRecord(item);
		if (!row) return "Há um tipo de despesa inválido.";
		if (typeof row.id !== "string" || row.id.length < 1 || row.id.length > 80) return "Há um tipo de despesa sem identificador válido.";
		if (seenTypes.has(row.id)) return "Há tipos de despesa repetidos.";
		seenTypes.add(row.id);
		if (typeof row.name !== "string" || row.name.trim().length < 1 || row.name.trim().length > 40) return "Há um tipo de despesa com nome inválido.";
		expenseTypes.push({
			id: row.id,
			name: row.name.trim()
		});
	}
	const expenses = [];
	const seenExpenses = /* @__PURE__ */ new Set();
	const expenseRows = data.expenses == null ? [] : data.expenses;
	if (!Array.isArray(expenseRows)) return "As despesas do ficheiro são inválidas.";
	if (expenseRows.length > 8e3) return "O ficheiro é demasiado grande.";
	for (const item of expenseRows) {
		const row = asRecord(item);
		if (!row) return "Há uma despesa inválida.";
		if (typeof row.id !== "string" || row.id.length < 1 || row.id.length > 80) return "Há uma despesa sem identificador válido.";
		if (typeof row.typeId !== "string" || !seenTypes.has(row.typeId)) return "Há uma despesa ligada a um tipo que não existe.";
		if (typeof row.month !== "string" || !isMonth(row.month)) return "Há uma despesa com mês inválido.";
		const key = `${row.typeId}|${row.month}`;
		if (seenExpenses.has(key)) return "Há duas despesas do mesmo tipo no mesmo mês.";
		seenExpenses.add(key);
		const amount = asMoney(row.amount);
		if (amount == null || amount < 0) return "Há um valor de despesa inválido.";
		expenses.push({
			id: row.id,
			typeId: row.typeId,
			month: row.month,
			amount
		});
	}
	const cashbackCards = [];
	const seenCards = /* @__PURE__ */ new Set();
	const cardRows = data.cashbackCards == null ? [] : data.cashbackCards;
	if (!Array.isArray(cardRows)) return "Os cartões do ficheiro são inválidos.";
	if (cardRows.length > 30) return "Há cartões a mais.";
	for (const item of cardRows) {
		const row = asRecord(item);
		if (!row) return "Há um cartão inválido.";
		if (typeof row.id !== "string" || row.id.length < 1 || row.id.length > 80) return "Há um cartão sem identificador válido.";
		if (seenCards.has(row.id)) return "Há cartões repetidos.";
		seenCards.add(row.id);
		if (typeof row.name !== "string" || row.name.trim().length < 1 || row.name.trim().length > 40) return "Há um cartão com nome inválido.";
		cashbackCards.push({
			id: row.id,
			name: row.name.trim()
		});
	}
	const cashbacks = [];
	const seenCash = /* @__PURE__ */ new Set();
	const cashRows = data.cashbacks == null ? [] : data.cashbacks;
	if (!Array.isArray(cashRows)) return "O cashback do ficheiro é inválido.";
	if (cashRows.length > 8e3) return "O ficheiro é demasiado grande.";
	for (const item of cashRows) {
		const row = asRecord(item);
		if (!row) return "Há um cashback inválido.";
		if (typeof row.id !== "string" || row.id.length < 1 || row.id.length > 80) return "Há um cashback sem identificador válido.";
		if (typeof row.cardId !== "string" || !seenCards.has(row.cardId)) return "Há cashback ligado a um cartão que não existe.";
		if (typeof row.month !== "string" || !isMonth(row.month)) return "Há cashback com mês inválido.";
		const key = `${row.cardId}|${row.month}`;
		if (seenCash.has(key)) return "Há dois cashbacks do mesmo cartão no mesmo mês.";
		seenCash.add(key);
		const amount = asMoney(row.amount);
		if (amount == null || amount < 0) return "Há um valor de cashback inválido.";
		cashbacks.push({
			id: row.id,
			cardId: row.cardId,
			month: row.month,
			amount
		});
	}
	return {
		currency: data.currency,
		platforms,
		entries,
		expenseTypes,
		expenses,
		cashbackCards,
		cashbacks,
		monthlyGoal,
		fireGoal,
		closingDay,
		demo: data.demo === true
	};
}
function toBackup(data) {
	return {
		version: 1,
		app: "lastro",
		exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
		currency: data.currency,
		monthlyGoal: data.monthlyGoal,
		fireGoal: data.fireGoal,
		closingDay: data.closingDay,
		platforms: data.platforms,
		entries: data.entries,
		expenseTypes: data.expenseTypes,
		expenses: data.expenses,
		cashbackCards: data.cashbackCards,
		cashbacks: data.cashbacks,
		demo: data.demo
	};
}
//#endregion
export { parseAmount as _, clampClosingDay as a, toBackup as b, eachMonth as c, formatMoney as d, formatMonth as f, isClosingToday as g, formatShare as h, cents as i, formatCloseDay as l, formatPlain as m, PLATFORM_KINDS as n, currentMonth as o, formatPercent as p, authMiddleware as r, dueMonth as s, CURRENCIES as t, formatCompact as u, parseBackup as v, shiftMonth as y };
