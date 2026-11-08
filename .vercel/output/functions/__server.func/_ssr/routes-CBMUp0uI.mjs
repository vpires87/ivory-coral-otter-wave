import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { r as signOut, t as authClient } from "./client-CH2mWUg4.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as DialogOverlay, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { C as shiftMonth, S as parseBackup, _ as formatShare, a as cents, b as isMonth, c as dueMonth, d as formatCompact, f as formatMoney, g as formatSavedAt, h as formatPlain, l as eachMonth, m as formatPercent, n as INCOME_KINDS, o as clampClosingDay, p as formatMonth, r as PLATFORM_KINDS, s as currentMonth, t as CURRENCIES, u as formatCloseDay, v as formatWhen, w as toBackup, x as parseAmount, y as isClosingToday } from "./backup-CoUVcS4P.mjs";
import { a as Settings, c as ChevronRight, d as Bitcoin, i as Shapes, l as ChevronLeft, n as Wallet, o as PiggyBank, s as Landmark, t as X, u as ChartLine } from "../_libs/lucide-react.mjs";
import { a as THEMES, i as saveLedger, n as Route$2, o as readTheme, r as loadLedger, s as storeTheme } from "./router-Bl8LK1SE.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { a as Area, c as ReferenceLine, d as ResponsiveContainer, f as Tooltip, i as XAxis, l as Bar, n as BarChart, o as Line, r as YAxis, s as CartesianGrid, t as ComposedChart, u as Cell } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CBMUp0uI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function byMonth(a, b) {
	return a.month < b.month ? -1 : a.month > b.month ? 1 : 0;
}
function buildSeries(platforms, entries) {
	if (entries.length === 0) return [];
	const sorted = [...entries].sort(byMonth);
	const months = eachMonth(sorted[0].month, sorted[sorted.length - 1].month);
	const lookup = /* @__PURE__ */ new Map();
	for (const entry of entries) lookup.set(`${entry.platformId}|${entry.month}`, entry);
	const latest = /* @__PURE__ */ new Map();
	const started = /* @__PURE__ */ new Set();
	let cumulative = 0;
	let prevResult = 0;
	return months.map((month) => {
		let contributed = 0;
		let recorded = 0;
		for (const platform of platforms) {
			const entry = lookup.get(`${platform.id}|${month}`);
			if (!entry) continue;
			recorded += 1;
			contributed = cents(contributed + entry.contributed);
			latest.set(platform.id, entry.endValue);
			started.add(platform.id);
		}
		cumulative = cents(cumulative + contributed);
		let opening = 0;
		let value = 0;
		for (const platform of platforms) {
			if (!started.has(platform.id)) continue;
			opening = cents(opening + platform.openingInvested);
			value = cents(value + (latest.get(platform.id) ?? 0));
		}
		const invested = cents(opening + cumulative);
		const result = cents(value - invested);
		const market = cents(result - prevResult);
		prevResult = result;
		return {
			month,
			contributed,
			invested,
			value,
			market,
			recorded
		};
	});
}
function totals(platforms, entries) {
	const series = buildSeries(platforms, entries);
	const withValue = platforms.filter((platform) => entries.some((entry) => entry.platformId === platform.id)).length;
	if (series.length === 0) return {
		invested: 0,
		value: 0,
		result: 0,
		resultRatio: null,
		latestMonth: null,
		withValue: 0
	};
	const last = series[series.length - 1];
	const result = cents(last.value - last.invested);
	return {
		invested: last.invested,
		value: last.value,
		result,
		resultRatio: last.invested !== 0 ? result / last.invested : null,
		latestMonth: last.month,
		withValue
	};
}
function pointFor(series, month) {
	return series.find((point) => point.month === month) ?? null;
}
function platformSnapshot(platform, entries) {
	const mine = entries.filter((entry) => entry.platformId === platform.id).sort(byMonth);
	if (mine.length === 0) return {
		invested: platform.openingInvested,
		value: null,
		result: null,
		resultRatio: null,
		months: 0,
		lastMonth: null
	};
	const contributed = mine.reduce((sum, entry) => cents(sum + entry.contributed), 0);
	const invested = cents(platform.openingInvested + contributed);
	const value = mine[mine.length - 1].endValue;
	const result = cents(value - invested);
	return {
		invested,
		value,
		result,
		resultRatio: invested !== 0 ? result / invested : null,
		months: mine.length,
		lastMonth: mine[mine.length - 1].month
	};
}
function platformRows(platform, entries) {
	const mine = entries.filter((entry) => entry.platformId === platform.id).sort(byMonth);
	let prevValue = null;
	return mine.map((entry) => {
		const market = prevValue == null ? cents(entry.endValue - (platform.openingInvested + entry.contributed)) : cents(entry.endValue - prevValue - entry.contributed);
		prevValue = entry.endValue;
		return {
			...entry,
			market
		};
	});
}
function previousEntry(entries, platformId, month) {
	const older = entries.filter((entry) => entry.platformId === platformId && entry.month < month).sort(byMonth);
	return older.length > 0 ? older[older.length - 1] : null;
}
function latestBefore(rows, month) {
	let best = null;
	for (const row of rows) if (row.month < month && (best == null || row.month > best.month)) best = row;
	return best;
}
function yearlyRollup(series) {
	const years = /* @__PURE__ */ new Map();
	for (const point of series) {
		const year = point.month.slice(0, 4);
		const current = years.get(year) ?? {
			year,
			contributed: 0,
			market: 0,
			endValue: 0
		};
		current.contributed = cents(current.contributed + point.contributed);
		current.market = cents(current.market + point.market);
		current.endValue = point.value;
		years.set(year, current);
	}
	return [...years.values()];
}
var MONTH_LABELS = [
	"Jan",
	"Fev",
	"Mar",
	"Abr",
	"Mai",
	"Jun",
	"Jul",
	"Ago",
	"Set",
	"Out",
	"Nov",
	"Dez"
];
function sumByMonth(rows) {
	const totals = /* @__PURE__ */ new Map();
	for (const row of rows) {
		if (!isMonth(row.month)) continue;
		totals.set(row.month, cents((totals.get(row.month) ?? 0) + row.amount));
	}
	return [...totals.entries()].sort((left, right) => left[0] < right[0] ? -1 : 1).map(([month, amount]) => ({
		month,
		amount
	}));
}
function compareByYear(points) {
	const years = [...new Set(points.filter((point) => isMonth(point.month)).map((point) => point.month.slice(0, 4)))].sort();
	const rows = MONTH_LABELS.map((label) => {
		const row = { label };
		for (const year of years) row[year] = null;
		return row;
	});
	for (const point of points) {
		if (!isMonth(point.month)) continue;
		const year = point.month.slice(0, 4);
		const month = Number(point.month.slice(5, 7));
		rows[month - 1][year] = point.amount;
	}
	const first = rows.findIndex((row) => years.some((year) => row[year] != null));
	if (first < 0) return {
		years: [],
		rows: []
	};
	let last = rows.length - 1;
	while (last > first && years.every((year) => rows[last]?.[year] == null)) last -= 1;
	return {
		years,
		rows: rows.slice(first, last + 1)
	};
}
function entryFor(entries, platformId, month) {
	return entries.find((entry) => entry.platformId === platformId && entry.month === month) ?? null;
}
function valueShares(platforms, entries) {
	return withShares(platforms.map((platform) => ({
		id: platform.id,
		label: platform.name,
		value: platformSnapshot(platform, entries).value ?? 0
	})).filter((row) => row.value > 0).sort((a, b) => b.value - a.value || a.label.localeCompare(b.label, "pt")));
}
function kindShares(platforms, entries) {
	const totalsByKind = /* @__PURE__ */ new Map();
	for (const platform of platforms) {
		const value = platformSnapshot(platform, entries).value ?? 0;
		if (value <= 0) continue;
		totalsByKind.set(platform.kind, cents((totalsByKind.get(platform.kind) ?? 0) + value));
	}
	const rows = [...totalsByKind.entries()].map(([id, value]) => ({
		id,
		label: PLATFORM_KINDS.find((kind) => kind.id === id)?.label ?? id,
		value
	}));
	rows.sort((a, b) => b.value - a.value || a.label.localeCompare(b.label, "pt"));
	return withShares(rows);
}
function productEntryFor(entries, productId, month) {
	return entries.find((entry) => entry.productId === productId && entry.month === month) ?? null;
}
function latestProductEntry(entries, productId) {
	const mine = entries.filter((entry) => entry.productId === productId).sort(byMonth);
	return mine.length > 0 ? mine[mine.length - 1] : null;
}
function productShares(platforms, products, entries, productEntries) {
	const rows = [];
	for (const platform of platforms) {
		const value = platformSnapshot(platform, entries).value ?? 0;
		if (value <= 0) continue;
		const valued = products.filter((product) => product.platformId === platform.id).map((product) => ({
			product,
			latest: latestProductEntry(productEntries, product.id)
		})).filter((item) => item.latest != null && item.latest.endValue > 0);
		if (valued.length === 0) {
			rows.push({
				id: platform.id,
				label: platform.name,
				value
			});
			continue;
		}
		let used = 0;
		for (const item of valued) {
			const amount = item.latest?.endValue ?? 0;
			rows.push({
				id: item.product.id,
				label: item.product.name,
				value: amount
			});
			used = cents(used + amount);
		}
		const rest = cents(value - used);
		if (rest > 0) rows.push({
			id: `${platform.id}-rest`,
			label: `${platform.name} por atribuir`,
			value: rest
		});
	}
	rows.sort((a, b) => b.value - a.value || a.label.localeCompare(b.label, "pt"));
	return withShares(rows);
}
function withShares(rows) {
	const total = rows.reduce((sum, row) => cents(sum + row.value), 0);
	if (total <= 0) return [];
	return rows.map((row) => ({
		...row,
		share: row.value / total
	}));
}
function expenseFor(expenses, typeId, month) {
	return expenses.find((entry) => entry.typeId === typeId && entry.month === month) ?? null;
}
function expenseSeries(types, expenses) {
	if (expenses.length === 0) return [];
	const sorted = [...expenses].sort(byMonth);
	return eachMonth(sorted[0].month, sorted[sorted.length - 1].month).map((month) => {
		const byType = {};
		let total = 0;
		for (const type of types) {
			const entry = expenseFor(expenses, type.id, month);
			if (!entry) continue;
			byType[type.id] = entry.amount;
			total = cents(total + entry.amount);
		}
		return {
			month,
			total,
			byType
		};
	});
}
function expenseTotal(expenses, month) {
	return expenses.reduce((sum, entry) => entry.month === month ? cents(sum + entry.amount) : sum, 0);
}
function cashbackFor(entries, cardId, month) {
	return entries.find((entry) => entry.cardId === cardId && entry.month === month) ?? null;
}
function cashbackTotal(entries, month) {
	return entries.reduce((sum, entry) => entry.month === month ? cents(sum + entry.amount) : sum, 0);
}
function cashbackRows(cards, entries, month) {
	return cards.map((card) => ({
		id: card.id,
		name: card.name,
		amount: cashbackFor(entries, card.id, month)?.amount ?? 0
	})).sort((a, b) => b.amount - a.amount || a.name.localeCompare(b.name, "pt"));
}
function cashbackSeries(cards, entries) {
	if (entries.length === 0) return [];
	const sorted = [...entries].sort(byMonth);
	return eachMonth(sorted[0].month, sorted[sorted.length - 1].month).map((month) => ({
		month,
		total: cashbackTotal(entries, month),
		rows: cashbackRows(cards, entries, month)
	}));
}
function incomeFor(entries, sourceId, month) {
	return entries.find((entry) => entry.sourceId === sourceId && entry.month === month) ?? null;
}
function incomeTotal(entries, month) {
	return entries.reduce((sum, entry) => entry.month === month ? cents(sum + entry.amount) : sum, 0);
}
function contributedIn(entries, month) {
	return entries.reduce((sum, entry) => entry.month === month ? cents(sum + entry.contributed) : sum, 0);
}
function savingsRate(invested, earned) {
	if (earned <= 0) return null;
	return invested / earned;
}
function savingsSeries(contributions, incomes) {
	const months = /* @__PURE__ */ new Set();
	for (const entry of contributions) months.add(entry.month);
	for (const entry of incomes) months.add(entry.month);
	if (months.size === 0) return [];
	const sorted = [...months].sort();
	return eachMonth(sorted[0], sorted[sorted.length - 1]).map((month) => {
		const earned = incomeTotal(incomes, month);
		const invested = contributedIn(contributions, month);
		return {
			month,
			earned,
			invested,
			rate: savingsRate(invested, earned)
		};
	});
}
var platforms = [
	{
		id: "demo-xtb",
		name: "XTB",
		kind: "corretora",
		openingInvested: 2700
	},
	{
		id: "demo-tr",
		name: "Trade Republic",
		kind: "corretora",
		openingInvested: 700
	},
	{
		id: "demo-ctt",
		name: "Banco CTT",
		kind: "poupanca",
		openingInvested: 0
	},
	{
		id: "demo-binance",
		name: "Binance",
		kind: "cripto",
		openingInvested: 400
	}
];
function row(platformId, month, contributed, endValue) {
	return {
		id: `demo-${platformId}-${month}`,
		platformId,
		month,
		contributed,
		endValue
	};
}
var entries = [
	row("demo-xtb", "2026-03", 300, 4680),
	row("demo-xtb", "2026-04", 300, 5050),
	row("demo-xtb", "2026-05", 300, 5290),
	row("demo-xtb", "2026-06", 0, 5410),
	row("demo-xtb", "2026-07", 300, 5820),
	row("demo-xtb", "2026-08", 300, 6240),
	row("demo-xtb", "2026-09", 300, 6710),
	row("demo-tr", "2026-03", 200, 1740),
	row("demo-tr", "2026-04", 200, 1985),
	row("demo-tr", "2026-05", 200, 2230),
	row("demo-tr", "2026-06", 200, 2410),
	row("demo-tr", "2026-07", 250, 2720),
	row("demo-tr", "2026-08", 250, 3010),
	row("demo-tr", "2026-09", 250, 3340),
	row("demo-ctt", "2026-03", 400, 400),
	row("demo-ctt", "2026-04", 0, 401),
	row("demo-ctt", "2026-05", 0, 402),
	row("demo-ctt", "2026-06", 100, 503),
	row("demo-ctt", "2026-07", 0, 504),
	row("demo-ctt", "2026-08", 0, 505),
	row("demo-ctt", "2026-09", 0, 506),
	row("demo-binance", "2026-03", 100, 820),
	row("demo-binance", "2026-04", 0, 1040),
	row("demo-binance", "2026-05", 100, 990),
	row("demo-binance", "2026-06", 0, 760),
	row("demo-binance", "2026-07", 150, 980),
	row("demo-binance", "2026-08", 0, 910),
	row("demo-binance", "2026-09", 100, 1180)
];
function climb(from, to, steps, index) {
	return Math.round(from + (to - from) * (index + 1) / steps);
}
for (let index = 0; index < 10; index += 1) {
	const month = `2025-${String(index + 3).padStart(2, "0")}`;
	entries.push(row("demo-xtb", month, 150, climb(2900, 4200, 10, index)), row("demo-tr", month, 80, climb(780, 1500, 10, index)), row("demo-binance", month, 40, climb(420, 800, 10, index)));
}
var expenseTypes = [
	{
		id: "demo-renda",
		name: "Renda"
	},
	{
		id: "demo-comida",
		name: "Alimentação"
	},
	{
		id: "demo-transp",
		name: "Transportes"
	},
	{
		id: "demo-lazer",
		name: "Lazer"
	}
];
function spent(typeId, month, amount) {
	return {
		id: `demo-${typeId}-${month}`,
		typeId,
		month,
		amount
	};
}
var food = [
	260,
	280,
	310,
	290,
	300,
	270,
	295
];
var transit = [
	65,
	70,
	80,
	60,
	90,
	55,
	70
];
var leisure = [
	40,
	120,
	35,
	80,
	45,
	150,
	60
];
var expenses = [];
for (let index = 0; index < 7; index += 1) {
	const month = `2026-${String(index + 3).padStart(2, "0")}`;
	expenses.push(spent("demo-renda", month, 780), spent("demo-comida", month, food[index]), spent("demo-transp", month, transit[index]), spent("demo-lazer", month, leisure[index]));
}
var cashbackCards = [
	{
		id: "demo-universo",
		name: "Universo"
	},
	{
		id: "demo-ctt-card",
		name: "CTT"
	},
	{
		id: "demo-revolut",
		name: "Revolut"
	}
];
var universo = [
	8,
	9,
	11,
	7,
	10,
	12,
	14
];
var cttCard = [
	3,
	4,
	3,
	5,
	4,
	6,
	4
];
var revolut = [
	6,
	8,
	15,
	9,
	11,
	7,
	18
];
function rebate(cardId, month, amount) {
	return {
		id: `demo-${cardId}-${month}`,
		cardId,
		month,
		amount
	};
}
var cashbacks = [];
for (let index = 0; index < 7; index += 1) {
	const month = `2026-${String(index + 3).padStart(2, "0")}`;
	cashbacks.push(rebate("demo-universo", month, universo[index]), rebate("demo-ctt-card", month, cttCard[index]), rebate("demo-revolut", month, revolut[index]));
}
var incomeSources = [{
	id: "demo-ordenado",
	name: "Empresa",
	kind: "ordenado"
}, {
	id: "demo-extra",
	name: "Freelance",
	kind: "extra"
}];
var extras = [
	0,
	150,
	0,
	400,
	0,
	200,
	0
];
function earned(sourceId, month, amount) {
	return {
		id: `demo-${sourceId}-${month}`,
		sourceId,
		month,
		amount
	};
}
var incomes = [];
for (let index = 0; index < 7; index += 1) {
	const month = `2026-${String(index + 3).padStart(2, "0")}`;
	incomes.push(earned("demo-ordenado", month, 2100));
	if (extras[index] > 0) incomes.push(earned("demo-extra", month, extras[index]));
}
for (let index = 0; index < 10; index += 1) {
	const month = `2025-${String(index + 3).padStart(2, "0")}`;
	expenses.push(spent("demo-renda", month, 750), spent("demo-comida", month, 240 + index % 3 * 10), spent("demo-transp", month, 55), spent("demo-lazer", month, index % 2 === 0 ? 30 : 90));
	incomes.push(earned("demo-ordenado", month, 1950));
	if (index % 4 === 0) incomes.push(earned("demo-extra", month, 120));
}
var products = [{
	id: "demo-vwce",
	platformId: "demo-xtb",
	name: "VWCE"
}, {
	id: "demo-sxr8",
	platformId: "demo-xtb",
	name: "SXR8"
}];
var productEntries = [{
	id: "demo-vwce-2026-09",
	productId: "demo-vwce",
	month: "2026-09",
	contributed: 200,
	endValue: 4200
}, {
	id: "demo-sxr8-2026-09",
	productId: "demo-sxr8",
	month: "2026-09",
	contributed: 100,
	endValue: 2510
}];
function demoLedger() {
	return {
		platforms: platforms.map((platform) => ({ ...platform })),
		entries: entries.map((entry) => ({ ...entry })),
		products: products.map((product) => ({ ...product })),
		productEntries: productEntries.map((entry) => ({ ...entry })),
		expenseTypes: expenseTypes.map((type) => ({ ...type })),
		expenses: expenses.map((entry) => ({ ...entry })),
		cashbackCards: cashbackCards.map((card) => ({ ...card })),
		cashbacks: cashbacks.map((entry) => ({ ...entry })),
		incomeSources: incomeSources.map((source) => ({ ...source })),
		incomes: incomes.map((entry) => ({ ...entry })),
		currency: "EUR",
		monthlyGoal: 650,
		fireGoal: 5e4,
		closingDay: 25,
		demo: true
	};
}
function newId() {
	const cryptoObj = globalThis.crypto;
	if (cryptoObj && typeof cryptoObj.randomUUID === "function") return cryptoObj.randomUUID();
	const bytes = /* @__PURE__ */ new Uint8Array(16);
	if (cryptoObj && typeof cryptoObj.getRandomValues === "function") cryptoObj.getRandomValues(bytes);
	else for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256);
	bytes[6] = bytes[6] & 15 | 64;
	bytes[8] = bytes[8] & 63 | 128;
	const hex = [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
	return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
var empty = {
	platforms: [],
	entries: [],
	products: [],
	productEntries: [],
	expenseTypes: [],
	expenses: [],
	cashbackCards: [],
	cashbacks: [],
	incomeSources: [],
	incomes: [],
	currency: "EUR",
	monthlyGoal: null,
	fireGoal: null,
	closingDay: 1,
	demo: false
};
var useLedger = create()((set) => ({
	...empty,
	ready: true,
	saving: false,
	syncError: null,
	loadAttempt: 0,
	savedAt: null,
	conflictAt: null,
	pendingSync: null,
	deviceDemo: false,
	remote: false,
	setCurrency: (currency) => set({ currency }),
	setMonthlyGoal: (goal) => set({ monthlyGoal: goal == null || goal <= 0 ? null : cents(goal) }),
	setFireGoal: (goal) => set({ fireGoal: goal == null || goal <= 0 ? null : cents(goal) }),
	setClosingDay: (day) => set({ closingDay: clampClosingDay(day) }),
	addPlatform: (draft) => {
		const id = newId();
		set((state) => ({ platforms: [...state.platforms, {
			id,
			name: draft.name.trim(),
			kind: draft.kind,
			openingInvested: cents(draft.openingInvested)
		}] }));
		return id;
	},
	updatePlatform: (id, draft) => set((state) => ({ platforms: state.platforms.map((platform) => platform.id === id ? {
		...platform,
		name: draft.name.trim(),
		kind: draft.kind,
		openingInvested: cents(draft.openingInvested)
	} : platform) })),
	deletePlatform: (id) => set((state) => ({
		platforms: state.platforms.filter((platform) => platform.id !== id),
		entries: state.entries.filter((entry) => entry.platformId !== id),
		products: state.products.filter((product) => product.platformId !== id),
		productEntries: state.productEntries.filter((entry) => state.products.some((product) => product.platformId !== id && product.id === entry.productId))
	})),
	upsertEntry: (input) => set((state) => {
		const index = state.entries.findIndex((entry) => entry.platformId === input.platformId && entry.month === input.month);
		const next = {
			contributed: cents(input.contributed),
			endValue: cents(input.endValue)
		};
		if (index >= 0) {
			const entries = state.entries.slice();
			entries[index] = {
				...entries[index],
				...next
			};
			return { entries };
		}
		return { entries: [...state.entries, {
			id: newId(),
			platformId: input.platformId,
			month: input.month,
			...next
		}] };
	}),
	deleteEntry: (id) => set((state) => {
		const entry = state.entries.find((item) => item.id === id);
		const productIds = new Set(entry ? state.products.filter((product) => product.platformId === entry.platformId).map((product) => product.id) : []);
		return {
			entries: state.entries.filter((item) => item.id !== id),
			productEntries: entry ? state.productEntries.filter((item) => item.month !== entry.month || !productIds.has(item.productId)) : state.productEntries
		};
	}),
	addProduct: (platformId, name) => {
		const trimmed = name.trim();
		const created = newId();
		let result = created;
		set((state) => {
			const existing = state.products.find((product) => product.platformId === platformId && product.name.toLowerCase() === trimmed.toLowerCase());
			if (existing) {
				result = existing.id;
				return {};
			}
			return { products: [...state.products, {
				id: created,
				platformId,
				name: trimmed
			}] };
		});
		return result;
	},
	renameProduct: (id, name) => set((state) => ({ products: state.products.map((product) => product.id === id ? {
		...product,
		name: name.trim()
	} : product) })),
	deleteProduct: (id) => set((state) => ({
		products: state.products.filter((product) => product.id !== id),
		productEntries: state.productEntries.filter((entry) => entry.productId !== id)
	})),
	saveProductMonth: (platformId, month, lines) => set((state) => {
		const ids = new Set(state.products.filter((product) => product.platformId === platformId).map((product) => product.id));
		const kept = state.productEntries.filter((entry) => entry.month !== month || !ids.has(entry.productId));
		let contributed = 0;
		let endValue = 0;
		const nextLines = lines.filter((line) => ids.has(line.productId)).map((line) => {
			contributed = cents(contributed + line.contributed);
			endValue = cents(endValue + line.endValue);
			return {
				id: state.productEntries.find((entry) => entry.productId === line.productId && entry.month === month)?.id ?? newId(),
				productId: line.productId,
				month,
				contributed: cents(line.contributed),
				endValue: cents(line.endValue)
			};
		});
		const entryIndex = state.entries.findIndex((entry) => entry.platformId === platformId && entry.month === month);
		const entries = state.entries.slice();
		if (entryIndex >= 0) entries[entryIndex] = {
			...entries[entryIndex],
			contributed,
			endValue
		};
		else entries.push({
			id: newId(),
			platformId,
			month,
			contributed,
			endValue
		});
		return {
			productEntries: [...kept, ...nextLines],
			entries
		};
	}),
	addExpenseType: (name) => {
		const id = newId();
		set((state) => ({ expenseTypes: [...state.expenseTypes, {
			id,
			name: name.trim()
		}] }));
		return id;
	},
	renameExpenseType: (id, name) => set((state) => ({ expenseTypes: state.expenseTypes.map((type) => type.id === id ? {
		...type,
		name: name.trim()
	} : type) })),
	deleteExpenseType: (id) => set((state) => ({
		expenseTypes: state.expenseTypes.filter((type) => type.id !== id),
		expenses: state.expenses.filter((entry) => entry.typeId !== id)
	})),
	upsertExpense: (input) => set((state) => {
		const index = state.expenses.findIndex((entry) => entry.typeId === input.typeId && entry.month === input.month);
		const amount = cents(input.amount);
		if (index >= 0) {
			const expenses = state.expenses.slice();
			expenses[index] = {
				...expenses[index],
				amount
			};
			return { expenses };
		}
		return { expenses: [...state.expenses, {
			id: newId(),
			typeId: input.typeId,
			month: input.month,
			amount
		}] };
	}),
	addCashbackCard: (name) => {
		const id = newId();
		set((state) => ({ cashbackCards: [...state.cashbackCards, {
			id,
			name: name.trim()
		}] }));
		return id;
	},
	renameCashbackCard: (id, name) => set((state) => ({ cashbackCards: state.cashbackCards.map((card) => card.id === id ? {
		...card,
		name: name.trim()
	} : card) })),
	deleteCashbackCard: (id) => set((state) => ({
		cashbackCards: state.cashbackCards.filter((card) => card.id !== id),
		cashbacks: state.cashbacks.filter((entry) => entry.cardId !== id)
	})),
	upsertCashback: (input) => set((state) => {
		const index = state.cashbacks.findIndex((entry) => entry.cardId === input.cardId && entry.month === input.month);
		const amount = cents(input.amount);
		if (index >= 0) {
			const cashbacks = state.cashbacks.slice();
			cashbacks[index] = {
				...cashbacks[index],
				amount
			};
			return { cashbacks };
		}
		return { cashbacks: [...state.cashbacks, {
			id: newId(),
			cardId: input.cardId,
			month: input.month,
			amount
		}] };
	}),
	addIncomeSource: (name, kind) => {
		const id = newId();
		set((state) => ({ incomeSources: [...state.incomeSources, {
			id,
			name: name.trim(),
			kind
		}] }));
		return id;
	},
	renameIncomeSource: (id, name) => set((state) => ({ incomeSources: state.incomeSources.map((source) => source.id === id ? {
		...source,
		name: name.trim()
	} : source) })),
	setIncomeKind: (id, kind) => set((state) => ({ incomeSources: state.incomeSources.map((source) => source.id === id ? {
		...source,
		kind
	} : source) })),
	deleteIncomeSource: (id) => set((state) => ({
		incomeSources: state.incomeSources.filter((source) => source.id !== id),
		incomes: state.incomes.filter((entry) => entry.sourceId !== id)
	})),
	upsertIncome: (input) => set((state) => {
		const index = state.incomes.findIndex((entry) => entry.sourceId === input.sourceId && entry.month === input.month);
		const amount = cents(input.amount);
		if (index >= 0) {
			const incomes = state.incomes.slice();
			incomes[index] = {
				...incomes[index],
				amount
			};
			return { incomes };
		}
		return { incomes: [...state.incomes, {
			id: newId(),
			sourceId: input.sourceId,
			month: input.month,
			amount
		}] };
	}),
	loadDemo: () => set({
		...demoLedger(),
		ready: true,
		deviceDemo: false,
		conflictAt: null,
		pendingSync: null
	}),
	keepDemo: () => set({ demo: false }),
	reset: () => set({
		...empty,
		ready: true,
		conflictAt: null,
		pendingSync: null,
		deviceDemo: false,
		savedAt: null
	}),
	importData: (raw) => {
		const parsed = parseBackup(raw);
		if (typeof parsed === "string") return parsed;
		set({
			...parsed,
			ready: true,
			deviceDemo: false,
			conflictAt: null,
			pendingSync: null
		});
		return null;
	},
	prepareAccount: () => set({
		...empty,
		ready: false,
		saving: false,
		syncError: null,
		savedAt: null,
		conflictAt: null,
		pendingSync: null,
		deviceDemo: false
	}),
	adopt: (data) => set({
		...data ?? empty,
		ready: true,
		saving: false,
		syncError: null,
		conflictAt: null,
		pendingSync: null
	}),
	failLoad: (message) => set({
		...empty,
		ready: false,
		saving: false,
		syncError: message,
		savedAt: null,
		conflictAt: null,
		pendingSync: null,
		deviceDemo: false
	}),
	retryLoad: () => set((state) => ({
		loadAttempt: state.loadAttempt + 1,
		syncError: null,
		ready: false
	})),
	dismissDeviceDemo: () => set({ deviceDemo: false }),
	overwriteRemote: () => set({ pendingSync: "overwrite" }),
	takeRemote: () => set({ pendingSync: "reload" }),
	setRemote: (remote) => set({ remote })
}));
function selectData(state) {
	return {
		platforms: state.platforms,
		entries: state.entries,
		products: state.products,
		productEntries: state.productEntries,
		expenseTypes: state.expenseTypes,
		expenses: state.expenses,
		cashbackCards: state.cashbackCards,
		cashbacks: state.cashbacks,
		incomeSources: state.incomeSources,
		incomes: state.incomes,
		currency: state.currency,
		monthlyGoal: state.monthlyGoal,
		fireGoal: state.fireGoal,
		closingDay: state.closingDay,
		demo: state.demo
	};
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var ICONS = {
	corretora: ChartLine,
	banco: Landmark,
	cripto: Bitcoin,
	ppr: PiggyBank,
	poupanca: Wallet,
	outro: Shapes
};
function KindMark({ kind }) {
	const Icon = ICONS[kind];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "grid h-11 w-11 shrink-0 place-items-center rounded-md bg-forest-soft text-forest",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
			className: "size-5",
			"aria-hidden": "true"
		})
	});
}
function Button({ variant = "primary", className, type = "button", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		className: cn("inline-flex h-12 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-colors duration-200", "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest", "disabled:cursor-not-allowed disabled:opacity-40", variant === "primary" && "bg-forest text-card hover:bg-ink", variant === "soft" && "bg-chip text-ink hover:bg-paper-2", variant === "ghost" && "bg-transparent text-ink hover:bg-chip", variant === "danger" && "bg-loss text-card hover:bg-ink", className),
		...props
	});
}
function inputClassName() {
	return "h-12 w-full rounded-md border border-line bg-paper px-3 text-base text-ink outline-none focus-visible:border-forest";
}
function Field({ label, hint, error, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mb-1.5 block text-sm font-medium",
				children: label
			}),
			children,
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1.5 block text-sm text-loss",
				children: error
			}) : hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1.5 block text-sm text-muted",
				children: hint
			}) : null
		]
	});
}
function SignedMoney({ value, currency, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("tabular-nums", value > 0 && "text-forest", value < 0 && "text-loss", value === 0 && "text-ink", className),
		children: formatMoney(value, currency, { sign: true })
	});
}
function MonthSwitcher({ month, onChange }) {
	const min = "2000-01";
	const max = shiftMonth(currentMonth(), 1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Mês anterior",
				disabled: month <= min,
				onClick: () => onChange(shiftMonth(month, -1)),
				className: "grid h-12 w-12 place-items-center rounded-md border border-line bg-card text-ink disabled:opacity-40",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "relative min-w-0 flex-1 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-serif text-xl",
					children: formatMonth(month)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "month",
					"aria-label": "Escolher mês",
					min,
					max,
					value: month,
					onChange: (event) => {
						if (event.target.value) onChange(event.target.value);
					},
					className: "absolute inset-0 cursor-pointer opacity-0"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Mês seguinte",
				disabled: month >= max,
				onClick: () => onChange(shiftMonth(month, 1)),
				className: "grid h-12 w-12 place-items-center rounded-md border border-line bg-card text-ink disabled:opacity-40",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-5" })
			})
		]
	});
}
function CompareBars({ invested, value, currency }) {
	const max = Math.max(invested, value, 0);
	if (max <= 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-6 space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar$1, {
			label: "Investido",
			amount: invested,
			max,
			currency,
			tone: "brass"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar$1, {
			label: "Valor",
			amount: value,
			max,
			currency,
			tone: value < invested ? "loss" : "forest"
		})]
	});
}
function Bar$1({ label, amount, max, currency, tone }) {
	const width = max === 0 ? 0 : Math.min(100, Math.max(amount, 0) / max * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-1 flex items-baseline justify-between gap-3 text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "tabular-nums font-medium",
			children: formatMoney(amount, currency)
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-2 overflow-hidden rounded-full bg-chip",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("h-full rounded-full", tone === "forest" && "bg-forest", tone === "brass" && "bg-brass", tone === "loss" && "bg-loss"),
			style: { width: `${width}%` }
		})
	})] });
}
function GoalMeter({ contributed, goal, currency, recorded }) {
	if (goal == null || goal <= 0) return null;
	const width = Math.max(0, Math.min(100, Math.max(contributed, 0) / goal * 100));
	const line = goalLine(contributed, goal, currency, recorded);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-1 flex items-baseline justify-between gap-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Meta de aporte" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-medium tabular-nums",
					children: [
						formatMoney(Math.max(contributed, 0), currency),
						" / ",
						formatMoney(goal, currency)
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-2 overflow-hidden rounded-full bg-chip",
				role: "progressbar",
				"aria-valuemin": 0,
				"aria-valuemax": 100,
				"aria-valuenow": Math.round(width),
				"aria-label": "Progresso da meta de aporte",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full rounded-full bg-forest",
					style: { width: `${width}%` }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: line
			})
		]
	});
}
function goalLine(contributed, goal, currency, recorded) {
	if (!recorded) return `A meta deste mês é ${formatMoney(goal, currency)}. Ainda não há aportes registados.`;
	if (contributed < 0) return `Saíram ${formatMoney(Math.abs(contributed), currency)}. A meta de aporte é ${formatMoney(goal, currency)}.`;
	if (contributed >= goal) return `Meta cumprida. Entraram ${formatMoney(contributed, currency)}.`;
	return `Entraram ${formatMoney(contributed, currency)} de ${formatMoney(goal, currency)}.`;
}
function ShareList({ title, slices, currency }) {
	if (slices.length === 0) return null;
	const max = slices[0]?.value ?? 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
		className: "mb-3 font-serif text-xl",
		children: title
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "space-y-3",
		children: slices.map((slice) => {
			const width = max <= 0 ? 0 : Math.min(100, slice.value / max * 100);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-1 flex items-baseline justify-between gap-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "min-w-0 truncate",
					children: slice.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "shrink-0 tabular-nums",
					children: [formatShare(slice.share), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted",
						children: [" · ", formatMoney(slice.value, currency)]
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-2 overflow-hidden rounded-full bg-chip",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full rounded-full bg-forest",
					style: { width: `${width}%` }
				})
			})] }, slice.id);
		})
	})] });
}
function useReducedMotion() {
	const [reduced, setReduced] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const query = window.matchMedia("(prefers-reduced-motion: reduce)");
		const apply = () => setReduced(query.matches);
		apply();
		query.addEventListener("change", apply);
		return () => query.removeEventListener("change", apply);
	}, []);
	return reduced;
}
function ValueChart({ points, currency }) {
	const reduced = useReducedMotion();
	const [span, setSpan] = (0, import_react.useState)("all");
	const data = (span === "12" ? points.slice(-12) : points).map((point) => ({
		...point,
		label: formatMonth(point.month, "short")
	}));
	if (points.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-lg border border-line bg-card p-4 sm:p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl",
					children: "Evolução"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Valor da carteira contra o que foste metendo."
				})] }), points.length > 12 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-1 rounded-md bg-paper-2 p-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpanButton, {
						active: span === "12",
						onClick: () => setSpan("12"),
						children: "12 meses"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpanButton, {
						active: span === "all",
						onClick: () => setSpan("all"),
						children: "Tudo"
					})]
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-64",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ComposedChart, {
						data,
						margin: {
							top: 8,
							right: 4,
							left: 0,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "var(--color-line)",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "label",
								minTickGap: 28,
								tick: {
									fill: "var(--color-muted)",
									fontSize: 12
								},
								axisLine: false,
								tickLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								width: 48,
								tickFormatter: (value) => formatCompact(value),
								tick: {
									fill: "var(--color-muted)",
									fontSize: 12
								},
								axisLine: false,
								tickLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: ({ active, payload }) => {
								const point = payload?.[0]?.payload;
								if (!active || !point) return null;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-md border border-line bg-card px-3 py-2 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-medium",
											children: formatMonth(point.month)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-1 tabular-nums",
											children: ["Valor ", formatMoney(point.value, currency)]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "tabular-nums",
											children: ["Investido ", formatMoney(point.invested, currency)]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "tabular-nums",
											children: ["Aporte ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedMoney, {
												value: point.contributed,
												currency
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "tabular-nums",
											children: ["Mercado ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedMoney, {
												value: point.market,
												currency
											})]
										})
									]
								});
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
								type: "monotone",
								dataKey: "value",
								stroke: "var(--color-forest)",
								fill: "var(--color-forest)",
								fillOpacity: .14,
								strokeWidth: 2,
								isAnimationActive: !reduced,
								dot: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "invested",
								stroke: "var(--color-brass)",
								strokeWidth: 2,
								dot: false,
								isAnimationActive: !reduced
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap gap-4 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
					swatch: "bg-forest",
					label: "Valor"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
					swatch: "bg-brass",
					label: "Investido"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketBars, {
				points: data,
				currency,
				reduced
			}),
			points.some((point) => point.recorded === 0) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: "Meses sem atualização repetem o último valor conhecido de cada plataforma."
			}) : null
		]
	});
}
function MarketBars({ points, currency, reduced }) {
	const data = points.filter((point) => point.recorded > 0);
	if (data.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-serif text-xl",
				children: "Mercado"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Verde quando o mês subiu. Vermelho quando desceu."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 h-40",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data,
						margin: {
							top: 8,
							right: 4,
							left: 0,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "var(--color-line)",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "label",
								minTickGap: 28,
								tick: {
									fill: "var(--color-muted)",
									fontSize: 12
								},
								axisLine: false,
								tickLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								width: 48,
								tickFormatter: (value) => formatCompact(value),
								tick: {
									fill: "var(--color-muted)",
									fontSize: 12
								},
								axisLine: false,
								tickLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceLine, {
								y: 0,
								stroke: "var(--color-muted)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: ({ active, payload }) => {
								const point = payload?.[0]?.payload;
								if (!active || !point) return null;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-md border border-line bg-card px-3 py-2 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: formatMonth(point.month)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1",
										children: ["Mercado ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedMoney, {
											value: point.market,
											currency
										})]
									})]
								});
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "market",
								isAnimationActive: !reduced,
								maxBarSize: 18,
								radius: 4,
								children: data.map((point) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: point.market < 0 ? "var(--color-loss)" : "var(--color-forest)" }, point.month))
							})
						]
					})
				})
			})
		]
	});
}
function SpanButton({ active, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: active ? "h-10 rounded-md bg-card px-3 text-sm font-medium text-ink" : "h-10 rounded-md px-3 text-sm text-muted",
		children
	});
}
function Legend({ swatch, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-2 w-6 rounded-full ${swatch}` }), label]
	});
}
var SERIES = [
	{
		fill: "var(--color-forest)",
		swatch: "bg-forest"
	},
	{
		fill: "var(--color-brass)",
		swatch: "bg-brass"
	},
	{
		fill: "var(--color-ink)",
		swatch: "bg-ink"
	},
	{
		fill: "var(--color-muted)",
		swatch: "bg-muted"
	},
	{
		fill: "var(--color-loss)",
		swatch: "bg-loss"
	}
];
function ExpenseChart({ series, types, currency }) {
	const reduced = useReducedMotion();
	const visible = series.filter((point) => point.total > 0);
	if (visible.length === 0 || types.length === 0) return null;
	const data = visible.map((point) => ({
		...point.byType,
		month: point.month,
		label: formatMonth(point.month, "short"),
		total: point.total
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-lg border border-line bg-card p-4 sm:p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-2xl",
				children: "Despesas"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "O que saiu, mês a mês, por tipo."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 h-64",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data,
						margin: {
							top: 8,
							right: 4,
							left: 0,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "var(--color-line)",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "label",
								minTickGap: 28,
								tick: {
									fill: "var(--color-muted)",
									fontSize: 12
								},
								axisLine: false,
								tickLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								width: 48,
								tickFormatter: (value) => formatCompact(value),
								tick: {
									fill: "var(--color-muted)",
									fontSize: 12
								},
								axisLine: false,
								tickLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: ({ active, payload }) => {
								const point = payload?.[0]?.payload;
								if (!active || !point) return null;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-md border border-line bg-card px-3 py-2 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-medium",
											children: formatMonth(point.month)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-1 tabular-nums",
											children: ["Total ", formatMoney(point.total, currency)]
										}),
										types.map((type) => {
											const amount = point[type.id];
											if (typeof amount !== "number" || amount === 0) return null;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "tabular-nums",
												children: [
													type.name,
													" ",
													formatMoney(amount, currency)
												]
											}, type.id);
										})
									]
								});
							} }),
							types.map((type, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: type.id,
								stackId: "despesas",
								fill: SERIES[index % SERIES.length].fill,
								isAnimationActive: !reduced,
								maxBarSize: 28
							}, type.id))
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm",
				children: types.map((type, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
					swatch: SERIES[index % SERIES.length].swatch,
					label: type.name
				}, type.id))
			})
		]
	});
}
function CashbackMonthChart({ rows, currency, title }) {
	const reduced = useReducedMotion();
	const visible = [...rows].filter((row) => row.amount > 0).sort((a, b) => b.amount - a.amount);
	if (visible.length === 0) return null;
	const best = visible[0].amount;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-lg border border-line bg-card p-4 sm:p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-2xl",
				children: "Qual deu mais"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				style: { height: Math.max(160, visible.length * 48) },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: visible,
						layout: "vertical",
						margin: {
							top: 4,
							right: 8,
							left: 0,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "var(--color-line)",
								horizontal: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								type: "number",
								tickFormatter: (value) => formatCompact(value),
								tick: {
									fill: "var(--color-muted)",
									fontSize: 12
								},
								axisLine: false,
								tickLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								type: "category",
								dataKey: "name",
								width: 88,
								tick: {
									fill: "var(--color-ink)",
									fontSize: 12
								},
								axisLine: false,
								tickLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: ({ active, payload }) => {
								const point = payload?.[0]?.payload;
								if (!active || !point) return null;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-md border border-line bg-card px-3 py-2 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: point.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 tabular-nums",
										children: formatMoney(point.amount, currency)
									})]
								});
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "amount",
								isAnimationActive: !reduced,
								maxBarSize: 22,
								radius: 4,
								children: visible.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: row.amount === best ? "var(--color-forest)" : "var(--color-brass)" }, row.id))
							})
						]
					})
				})
			})
		]
	});
}
function CashbackHistory({ series, cards, currency }) {
	const reduced = useReducedMotion();
	const visible = series.filter((point) => point.total > 0);
	if (visible.length < 2 || cards.length === 0) return null;
	const data = visible.map((point) => {
		const row = {
			month: point.month,
			label: formatMonth(point.month, "short"),
			total: point.total
		};
		for (const item of point.rows) row[item.id] = item.amount;
		return row;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-lg border border-line bg-card p-4 sm:p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-2xl",
				children: "Mês a mês"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Cada barra é um cartão, lado a lado."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 h-64",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data,
						margin: {
							top: 8,
							right: 4,
							left: 0,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "var(--color-line)",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "label",
								minTickGap: 28,
								tick: {
									fill: "var(--color-muted)",
									fontSize: 12
								},
								axisLine: false,
								tickLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								width: 48,
								tickFormatter: (value) => formatCompact(value),
								tick: {
									fill: "var(--color-muted)",
									fontSize: 12
								},
								axisLine: false,
								tickLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: ({ active, payload }) => {
								const point = payload?.[0]?.payload;
								if (!active || !point) return null;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-md border border-line bg-card px-3 py-2 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-medium",
											children: formatMonth(point.month)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-1 tabular-nums",
											children: ["Total ", formatMoney(point.total, currency)]
										}),
										cards.map((card) => {
											const amount = point[card.id];
											if (typeof amount !== "number" || amount === 0) return null;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "tabular-nums",
												children: [
													card.name,
													" ",
													formatMoney(amount, currency)
												]
											}, card.id);
										})
									]
								});
							} }),
							cards.map((card, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: card.id,
								fill: SERIES[index % SERIES.length].fill,
								isAnimationActive: !reduced,
								maxBarSize: 16
							}, card.id))
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm",
				children: cards.map((card, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
					swatch: SERIES[index % SERIES.length].swatch,
					label: card.name
				}, card.id))
			})
		]
	});
}
function SavingsChart({ series, currency }) {
	const reduced = useReducedMotion();
	const visible = series.filter((point) => point.earned > 0 || point.invested > 0);
	if (visible.length === 0) return null;
	const data = visible.map((point) => ({
		...point,
		label: formatMonth(point.month, "short")
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-lg border border-line bg-card p-4 sm:p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-2xl",
				children: "Ganho e investido"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "O que entrou no mês contra o que foi para investir."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 h-64",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data,
						margin: {
							top: 8,
							right: 4,
							left: 0,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "var(--color-line)",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "label",
								minTickGap: 28,
								tick: {
									fill: "var(--color-muted)",
									fontSize: 12
								},
								axisLine: false,
								tickLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								width: 48,
								tickFormatter: (value) => formatCompact(value),
								tick: {
									fill: "var(--color-muted)",
									fontSize: 12
								},
								axisLine: false,
								tickLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: ({ active, payload }) => {
								const point = payload?.[0]?.payload;
								if (!active || !point) return null;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-md border border-line bg-card px-3 py-2 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-medium",
											children: formatMonth(point.month)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-1 tabular-nums",
											children: ["Ganho ", formatMoney(point.earned, currency)]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "tabular-nums",
											children: ["Investido ", formatMoney(point.invested, currency)]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "tabular-nums",
											children: ["Poupança ", point.rate == null ? "—" : formatShare(point.rate)]
										})
									]
								});
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "earned",
								fill: "var(--color-forest)",
								isAnimationActive: !reduced,
								maxBarSize: 18,
								radius: 4
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "invested",
								fill: "var(--color-brass)",
								isAnimationActive: !reduced,
								maxBarSize: 18,
								radius: 4
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
					swatch: "bg-forest",
					label: "Ganho"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
					swatch: "bg-brass",
					label: "Investido"
				})]
			})
		]
	});
}
var YEAR_COLORS = [
	{
		stroke: "var(--color-forest)",
		swatch: "bg-forest"
	},
	{
		stroke: "var(--color-brass)",
		swatch: "bg-brass"
	},
	{
		stroke: "var(--color-ink)",
		swatch: "bg-ink"
	},
	{
		stroke: "var(--color-muted)",
		swatch: "bg-muted"
	}
];
function YearCompareChart({ currency, metrics }) {
	const reduced = useReducedMotion();
	const available = metrics.filter((metric) => metric.points.length > 0);
	const [metricId, setMetricId] = (0, import_react.useState)(available[0]?.id ?? "");
	const selected = available.find((metric) => metric.id === metricId) ?? available[0];
	if (!selected) return null;
	const compared = compareByYear(selected.points);
	if (compared.years.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-lg border border-line bg-card p-4 sm:p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-2xl",
				children: "Entre anos"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: selected.signed ? "O mesmo mês, lado a lado. Vermelho é uma saída." : compared.years.length < 2 ? "O mesmo mês, em cada ano. A segunda linha aparece quando houver outro ano." : "O mesmo mês, lado a lado, em cada ano."
			}),
			available.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid grid-cols-2 gap-1 rounded-md bg-paper-2 p-1 sm:grid-cols-4",
				children: available.map((metric) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpanButton, {
					active: metric.id === selected.id,
					onClick: () => setMetricId(metric.id),
					children: metric.label
				}, metric.id))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 h-64",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ComposedChart, {
						data: compared.rows,
						margin: {
							top: 8,
							right: 4,
							left: 0,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "var(--color-line)",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "label",
								minTickGap: 16,
								tick: {
									fill: "var(--color-muted)",
									fontSize: 12
								},
								axisLine: false,
								tickLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								width: 48,
								tickFormatter: (value) => formatCompact(value),
								tick: {
									fill: "var(--color-muted)",
									fontSize: 12
								},
								axisLine: false,
								tickLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: ({ active, payload, label }) => {
								if (!active || !payload?.length) return null;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-md border border-line bg-card px-3 py-2 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: label
									}), payload.map((item) => {
										const amount = typeof item.value === "number" ? item.value : null;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-1",
											children: [
												item.dataKey,
												" ",
												amount == null ? "—" : selected.signed || amount < 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedMoney, {
													value: amount,
													currency
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "tabular-nums",
													children: formatMoney(amount, currency)
												})
											]
										}, String(item.dataKey));
									})]
								});
							} }),
							compared.years.map((year, index) => {
								const color = YEAR_COLORS[index % YEAR_COLORS.length].stroke;
								if (!selected.signed) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									type: "monotone",
									dataKey: year,
									name: year,
									stroke: color,
									strokeWidth: 2,
									dot: false,
									connectNulls: false,
									isAnimationActive: !reduced
								}, year);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: year,
									name: year,
									maxBarSize: 16,
									radius: 3,
									isAnimationActive: !reduced,
									children: compared.rows.map((row) => {
										const amount = row[year];
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: typeof amount === "number" && amount < 0 ? "var(--color-loss)" : color }, `${year}-${row.label}`);
									})
								}, year);
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm",
				children: compared.years.map((year, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
					swatch: YEAR_COLORS[index % YEAR_COLORS.length].swatch,
					label: year
				}, year))
			})
		]
	});
}
function CashbackPanel({ month, onMonth, onSetup, embedded = false }) {
	const cards = useLedger((state) => state.cashbackCards);
	const cashbacks = useLedger((state) => state.cashbacks);
	const currency = useLedger((state) => state.currency);
	const upsertCashback = useLedger((state) => state.upsertCashback);
	const [drafts, setDrafts] = (0, import_react.useState)({});
	const [errors, setErrors] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		const next = {};
		for (const card of useLedger.getState().cashbackCards) {
			const saved = cashbackFor(useLedger.getState().cashbacks, card.id, month);
			next[card.id] = saved ? formatPlain(saved.amount) : "";
		}
		setDrafts(next);
		setErrors({});
	}, [month]);
	(0, import_react.useEffect)(() => {
		setDrafts((current) => {
			let changed = false;
			const next = { ...current };
			for (const card of cards) if (next[card.id] == null) {
				const saved = cashbackFor(cashbacks, card.id, month);
				next[card.id] = saved ? formatPlain(saved.amount) : "";
				changed = true;
			}
			return changed ? next : current;
		});
	}, [
		cards,
		cashbacks,
		month
	]);
	const rows = cashbackRows(cards, cashbacks, month);
	const series = cashbackSeries(cards, cashbacks);
	const total = cashbackTotal(cashbacks, month);
	const recorded = cards.filter((card) => cashbackFor(cashbacks, card.id, month)).length;
	const dirtyCount = cards.filter((card) => {
		const draft = drafts[card.id] ?? "";
		const saved = cashbackFor(cashbacks, card.id, month);
		const parsed = parseAmount(draft);
		return saved ? parsed !== saved.amount : draft.trim() !== "";
	}).length;
	const canCopy = cards.some((card) => {
		if ((drafts[card.id] ?? "").trim() !== "") return false;
		return latestBefore(cashbacks.filter((entry) => entry.cardId === card.id), month);
	});
	function copyPrevious() {
		setDrafts((current) => {
			const next = { ...current };
			for (const card of cards) {
				if ((next[card.id] ?? "").trim() !== "") continue;
				const earlier = latestBefore(cashbacks.filter((entry) => entry.cardId === card.id), month);
				if (earlier) next[card.id] = formatPlain(earlier.amount);
			}
			return next;
		});
	}
	function saveAll() {
		const updates = {};
		const nextErrors = {};
		for (const card of cards) {
			const draft = drafts[card.id] ?? "";
			const saved = cashbackFor(cashbacks, card.id, month);
			const parsed = parseAmount(draft);
			if (!(saved ? parsed !== saved.amount : draft.trim() !== "")) continue;
			if (draft.trim() === "" || parsed == null || parsed < 0) {
				nextErrors[card.id] = "Indica o cashback. Se não houve, escreve 0.";
				continue;
			}
			upsertCashback({
				cardId: card.id,
				month,
				amount: parsed
			});
			updates[card.id] = formatPlain(parsed);
			nextErrors[card.id] = "";
		}
		setDrafts((current) => ({
			...current,
			...updates
		}));
		setErrors((current) => ({
			...current,
			...nextErrors
		}));
	}
	const leaders = rows.filter((row) => row.amount > 0 && row.amount === rows[0]?.amount);
	const fallback = [...series].reverse().find((point) => point.total > 0);
	const chartRows = leaders.length > 0 ? rows : fallback?.rows ?? [];
	const chartTitle = leaders.length > 0 ? leaders.length === 1 ? `${leaders[0].name} deu mais em ${formatMonth(month).toLowerCase()}.` : `${leaders.map((row) => row.name).join(" e ")} empataram em ${formatMonth(month).toLowerCase()}.` : fallback ? `Neste mês ainda não há cashback. O último foi ${formatMonth(fallback.month).toLowerCase()}.` : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-line bg-card p-4 sm:p-5",
				children: [
					embedded ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthSwitcher, {
						month,
						onChange: onMonth
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: embedded ? "text-sm text-muted" : "mt-3 text-sm text-muted",
						children: cards.length === 0 ? "Ainda sem cartões." : leaders.length > 0 ? `${recorded} de ${cards.length} cartões. Total ${formatMoney(total, currency)}.` : "Ainda sem cashback neste mês."
					}),
					cards.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-4",
						variant: "soft",
						onClick: onSetup,
						children: "Criar nas contas"
					}) : dirtyCount >= 2 || canCopy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [dirtyCount >= 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: saveAll,
							children: "Guardar este mês"
						}) : null, canCopy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "soft",
							onClick: copyPrevious,
							children: "Trazer o mês anterior"
						}) : null]
					}) : null
				]
			}),
			cards.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-3",
				children: cards.map((card) => {
					const draft = drafts[card.id] ?? "";
					const saved = cashbackFor(cashbacks, card.id, month);
					const parsed = parseAmount(draft);
					const dirty = saved ? parsed !== saved.amount : draft.trim() !== "";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-lg border border-line bg-card p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: card.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: saved && !dirty ? "Registado" : dirty ? "Por guardar" : "Por registar"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mt-3 block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-1.5 block text-sm font-medium",
									children: "Cashback do mês"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									inputMode: "decimal",
									value: draft,
									placeholder: "0,00",
									onChange: (event) => setDrafts((current) => ({
										...current,
										[card.id]: event.target.value
									})),
									className: "h-12 w-full rounded-md border border-line bg-paper px-3 text-base tabular-nums text-ink outline-none focus-visible:border-forest"
								})]
							}),
							errors[card.id] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-loss",
								children: errors[card.id]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 flex flex-wrap gap-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									disabled: !dirty,
									onClick: () => {
										if (draft.trim() === "" || parsed == null || parsed < 0) {
											setErrors((current) => ({
												...current,
												[card.id]: "Indica o cashback. Se não houve, escreve 0."
											}));
											return;
										}
										upsertCashback({
											cardId: card.id,
											month,
											amount: parsed
										});
										setDrafts((current) => ({
											...current,
											[card.id]: formatPlain(parsed)
										}));
										setErrors((current) => ({
											...current,
											[card.id]: ""
										}));
									},
									children: saved ? "Atualizar" : "Guardar"
								})
							})
						]
					}, card.id);
				})
			}) : null,
			embedded || !chartRows.some((row) => row.amount > 0) ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CashbackMonthChart, {
				rows: chartRows,
				currency,
				title: chartTitle
			}),
			embedded ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CashbackHistory, {
				series,
				cards,
				currency
			})
		]
	});
}
function ExpensesPanel({ month, onMonth, onSetup, embedded = false }) {
	const types = useLedger((state) => state.expenseTypes);
	const expenses = useLedger((state) => state.expenses);
	const currency = useLedger((state) => state.currency);
	const upsertExpense = useLedger((state) => state.upsertExpense);
	const [drafts, setDrafts] = (0, import_react.useState)({});
	const [errors, setErrors] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		const next = {};
		for (const type of useLedger.getState().expenseTypes) {
			const saved = expenseFor(useLedger.getState().expenses, type.id, month);
			next[type.id] = saved ? formatPlain(saved.amount) : "";
		}
		setDrafts(next);
		setErrors({});
	}, [month]);
	(0, import_react.useEffect)(() => {
		setDrafts((current) => {
			let changed = false;
			const next = { ...current };
			for (const type of types) if (next[type.id] == null) {
				const saved = expenseFor(expenses, type.id, month);
				next[type.id] = saved ? formatPlain(saved.amount) : "";
				changed = true;
			}
			return changed ? next : current;
		});
	}, [
		types,
		expenses,
		month
	]);
	const series = expenseSeries(types, expenses);
	const monthTotal = expenseTotal(expenses, month);
	const recorded = types.filter((type) => expenseFor(expenses, type.id, month)).length;
	const dirtyCount = types.filter((type) => {
		const draft = drafts[type.id] ?? "";
		const saved = expenseFor(expenses, type.id, month);
		const parsed = parseAmount(draft);
		return saved ? parsed !== saved.amount : draft.trim() !== "";
	}).length;
	const canCopy = types.some((type) => {
		if ((drafts[type.id] ?? "").trim() !== "") return false;
		return latestBefore(expenses.filter((entry) => entry.typeId === type.id), month);
	});
	function copyPrevious() {
		setDrafts((current) => {
			const next = { ...current };
			for (const type of types) {
				if ((next[type.id] ?? "").trim() !== "") continue;
				const earlier = latestBefore(expenses.filter((entry) => entry.typeId === type.id), month);
				if (earlier) next[type.id] = formatPlain(earlier.amount);
			}
			return next;
		});
	}
	function saveAll() {
		const updates = {};
		const nextErrors = {};
		for (const type of types) {
			const draft = drafts[type.id] ?? "";
			const saved = expenseFor(expenses, type.id, month);
			const parsed = parseAmount(draft);
			if (!(saved ? parsed !== saved.amount : draft.trim() !== "")) continue;
			if (draft.trim() === "" || parsed == null || parsed < 0) {
				nextErrors[type.id] = "Indica o valor. Se não gastaste, escreve 0.";
				continue;
			}
			upsertExpense({
				typeId: type.id,
				month,
				amount: parsed
			});
			updates[type.id] = formatPlain(parsed);
			nextErrors[type.id] = "";
		}
		setDrafts((current) => ({
			...current,
			...updates
		}));
		setErrors((current) => ({
			...current,
			...nextErrors
		}));
	}
	const shares = types.map((type) => ({
		id: type.id,
		label: type.name,
		value: expenseFor(expenses, type.id, month)?.amount ?? 0
	})).filter((slice) => slice.value > 0).sort((a, b) => b.value - a.value);
	const shareTotal = shares.reduce((sum, slice) => sum + slice.value, 0);
	const shareRows = shareTotal > 0 ? shares.map((slice) => ({
		...slice,
		share: slice.value / shareTotal
	})) : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-line bg-card p-4 sm:p-5",
				children: [
					embedded ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthSwitcher, {
						month,
						onChange: onMonth
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: embedded ? "text-sm text-muted" : "mt-3 text-sm text-muted",
						children: types.length === 0 ? "Ainda sem tipos de despesa." : `${recorded} de ${types.length} tipos neste mês. Total ${formatMoney(monthTotal, currency)}.`
					}),
					types.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-4",
						variant: "soft",
						onClick: onSetup,
						children: "Criar nas contas"
					}) : dirtyCount >= 2 || canCopy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [dirtyCount >= 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: saveAll,
							children: "Guardar este mês"
						}) : null, canCopy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "soft",
							onClick: copyPrevious,
							children: "Trazer o mês anterior"
						}) : null]
					}) : null
				]
			}),
			types.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-3",
				children: types.map((type) => {
					const draft = drafts[type.id] ?? "";
					const saved = expenseFor(expenses, type.id, month);
					const parsed = parseAmount(draft);
					const dirty = saved ? parsed !== saved.amount : draft.trim() !== "";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-lg border border-line bg-card p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: type.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: saved && !dirty ? "Registado" : dirty ? "Por guardar" : "Por registar"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mt-3 block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-1.5 block text-sm font-medium",
									children: "Quanto saiu"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									inputMode: "decimal",
									value: draft,
									placeholder: "0,00",
									onChange: (event) => setDrafts((current) => ({
										...current,
										[type.id]: event.target.value
									})),
									className: "h-12 w-full rounded-md border border-line bg-paper px-3 text-base tabular-nums text-ink outline-none focus-visible:border-forest"
								})]
							}),
							errors[type.id] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-loss",
								children: errors[type.id]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 flex flex-wrap gap-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									disabled: !dirty,
									onClick: () => {
										if (draft.trim() === "" || parsed == null || parsed < 0) {
											setErrors((current) => ({
												...current,
												[type.id]: "Indica o valor. Se não gastaste, escreve 0."
											}));
											return;
										}
										upsertExpense({
											typeId: type.id,
											month,
											amount: parsed
										});
										setDrafts((current) => ({
											...current,
											[type.id]: formatPlain(parsed)
										}));
										setErrors((current) => ({
											...current,
											[type.id]: ""
										}));
									},
									children: saved ? "Atualizar" : "Guardar"
								})
							})
						]
					}, type.id);
				})
			}) : null,
			embedded || shareRows.length < 2 ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-line bg-card p-4 sm:p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-4 font-serif text-2xl",
					children: "Este mês"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShareList, {
					title: "Por tipo",
					slices: shareRows,
					currency
				})]
			}),
			embedded ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpenseChart, {
				series,
				types,
				currency
			})
		]
	});
}
function IncomePanel({ month, onMonth, onSetup, embedded = false }) {
	const sources = useLedger((state) => state.incomeSources);
	const incomes = useLedger((state) => state.incomes);
	const entries = useLedger((state) => state.entries);
	const currency = useLedger((state) => state.currency);
	const upsertIncome = useLedger((state) => state.upsertIncome);
	const [drafts, setDrafts] = (0, import_react.useState)({});
	const [errors, setErrors] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		const next = {};
		for (const source of useLedger.getState().incomeSources) {
			const saved = incomeFor(useLedger.getState().incomes, source.id, month);
			next[source.id] = saved ? formatPlain(saved.amount) : "";
		}
		setDrafts(next);
		setErrors({});
	}, [month]);
	(0, import_react.useEffect)(() => {
		setDrafts((current) => {
			let changed = false;
			const next = { ...current };
			for (const source of sources) if (next[source.id] == null) {
				const saved = incomeFor(incomes, source.id, month);
				next[source.id] = saved ? formatPlain(saved.amount) : "";
				changed = true;
			}
			return changed ? next : current;
		});
	}, [
		sources,
		incomes,
		month
	]);
	const ordered = [...sources].sort((a, b) => {
		if (a.kind !== b.kind) return a.kind === "ordenado" ? -1 : 1;
		return a.name.localeCompare(b.name, "pt");
	});
	const earned = incomeTotal(incomes, month);
	const invested = contributedIn(entries, month);
	const rate = savingsRate(invested, earned);
	const series = savingsSeries(entries, incomes);
	const earnedAll = incomes.reduce((sum, entry) => sum + entry.amount, 0);
	const rateAll = savingsRate(entries.reduce((sum, entry) => sum + entry.contributed, 0), earnedAll);
	const recorded = sources.filter((source) => incomeFor(incomes, source.id, month)).length;
	const dirtyCount = sources.filter((source) => {
		const draft = drafts[source.id] ?? "";
		const saved = incomeFor(incomes, source.id, month);
		const parsed = parseAmount(draft);
		return saved ? parsed !== saved.amount : draft.trim() !== "";
	}).length;
	const canCopy = sources.some((source) => {
		if ((drafts[source.id] ?? "").trim() !== "") return false;
		return latestBefore(incomes.filter((entry) => entry.sourceId === source.id), month);
	});
	function copyPrevious() {
		setDrafts((current) => {
			const next = { ...current };
			for (const source of sources) {
				if ((next[source.id] ?? "").trim() !== "") continue;
				const earlier = latestBefore(incomes.filter((entry) => entry.sourceId === source.id), month);
				if (earlier) next[source.id] = formatPlain(earlier.amount);
			}
			return next;
		});
	}
	function saveAll() {
		const updates = {};
		const nextErrors = {};
		for (const source of sources) {
			const draft = drafts[source.id] ?? "";
			const saved = incomeFor(incomes, source.id, month);
			const parsed = parseAmount(draft);
			if (!(saved ? parsed !== saved.amount : draft.trim() !== "")) continue;
			if (draft.trim() === "" || parsed == null || parsed < 0) {
				nextErrors[source.id] = "Indica o valor. Se não entrou nada, escreve 0.";
				continue;
			}
			upsertIncome({
				sourceId: source.id,
				month,
				amount: parsed
			});
			updates[source.id] = formatPlain(parsed);
			nextErrors[source.id] = "";
		}
		setDrafts((current) => ({
			...current,
			...updates
		}));
		setErrors((current) => ({
			...current,
			...nextErrors
		}));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-line bg-card p-4 sm:p-5",
				children: [
					embedded ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthSwitcher, {
						month,
						onChange: onMonth
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: embedded ? "text-sm text-muted" : "mt-3 text-sm text-muted",
						children: sources.length === 0 ? "Ainda sem ordenados nem extras." : `${recorded} de ${sources.length} neste mês. Total ${formatMoney(earned, currency)}.`
					}),
					sources.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-4",
						variant: "soft",
						onClick: onSetup,
						children: "Criar nas contas"
					}) : dirtyCount >= 2 || canCopy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [dirtyCount >= 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: saveAll,
							children: "Guardar este mês"
						}) : null, canCopy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "soft",
							onClick: copyPrevious,
							children: "Trazer o mês anterior"
						}) : null]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-line bg-card p-4 sm:p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Poupança investida"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-serif text-4xl tabular-nums",
						children: rate == null ? "—" : formatShare(rate)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: earned <= 0 ? "Regista o que ganhaste para ver a percentagem." : `Ganhaste ${formatMoney(earned, currency)} e meteste ${formatMoney(invested, currency)} a investir.`
					}),
					rateAll != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted",
						children: [
							"No período registado, ",
							formatShare(rateAll),
							" de ",
							formatMoney(earnedAll, currency),
							"."
						]
					}) : null
				]
			}),
			ordered.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-3",
				children: ordered.map((source) => {
					const draft = drafts[source.id] ?? "";
					const saved = incomeFor(incomes, source.id, month);
					const parsed = parseAmount(draft);
					const dirty = saved ? parsed !== saved.amount : draft.trim() !== "";
					const label = source.kind === "ordenado" ? "Ordenado" : "Extra";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-lg border border-line bg-card p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: source.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted",
								children: [
									label,
									" · ",
									saved && !dirty ? "Registado" : dirty ? "Por guardar" : "Por registar"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mt-3 block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mb-1.5 block text-sm font-medium",
									children: "Quanto entrou"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									inputMode: "decimal",
									value: draft,
									placeholder: "0,00",
									onChange: (event) => setDrafts((current) => ({
										...current,
										[source.id]: event.target.value
									})),
									className: "h-12 w-full rounded-md border border-line bg-paper px-3 text-base tabular-nums text-ink outline-none focus-visible:border-forest"
								})]
							}),
							errors[source.id] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-loss",
								children: errors[source.id]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 flex flex-wrap gap-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									disabled: !dirty,
									onClick: () => {
										if (draft.trim() === "" || parsed == null || parsed < 0) {
											setErrors((current) => ({
												...current,
												[source.id]: "Indica o valor. Se não entrou nada, escreve 0."
											}));
											return;
										}
										upsertIncome({
											sourceId: source.id,
											month,
											amount: parsed
										});
										setDrafts((current) => ({
											...current,
											[source.id]: formatPlain(parsed)
										}));
										setErrors((current) => ({
											...current,
											[source.id]: ""
										}));
									},
									children: saved ? "Atualizar" : "Guardar"
								})
							})
						]
					}, source.id);
				})
			}) : null,
			embedded ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SavingsChart, {
				series,
				currency
			})
		]
	});
}
function draftFrom(platformId, entries, month) {
	const saved = entryFor(entries, platformId, month);
	if (!saved) return {
		contributed: "",
		endValue: ""
	};
	return {
		contributed: formatPlain(saved.contributed),
		endValue: formatPlain(saved.endValue)
	};
}
function initialDrafts(platforms, entries, month) {
	const drafts = {};
	for (const platform of platforms) drafts[platform.id] = draftFrom(platform.id, entries, month);
	return drafts;
}
function productDraftFrom(productId, entries, month) {
	const saved = productEntryFor(entries, productId, month);
	if (!saved) return {
		contributed: "",
		endValue: ""
	};
	return {
		contributed: formatPlain(saved.contributed),
		endValue: formatPlain(saved.endValue)
	};
}
function parsedDraft(draft) {
	if (draft.contributed.trim() === "" || parseAmount(draft.contributed) == null) return "Indica o aporte. Se não meteste dinheiro, escreve 0.";
	const contributed = parseAmount(draft.contributed);
	if (draft.endValue.trim() === "" || parseAmount(draft.endValue) == null) return "Indica o valor que ficou no fim do mês.";
	const endValue = parseAmount(draft.endValue);
	if (contributed == null || endValue == null) return "Indica o valor que ficou no fim do mês.";
	if (endValue < 0) return "O valor no fim do mês não pode ser negativo.";
	return {
		contributed,
		endValue
	};
}
function isDirty(draft, saved) {
	if (!saved) return draft.contributed.trim() !== "" || draft.endValue.trim() !== "";
	const contributed = parseAmount(draft.contributed);
	const endValue = parseAmount(draft.endValue);
	return contributed !== saved.contributed || endValue !== saved.endValue;
}
function MonthPanel({ month, onMonth, onSetup, embedded = false }) {
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
	const [drafts, setDrafts] = (0, import_react.useState)(() => initialDrafts(platforms, entries, month));
	const [productDrafts, setProductDrafts] = (0, import_react.useState)({});
	const [splitting, setSplitting] = (0, import_react.useState)({});
	const [productNames, setProductNames] = (0, import_react.useState)({});
	const [errors, setErrors] = (0, import_react.useState)({});
	const [confirmId, setConfirmId] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const state = useLedger.getState();
		setDrafts(initialDrafts(state.platforms, state.entries, month));
		const next = {};
		for (const product of state.products) next[product.id] = productDraftFrom(product.id, state.productEntries, month);
		setProductDrafts(next);
		setSplitting({});
		setProductNames({});
		setErrors({});
		setConfirmId(null);
	}, [month]);
	(0, import_react.useEffect)(() => {
		setDrafts((current) => {
			let changed = false;
			const next = { ...current };
			for (const platform of platforms) if (!next[platform.id]) {
				next[platform.id] = draftFrom(platform.id, entries, month);
				changed = true;
			}
			return changed ? next : current;
		});
	}, [
		platforms,
		entries,
		month
	]);
	(0, import_react.useEffect)(() => {
		setProductDrafts((current) => {
			let changed = false;
			const next = { ...current };
			for (const product of products) if (!next[product.id]) {
				next[product.id] = productDraftFrom(product.id, productEntries, month);
				changed = true;
			}
			return changed ? next : current;
		});
	}, [
		products,
		productEntries,
		month
	]);
	if (platforms.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-lg border border-line bg-card p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-2xl",
				children: "Ainda não há plataformas"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Cria-as nas contas e depois apontas o mês."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-4",
				onClick: onSetup,
				children: "Ir para contas"
			})
		]
	});
	const ordered = [...platforms].sort((a, b) => {
		const aSaved = entryFor(entries, a.id, month) != null;
		if (aSaved !== (entryFor(entries, b.id, month) != null)) return aSaved ? 1 : -1;
		return a.name.localeCompare(b.name, "pt");
	});
	const recorded = platforms.filter((platform) => entryFor(entries, platform.id, month)).length;
	const monthContributed = entries.reduce((sum, entry) => entry.month === month ? cents(sum + entry.contributed) : sum, 0);
	function mine(platformId) {
		return products.filter((product) => product.platformId === platformId);
	}
	function isSplit(platformId) {
		const lines = mine(platformId);
		if (lines.length === 0) return false;
		const saved = entryFor(entries, platformId, month);
		const recordedProducts = lines.some((product) => productEntryFor(productEntries, product.id, month));
		return Boolean(splitting[platformId] || recordedProducts || !saved);
	}
	function productIsDirty(productId) {
		const draft = productDrafts[productId] ?? {
			contributed: "",
			endValue: ""
		};
		const saved = productEntryFor(productEntries, productId, month);
		if (!saved) return draft.contributed.trim() !== "" || draft.endValue.trim() !== "";
		return parseAmount(draft.contributed) !== saved.contributed || parseAmount(draft.endValue) !== saved.endValue;
	}
	function platformIsDirty(platformId) {
		if (isSplit(platformId)) return mine(platformId).some((product) => productIsDirty(product.id));
		return isDirty(drafts[platformId] ?? {
			contributed: "",
			endValue: ""
		}, entryFor(entries, platformId, month));
	}
	function parsedProducts(platformId) {
		const lines = [];
		for (const product of mine(platformId)) {
			const draft = productDrafts[product.id] ?? {
				contributed: "",
				endValue: ""
			};
			if (draft.contributed.trim() === "" && draft.endValue.trim() === "") continue;
			if (draft.contributed.trim() === "" || parseAmount(draft.contributed) == null) return `Em ${product.name}, indica o aporte. Se não meteste dinheiro, escreve 0.`;
			const contributed = parseAmount(draft.contributed);
			if (draft.endValue.trim() === "" || parseAmount(draft.endValue) == null) return `Em ${product.name}, indica o valor que ficou.`;
			const endValue = parseAmount(draft.endValue);
			if (contributed == null || endValue == null || endValue < 0) return `Em ${product.name}, indica o valor que ficou.`;
			lines.push({
				productId: product.id,
				contributed,
				endValue
			});
		}
		if (lines.length === 0) return "Indica pelo menos um produto. Se não meteste dinheiro, escreve 0.";
		return lines;
	}
	const dirtyCount = platforms.filter((platform) => platformIsDirty(platform.id)).length;
	const canRepeat = platforms.some((platform) => {
		if (isSplit(platform.id)) return mine(platform.id).some((product) => {
			const draft = productDrafts[product.id];
			if (draft && draft.contributed.trim() !== "") return false;
			return latestBefore(productEntries.filter((entry) => entry.productId === product.id), month);
		});
		const draft = drafts[platform.id];
		if (draft && draft.contributed.trim() !== "") return false;
		return previousEntry(entries, platform.id, month) != null;
	});
	function repeatContributions() {
		setDrafts((current) => {
			const next = { ...current };
			for (const platform of platforms) {
				if (isSplit(platform.id)) continue;
				const draft = next[platform.id] ?? {
					contributed: "",
					endValue: ""
				};
				if (draft.contributed.trim() !== "") continue;
				const earlier = previousEntry(entries, platform.id, month);
				if (!earlier) continue;
				next[platform.id] = {
					...draft,
					contributed: formatPlain(earlier.contributed)
				};
			}
			return next;
		});
		setProductDrafts((current) => {
			const next = { ...current };
			for (const product of products) {
				const draft = next[product.id] ?? {
					contributed: "",
					endValue: ""
				};
				if (draft.contributed.trim() !== "") continue;
				const earlier = latestBefore(productEntries.filter((entry) => entry.productId === product.id), month);
				if (!earlier) continue;
				next[product.id] = {
					...draft,
					contributed: formatPlain(earlier.contributed)
				};
			}
			return next;
		});
	}
	function commit(platformId, contributed, endValue) {
		upsertEntry({
			platformId,
			month,
			contributed,
			endValue
		});
		setDrafts((current) => ({
			...current,
			[platformId]: {
				contributed: formatPlain(contributed),
				endValue: formatPlain(endValue)
			}
		}));
		setErrors((current) => ({
			...current,
			[platformId]: ""
		}));
	}
	function commitProducts(platformId, lines) {
		saveProductMonth(platformId, month, lines);
		setProductDrafts((current) => {
			const next = { ...current };
			for (const line of lines) next[line.productId] = {
				contributed: formatPlain(line.contributed),
				endValue: formatPlain(line.endValue)
			};
			return next;
		});
		setErrors((current) => ({
			...current,
			[platformId]: ""
		}));
	}
	function saveAll() {
		const updates = {};
		const nextErrors = {};
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
			const parsed = parsedDraft(drafts[platform.id] ?? {
				contributed: "",
				endValue: ""
			});
			if (typeof parsed === "string") {
				nextErrors[platform.id] = parsed;
				continue;
			}
			upsertEntry({
				platformId: platform.id,
				month,
				...parsed
			});
			updates[platform.id] = {
				contributed: formatPlain(parsed.contributed),
				endValue: formatPlain(parsed.endValue)
			};
			nextErrors[platform.id] = "";
		}
		setDrafts((current) => ({
			...current,
			...updates
		}));
		setErrors((current) => ({
			...current,
			...nextErrors
		}));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-lg border border-line bg-card p-4 sm:p-5",
			children: [
				embedded ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthSwitcher, {
					month,
					onChange: onMonth
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: embedded ? "text-sm text-muted" : "mt-3 text-sm text-muted",
					children: [
						recorded,
						" de ",
						platforms.length,
						" plataformas neste mês. O aporte é o que entrou ou saiu. O valor é o que a plataforma mostrava no fim do mês."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoalMeter, {
					contributed: monthContributed,
					goal: monthlyGoal,
					currency,
					recorded: recorded > 0
				}),
				dirtyCount >= 2 || canRepeat ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap gap-2",
					children: [dirtyCount >= 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: saveAll,
						children: "Guardar este mês"
					}) : null, canRepeat ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "soft",
						onClick: repeatContributions,
						children: "Repetir aportes"
					}) : null]
				}) : null
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "grid gap-3 lg:grid-cols-2",
			children: ordered.map((platform) => {
				const draft = drafts[platform.id] ?? {
					contributed: "",
					endValue: ""
				};
				const saved = entryFor(entries, platform.id, month);
				const previous = previousEntry(entries, platform.id, month);
				const dirty = platformIsDirty(platform.id);
				const split = isSplit(platform.id);
				const lines = mine(platform.id);
				const kind = PLATFORM_KINDS.find((item) => item.id === platform.kind)?.label;
				const market = saved && !dirty && !split ? previous ? cents(saved.endValue - previous.endValue - saved.contributed) : cents(saved.endValue - (platform.openingInvested + saved.contributed)) : null;
				function update(patch) {
					setDrafts((current) => ({
						...current,
						[platform.id]: {
							...draft,
							...patch
						}
					}));
				}
				function updateProduct(productId, patch) {
					setProductDrafts((current) => ({
						...current,
						[productId]: {
							...current[productId] ?? {
								contributed: "",
								endValue: ""
							},
							...patch
						}
					}));
				}
				function save() {
					if (split) {
						const parsed = parsedProducts(platform.id);
						if (typeof parsed === "string") {
							setErrors((current) => ({
								...current,
								[platform.id]: parsed
							}));
							return;
						}
						commitProducts(platform.id, parsed);
						return;
					}
					const parsed = parsedDraft(draft);
					if (typeof parsed === "string") {
						setErrors((current) => ({
							...current,
							[platform.id]: parsed
						}));
						return;
					}
					commit(platform.id, parsed.contributed, parsed.endValue);
				}
				function addNamedProduct() {
					const name = (productNames[platform.id] ?? "").trim();
					if (!name) return;
					const id = addProduct(platform.id, name);
					setSplitting((current) => ({
						...current,
						[platform.id]: true
					}));
					setProductNames((current) => ({
						...current,
						[platform.id]: ""
					}));
					setProductDrafts((current) => current[id] ? current : {
						...current,
						[id]: {
							contributed: "",
							endValue: ""
						}
					});
				}
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-lg border border-line bg-card p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KindMark, { kind: platform.kind }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate font-medium",
									children: platform.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-muted",
									children: [
										kind,
										split ? " · por produto" : "",
										saved && !dirty ? " · registado" : dirty ? " · por guardar" : " · por registar"
									]
								})]
							})]
						}),
						split ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 space-y-4",
							children: lines.map((product) => {
								const line = productDrafts[product.id] ?? {
									contributed: "",
									endValue: ""
								};
								const earlier = latestBefore(productEntries.filter((entry) => entry.productId === product.id), month);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: product.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mb-1.5 block text-sm font-medium",
											children: "Aporte"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											inputMode: "decimal",
											value: line.contributed,
											placeholder: "0,00",
											onChange: (event) => updateProduct(product.id, { contributed: event.target.value }),
											className: "h-12 w-full rounded-md border border-line bg-paper px-3 text-base tabular-nums text-ink outline-none focus-visible:border-forest"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "block",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mb-1.5 block text-sm font-medium",
												children: "Valor no fim"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												inputMode: "decimal",
												value: line.endValue,
												placeholder: "0,00",
												onChange: (event) => updateProduct(product.id, { endValue: event.target.value }),
												className: "h-12 w-full rounded-md border border-line bg-paper px-3 text-base tabular-nums text-ink outline-none focus-visible:border-forest"
											}),
											earlier ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "mt-1.5 block text-sm text-muted",
												children: ["Mês anterior: ", formatMoney(earlier.endValue, currency)]
											}) : null
										]
									})]
								})] }, product.id);
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mb-1.5 block text-sm font-medium",
										children: "Aporte"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										inputMode: "decimal",
										value: draft.contributed,
										placeholder: "0,00",
										onChange: (event) => update({ contributed: event.target.value }),
										className: "h-12 w-full rounded-md border border-line bg-paper px-3 text-base tabular-nums text-ink outline-none focus-visible:border-forest"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1.5 block text-sm text-muted",
										children: "Negativo se tiraste dinheiro."
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mb-1.5 block text-sm font-medium",
										children: "Valor no fim"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										inputMode: "decimal",
										value: draft.endValue,
										placeholder: "0,00",
										onChange: (event) => update({ endValue: event.target.value }),
										className: "h-12 w-full rounded-md border border-line bg-paper px-3 text-base tabular-nums text-ink outline-none focus-visible:border-forest"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1.5 block text-sm text-muted",
										children: previous ? `Mês anterior: ${formatMoney(previous.endValue, currency)}` : "Primeiro mês desta plataforma."
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "mt-4 flex flex-col gap-2 sm:flex-row",
							onSubmit: (event) => {
								event.preventDefault();
								addNamedProduct();
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: productNames[platform.id] ?? "",
								placeholder: "Nome do produto",
								maxLength: 40,
								onChange: (event) => setProductNames((current) => ({
									...current,
									[platform.id]: event.target.value
								})),
								className: "h-12 min-w-0 flex-1 rounded-md border border-line bg-paper px-3 text-base text-ink outline-none focus-visible:border-forest"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								variant: "soft",
								disabled: (productNames[platform.id] ?? "").trim() === "",
								children: "Adicionar produto"
							})]
						}),
						split ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-muted",
							children: "O total da plataforma é a soma destes produtos."
						}) : lines.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-3",
							variant: "ghost",
							onClick: () => setSplitting((current) => ({
								...current,
								[platform.id]: true
							})),
							children: "Dividir este mês por produto"
						}) : null,
						errors[platform.id] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-loss",
							children: errors[platform.id]
						}) : null,
						market != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-sm",
							children: ["O mercado mexeu ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedMoney, {
								value: market,
								currency
							})]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: save,
									disabled: !dirty,
									children: saved ? "Atualizar" : "Guardar"
								}),
								!split && previous ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "soft",
									onClick: () => update({
										contributed: draft.contributed.trim() === "" ? formatPlain(0) : draft.contributed,
										endValue: formatPlain(previous.endValue)
									}),
									children: "Usar último valor"
								}) : null,
								split && lines.some((product) => latestBefore(productEntries.filter((entry) => entry.productId === product.id), month)) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "soft",
									onClick: () => setProductDrafts((current) => {
										const next = { ...current };
										for (const product of lines) {
											const earlier = latestBefore(productEntries.filter((entry) => entry.productId === product.id), month);
											if (!earlier) continue;
											const line = next[product.id] ?? {
												contributed: "",
												endValue: ""
											};
											next[product.id] = {
												contributed: line.contributed.trim() === "" ? formatPlain(0) : line.contributed,
												endValue: formatPlain(earlier.endValue)
											};
										}
										return next;
									}),
									children: "Usar último valor"
								}) : null,
								saved && confirmId === saved.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "danger",
									onClick: () => {
										deleteEntry(saved.id);
										setDrafts((current) => ({
											...current,
											[platform.id]: {
												contributed: "",
												endValue: ""
											}
										}));
										setConfirmId(null);
									},
									children: "Confirmar"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									onClick: () => setConfirmId(null),
									children: "Cancelar"
								})] }) : saved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									onClick: () => setConfirmId(saved.id),
									children: "Eliminar"
								}) : null
							]
						})
					]
				}, platform.id);
			})
		})]
	});
}
function CloseView({ month, onMonth, onSetup }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-line bg-card p-4 sm:p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthSwitcher, {
					month,
					onChange: onMonth
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted",
					children: "Aponta o mês de uma vez: investimentos, ganhos, despesas e cartões."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "fecho-investimentos",
				className: "scroll-mt-6 space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl",
					children: "Investimentos"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthPanel, {
					embedded: true,
					month,
					onMonth,
					onSetup
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "fecho-ganhos",
				className: "scroll-mt-6 space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl",
					children: "Ganhos"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IncomePanel, {
					embedded: true,
					month,
					onMonth,
					onSetup
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "fecho-despesas",
				className: "scroll-mt-6 space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl",
					children: "Despesas"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpensesPanel, {
					embedded: true,
					month,
					onMonth,
					onSetup
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "fecho-cartoes",
				className: "scroll-mt-6 space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl",
					children: "Cartões"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CashbackPanel, {
					embedded: true,
					month,
					onMonth,
					onSetup
				})]
			})
		]
	});
}
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	return useSessionUserState();
}
function useSessionUserState() {
	const { data, isPending } = authClient.useSession();
	const id = data?.user.id;
	const displayName = data?.user.name ?? null;
	const primaryEmail = data?.user.email ?? null;
	const profileImageUrl = data?.user.image ?? null;
	const user = (0, import_react.useMemo)(() => id ? {
		id,
		displayName,
		primaryEmail,
		profileImageUrl,
		isDevFallback: false
	} : null, [
		id,
		displayName,
		primaryEmail,
		profileImageUrl
	]);
	return (0, import_react.useMemo)(() => ({
		user,
		isPending
	}), [user, isPending]);
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
function Sheet({ open, onOpenChange, title, description, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-40 bg-black/50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "fixed inset-x-0 bottom-0 z-50 max-h-[92dvh] overflow-y-auto rounded-t-lg border border-line bg-card p-5 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:max-h-[85dvh] sm:w-full sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-lg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-5 flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "font-serif text-2xl",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
					className: "mt-1 text-sm text-muted",
					children: description
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
					"aria-label": "Fechar",
					className: "grid h-11 w-11 shrink-0 place-items-center rounded-md text-ink hover:bg-chip",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
				})]
			}), children]
		})] })
	});
}
function PlatformDialog({ open, platform, onOpenChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open,
		onOpenChange,
		title: platform ? "Editar plataforma" : "Nova plataforma",
		description: "Uma corretora, um banco, um PPR — cada sítio onde o dinheiro está.",
		children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlatformForm, {
			platform,
			onDone: () => onOpenChange(false)
		}) : null
	});
}
function PlatformForm({ platform, onDone }) {
	const addPlatform = useLedger((state) => state.addPlatform);
	const updatePlatform = useLedger((state) => state.updatePlatform);
	const [name, setName] = (0, import_react.useState)(platform?.name ?? "");
	const [kind, setKind] = (0, import_react.useState)(platform?.kind ?? "corretora");
	const [opening, setOpening] = (0, import_react.useState)(platform ? formatPlain(platform.openingInvested) : "");
	const [error, setError] = (0, import_react.useState)("");
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
		const draft = {
			name: trimmed,
			kind,
			openingInvested: parsed
		};
		if (platform) updatePlatform(platform.id, draft);
		else addPlatform(draft);
		onDone();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "space-y-4",
		onSubmit: (event) => {
			event.preventDefault();
			save();
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Nome",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					autoFocus: true,
					value: name,
					onChange: (event) => setName(event.target.value),
					placeholder: "XTB, Trade Republic, banco…",
					maxLength: 80,
					className: inputClassName()
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-1.5 text-sm font-medium",
				children: "Tipo"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-2",
				children: PLATFORM_KINDS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-pressed": kind === item.id,
					onClick: () => setKind(item.id),
					className: cn("min-h-11 rounded-md border px-3 py-2 text-sm", kind === item.id ? "border-forest bg-forest-soft text-ink" : "border-line bg-card text-ink"),
					children: item.label
				}, item.id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Capital já investido",
				hint: "O que já tinhas metido antes do primeiro mês que vais registar. Não é o valor de mercado.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					inputMode: "decimal",
					value: opening,
					onChange: (event) => setOpening(event.target.value),
					placeholder: "0,00",
					className: cn(inputClassName(), "tabular-nums")
				})
			}),
			platform ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Mudar o capital inicial recalcula o resultado desde o início."
			}) : null,
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-loss",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				className: "w-full",
				children: platform ? "Guardar alterações" : "Adicionar plataforma"
			})
		]
	});
}
function SettingsDialog({ open, onOpenChange }) {
	const currency = useLedger((state) => state.currency);
	const setCurrency = useLedger((state) => state.setCurrency);
	const importData = useLedger((state) => state.importData);
	const reset = useLedger((state) => state.reset);
	const loadDemo = useLedger((state) => state.loadDemo);
	const remote = useLedger((state) => state.remote);
	const account = useCurrentUser();
	const hasData = useLedger((state) => state.platforms.length > 0 || state.entries.length > 0 || state.expenseTypes.length > 0 || state.expenses.length > 0 || state.cashbackCards.length > 0 || state.cashbacks.length > 0 || state.incomeSources.length > 0 || state.incomes.length > 0);
	const fileRef = (0, import_react.useRef)(null);
	const [message, setMessage] = (0, import_react.useState)("");
	const [confirmWipe, setConfirmWipe] = (0, import_react.useState)(false);
	const [confirmDemo, setConfirmDemo] = (0, import_react.useState)(false);
	const [theme, setTheme] = (0, import_react.useState)("papel");
	(0, import_react.useEffect)(() => {
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
	async function onFile(file) {
		try {
			const parsed = JSON.parse(await file.text());
			const error = importData(parsed);
			setMessage(error ?? "Caderneta importada. A anterior foi substituída.");
			if (!error) onOpenChange(false);
		} catch {
			setMessage("Não consegui ler esse ficheiro.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open,
		onOpenChange: (next) => {
			if (!next) {
				setConfirmWipe(false);
				setConfirmDemo(false);
				setMessage("");
			}
			onOpenChange(next);
		},
		title: "Definições",
		description: remote ? "Os números ficam no PostgreSQL. Exporta uma cópia se quiseres um ficheiro teu." : "Os números ficam neste dispositivo. Exporta uma cópia se quiseres um ficheiro teu.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-5",
			children: [
				remote ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md bg-paper px-3 py-3 text-sm",
					children: [account?.primaryEmail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: account.primaryEmail
					}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: account?.primaryEmail ? "mt-1 text-muted" : "text-muted",
						children: "Não há forma de recuperar a palavra-passe. Se a esqueceres, esta caderneta fica fechada. Exporta uma cópia enquanto estás aqui."
					})]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-sm font-medium",
						children: "Aparência"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-3 gap-2",
						children: THEMES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							"aria-pressed": theme === item.id,
							onClick: () => {
								setTheme(item.id);
								storeTheme(item.id);
							},
							className: cn("flex min-h-16 flex-col items-center justify-center gap-2 rounded-md border px-2 py-3 text-sm font-medium", theme === item.id ? "border-forest bg-forest-soft" : "border-line bg-card"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex h-6 w-10 overflow-hidden rounded border border-line",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex-1",
									style: { background: item.paper }
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex-1",
									style: { background: item.accent }
								})]
							}), item.label]
						}, item.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "Sistema segue o claro ou o escuro do telemóvel."
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-sm font-medium",
					children: "Moeda"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 gap-2",
					children: CURRENCIES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"aria-pressed": currency === item.id,
						onClick: () => setCurrency(item.id),
						className: cn("flex h-12 items-center justify-between rounded-md border px-3 text-sm", currency === item.id ? "border-forest bg-forest-soft" : "border-line bg-card"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums text-muted",
							children: item.id
						})]
					}, item.id))
				})] }),
				open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoalEditor, {}) : null,
				open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FireEditor, {}) : null,
				open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClosingDayEditor, {}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "soft",
							onClick: exportFile,
							children: "Exportar"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "soft",
							onClick: () => fileRef.current?.click(),
							children: "Importar"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: fileRef,
							type: "file",
							accept: "application/json,.json",
							className: "sr-only",
							onChange: (event) => {
								const file = event.target.files?.[0];
								event.target.value = "";
								if (file) onFile(file);
							}
						})
					]
				}),
				confirmDemo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md bg-brass-soft p-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "O exemplo substitui o que está nesta caderneta." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => {
								loadDemo();
								setConfirmDemo(false);
								onOpenChange(false);
							},
							children: "Substituir"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => setConfirmDemo(false),
							children: "Cancelar"
						})]
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: () => {
						if (hasData) setConfirmDemo(true);
						else {
							loadDemo();
							onOpenChange(false);
						}
					},
					children: "Carregar exemplo"
				}),
				confirmWipe ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md bg-loss-soft p-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: remote ? "Isto apaga a caderneta na base de dados. Não dá para desfazer." : "Isto apaga a caderneta neste dispositivo. Não dá para desfazer." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "danger",
							onClick: () => {
								reset();
								setConfirmWipe(false);
								onOpenChange(false);
							},
							children: "Apagar tudo"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => setConfirmWipe(false),
							children: "Cancelar"
						})]
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					className: "text-loss",
					onClick: () => setConfirmWipe(true),
					children: "Apagar caderneta"
				}),
				message ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: message
				}) : null,
				remote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: () => {
						signOut("/").catch(() => setMessage("Não consegui sair. Tenta outra vez."));
					},
					children: "Sair da conta"
				}) : null
			]
		})
	});
}
function GoalEditor() {
	const monthlyGoal = useLedger((state) => state.monthlyGoal);
	const setMonthlyGoal = useLedger((state) => state.setMonthlyGoal);
	const [value, setValue] = (0, import_react.useState)(monthlyGoal == null ? "" : formatPlain(monthlyGoal));
	const [error, setError] = (0, import_react.useState)("");
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "space-y-2",
		onSubmit: (event) => {
			event.preventDefault();
			save();
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Meta de aporte por mês",
				hint: "O total que queres meter, somando todas as plataformas. Vazio se não quiseres meta.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					inputMode: "decimal",
					value,
					onChange: (event) => setValue(event.target.value),
					placeholder: "0,00",
					className: cn(inputClassName(), "tabular-nums")
				})
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-loss",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				variant: "soft",
				children: "Guardar meta"
			})
		]
	});
}
function FireEditor() {
	const fireGoal = useLedger((state) => state.fireGoal);
	const setFireGoal = useLedger((state) => state.setFireGoal);
	const [value, setValue] = (0, import_react.useState)(fireGoal == null ? "" : formatPlain(fireGoal));
	const [error, setError] = (0, import_react.useState)("");
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "space-y-2",
		onSubmit: (event) => {
			event.preventDefault();
			save();
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Objetivo FIRE",
				hint: "O valor que a carteira tem de atingir. O progresso usa o último valor registado de cada ativo.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					inputMode: "decimal",
					value,
					onChange: (event) => setValue(event.target.value),
					placeholder: "0,00",
					className: cn(inputClassName(), "tabular-nums")
				})
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-loss",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				variant: "soft",
				children: "Guardar objetivo"
			})
		]
	});
}
function ClosingDayEditor() {
	const closingDay = useLedger((state) => state.closingDay);
	const setClosingDay = useLedger((state) => state.setClosingDay);
	const [value, setValue] = (0, import_react.useState)(String(closingDay));
	const [error, setError] = (0, import_react.useState)("");
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "space-y-2",
		onSubmit: (event) => {
			event.preventDefault();
			save();
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Dia de fecho",
				hint: "O dia em que atualizas a caderneta, todos os meses. Se o mês for mais curto, fecha no último dia.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					inputMode: "numeric",
					value,
					onChange: (event) => setValue(event.target.value),
					className: cn(inputClassName(), "tabular-nums")
				})
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-loss",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				variant: "soft",
				children: "Guardar dia"
			})
		]
	});
}
function SummaryView({ month, onMonth, onRegister, onExpenses, onCashback, onIncome, onOpenPlatform }) {
	const platforms = useLedger((state) => state.platforms);
	const entries = useLedger((state) => state.entries);
	const products = useLedger((state) => state.products);
	const productEntries = useLedger((state) => state.productEntries);
	const expenseTypes = useLedger((state) => state.expenseTypes);
	const expenses = useLedger((state) => state.expenses);
	const cashbackCards = useLedger((state) => state.cashbackCards);
	const cashbacks = useLedger((state) => state.cashbacks);
	const incomeSources = useLedger((state) => state.incomeSources);
	const incomes = useLedger((state) => state.incomes);
	const currency = useLedger((state) => state.currency);
	const monthlyGoal = useLedger((state) => state.monthlyGoal);
	const series = buildSeries(platforms, entries);
	const snapshot = totals(platforms, entries);
	const focus = pointFor(series, month);
	const years = yearlyRollup(series);
	const shares = valueShares(platforms, entries);
	const kinds = kindShares(platforms, entries);
	const portfolio = productShares(platforms, products, entries, productEntries);
	const pending = platforms.filter((platform) => !entryFor(entries, platform.id, month));
	const pendingExpenses = expenseTypes.filter((type) => !expenseFor(expenses, type.id, month));
	const spent = expenseTotal(expenses, month);
	const cashRows = cashbackRows(cashbackCards, cashbacks, month);
	const cashTotal = cashbackTotal(cashbacks, month);
	const cashLeaders = cashRows.filter((row) => row.amount > 0 && row.amount === cashRows[0]?.amount);
	const pendingCash = cashbackCards.filter((card) => !cashbackFor(cashbacks, card.id, month));
	const monthContributed = contributedIn(entries, month);
	const earned = incomeTotal(incomes, month);
	const saveRate = savingsRate(monthContributed, earned);
	const pendingIncome = incomeSources.filter((source) => !incomeFor(incomes, source.id, month));
	const period = savingsSeries(entries, incomes);
	const earnedAll = period.reduce((sum, point) => sum + point.earned, 0);
	const rateAll = savingsRate(period.reduce((sum, point) => sum + point.invested, 0), earnedAll);
	const ranked = platforms.map((platform) => ({
		platform,
		snap: platformSnapshot(platform, entries)
	})).sort((a, b) => (b.snap.value ?? -1) - (a.snap.value ?? -1));
	const [evolution, setEvolution] = (0, import_react.useState)(false);
	const expenseHistory = expenseSeries(expenseTypes, expenses);
	const cashHistory = cashbackSeries(cashbackCards, cashbacks);
	const cashChartRows = cashLeaders.length > 0 ? cashRows : [];
	const cashChartTitle = cashLeaders.length === 1 ? `${cashLeaders[0].name} deu mais em ${formatMonth(month).toLowerCase()}.` : cashLeaders.length > 1 ? `${cashLeaders.map((row) => row.name).join(" e ")} empataram em ${formatMonth(month).toLowerCase()}.` : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-line bg-card p-5 sm:p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Valor da carteira"
					}),
					snapshot.withValue === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-serif text-4xl",
						children: "Ainda sem meses"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-serif text-4xl tabular-nums sm:text-5xl",
						children: formatMoney(snapshot.value, currency)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-xl text-sm leading-relaxed",
						children: story(snapshot, currency)
					}),
					snapshot.latestMonth ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted",
						children: [
							"Atualizado em ",
							formatMonth(snapshot.latestMonth).toLowerCase(),
							snapshot.resultRatio != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [" · ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: snapshot.result > 0 ? "text-forest" : snapshot.result < 0 ? "text-loss" : void 0,
								children: formatPercent(snapshot.resultRatio)
							})] }) : null
						]
					}) : null,
					snapshot.withValue > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompareBars, {
						invested: snapshot.invested,
						value: snapshot.value,
						currency
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FireCard, {
				value: snapshot.value,
				recorded: snapshot.withValue > 0,
				currency
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-line bg-card p-4 sm:p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthSwitcher, {
						month,
						onChange: onMonth
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthBalance, {
						earned,
						spent,
						invested: monthContributed,
						incomeKnown: incomeSources.length === 0 || pendingIncome.length === 0,
						spendKnown: expenseTypes.length === 0 || pendingExpenses.length === 0,
						investKnown: platforms.length === 0 || Boolean(focus && focus.recorded > 0),
						incomeRecorded: incomeSources.length > 0 && pendingIncome.length < incomeSources.length,
						spendRecorded: expenseTypes.length > 0 && pendingExpenses.length < expenseTypes.length,
						investRecorded: Boolean(focus && focus.recorded > 0),
						currency
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloseSteps, { steps: [
						platforms.length > 0 ? {
							id: "mes",
							label: "Investimentos",
							done: pending.length === 0,
							detail: `${platforms.length - pending.length} de ${platforms.length}`,
							go: onRegister
						} : null,
						incomeSources.length > 0 ? {
							id: "ganhos",
							label: "Ganhos",
							done: pendingIncome.length === 0,
							detail: `${incomeSources.length - pendingIncome.length} de ${incomeSources.length}`,
							go: onIncome
						} : null,
						expenseTypes.length > 0 ? {
							id: "despesas",
							label: "Despesas",
							done: pendingExpenses.length === 0,
							detail: `${expenseTypes.length - pendingExpenses.length} de ${expenseTypes.length}`,
							go: onExpenses
						} : null,
						cashbackCards.length > 0 ? {
							id: "cartoes",
							label: "Cartões",
							done: pendingCash.length === 0,
							detail: `${cashbackCards.length - pendingCash.length} de ${cashbackCards.length}`,
							go: onCashback
						} : null
					].filter((step) => step != null) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm leading-relaxed",
						children: monthStory(focus, platforms.length, currency)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
								label: "Aporte do mês",
								value: focus && focus.recorded > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedMoney, {
									value: focus.contributed,
									currency
								}) : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
								label: "Mercado",
								value: focus && focus.recorded > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedMoney, {
									value: focus.market,
									currency
								}) : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
								label: "Plataformas",
								value: focus && focus.recorded > 0 ? `${focus.recorded} de ${platforms.length}` : "por registar"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoalMeter, {
						contributed: monthContributed,
						goal: monthlyGoal,
						currency,
						recorded: Boolean(focus && focus.recorded > 0)
					}),
					pending.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-sm text-muted",
						children: [
							"Falta registar ",
							pending.map((platform) => platform.name).join(", "),
							"."
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-4 w-full sm:w-auto",
						onClick: onRegister,
						children: "Registar este mês"
					})
				]
			}),
			incomeSources.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-line bg-card p-4 sm:p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Poupança investida"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-serif text-4xl tabular-nums",
						children: saveRate == null ? "—" : formatShare(saveRate)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: earned <= 0 ? "Ainda sem ganhos neste mês." : `Ganhaste ${formatMoney(earned, currency)} e investiste ${formatMoney(monthContributed, currency)}.`
					}),
					pendingIncome.length > 0 && earned > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted",
						children: [
							"Falta ",
							pendingIncome.map((source) => source.name).join(", "),
							"."
						]
					}) : null,
					rateAll != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted",
						children: [
							"No período, ",
							formatShare(rateAll),
							" de ",
							formatMoney(earnedAll, currency),
							"."
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-4",
						variant: "soft",
						onClick: onIncome,
						children: "Registar ganhos"
					})
				]
			}) : null,
			expenseTypes.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-line bg-card p-4 sm:p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Despesas do mês"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-serif text-3xl tabular-nums",
						children: pendingExpenses.length === expenseTypes.length && spent === 0 ? "Ainda por registar" : formatMoney(spent, currency)
					}),
					pendingExpenses.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted",
						children: [
							"Falta ",
							pendingExpenses.map((type) => type.name).join(", "),
							"."
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-4",
						variant: "soft",
						onClick: onExpenses,
						children: "Registar despesas"
					})
				]
			}) : null,
			cashbackCards.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-line bg-card p-4 sm:p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Cashback do mês"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-serif text-3xl tabular-nums",
						children: cashLeaders.length === 0 ? "Ainda por registar" : formatMoney(cashTotal, currency)
					}),
					cashLeaders.length === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted",
						children: [cashLeaders[0].name, " deu mais."]
					}) : null,
					pendingCash.length > 0 && cashLeaders.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted",
						children: [
							"Falta ",
							pendingCash.map((card) => card.name).join(", "),
							"."
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-4",
						variant: "soft",
						onClick: onCashback,
						children: "Registar cashback"
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "soft",
				"aria-expanded": evolution,
				onClick: () => setEvolution((open) => !open),
				children: evolution ? "Esconder evolução" : "Ver evolução"
			}) }),
			evolution ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ValueChart, {
					points: series,
					currency
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YearCompareChart, {
					currency,
					metrics: [
						{
							id: "valor",
							label: "Carteira",
							points: series.filter((point) => point.recorded > 0).map((point) => ({
								month: point.month,
								amount: point.value
							}))
						},
						{
							id: "aportes",
							label: "Aportes",
							signed: true,
							points: series.filter((point) => point.recorded > 0).map((point) => ({
								month: point.month,
								amount: point.contributed
							}))
						},
						{
							id: "ganhos",
							label: "Ganhos",
							points: sumByMonth(incomes)
						},
						{
							id: "despesas",
							label: "Despesas",
							points: sumByMonth(expenses)
						}
					]
				}),
				shares.length > 1 || products.length > 0 && portfolio.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-lg border border-line bg-card p-4 sm:p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mb-4 font-serif text-2xl",
							children: "Onde está o dinheiro"
						}),
						shares.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShareList, {
							title: "Por plataforma",
							slices: shares,
							currency
						}) : null,
						kinds.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShareList, {
								title: "Por tipo",
								slices: kinds,
								currency
							})
						}) : null,
						products.length > 0 && portfolio.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShareList, {
								title: "Por produto",
								slices: portfolio,
								currency
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm text-muted",
								children: "A percentagem é o último valor de cada produto. O que não dividiste fica com o nome da plataforma."
							})]
						}) : null
					]
				}) : null,
				years.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-lg border border-line bg-card px-4 py-2 sm:px-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "py-3 font-serif text-2xl",
						children: "Por ano"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: years.map((year) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-start justify-between gap-4 border-t border-line py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-serif text-xl",
							children: year.year
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "tabular-nums",
									children: ["Aportes ", formatMoney(year.contributed, currency)]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Mercado ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedMoney, {
									value: year.market,
									currency
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "tabular-nums text-muted",
									children: ["No fim ", formatMoney(year.endValue, currency)]
								})
							]
						})]
					}, year.year)) })]
				}) : null,
				ranked.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 font-serif text-2xl",
					children: "Plataformas"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: ranked.map(({ platform, snap }) => {
						const kind = PLATFORM_KINDS.find((item) => item.id === platform.kind)?.label;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => onOpenPlatform(platform.id),
							className: "flex w-full items-center gap-3 rounded-lg border border-line bg-card p-3 text-left hover:border-forest",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KindMark, { kind: platform.kind }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block truncate font-medium",
										children: platform.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-sm text-muted",
										children: kind
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "shrink-0 text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block font-serif text-lg tabular-nums",
										children: snap.value == null ? "—" : formatMoney(snap.value, currency)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-sm",
										children: snap.result == null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted",
											children: "Sem meses"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedMoney, {
											value: snap.result,
											currency
										})
									})]
								})
							]
						}) }, platform.id);
					})
				})] }) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SavingsChart, {
					series: period,
					currency
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpenseChart, {
					series: expenseHistory,
					types: expenseTypes,
					currency
				}),
				cashChartRows.some((row) => row.amount > 0) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CashbackMonthChart, {
					rows: cashChartRows,
					currency,
					title: cashChartTitle
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CashbackHistory, {
					series: cashHistory,
					cards: cashbackCards,
					currency
				})
			] }) : null
		]
	});
}
function Mini({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md bg-paper px-3 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-base font-medium",
			children: value
		})]
	});
}
function MonthBalance({ earned, spent, invested, incomeKnown, spendKnown, investKnown, incomeRecorded, spendRecorded, investRecorded, currency }) {
	if (!incomeRecorded && !spendRecorded && !investRecorded) return null;
	const missing = [
		!incomeKnown && incomeRecorded ? "ganhos" : null,
		!spendKnown && spendRecorded ? "despesas" : null,
		!investKnown && investRecorded ? "investimentos" : null
	].filter((item) => item != null);
	const blocked = !incomeRecorded && !incomeKnown || !spendRecorded && !spendKnown || !investRecorded && !investKnown;
	const leftover = cents(earned - spent - invested);
	const leftoverText = leftover > 0 ? `Sobrou ${formatMoney(leftover, currency)} depois das despesas e do que meteste a investir.` : leftover < 0 ? `Saíram ${formatMoney(Math.abs(leftover), currency)} a mais do que entrou.` : "O que entrou foi para despesas e investimentos.";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
					label: "Ganhaste",
					value: incomeRecorded ? formatMoney(earned, currency) : "—"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
					label: "Gastaste",
					value: spendRecorded ? formatMoney(spent, currency) : "—"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
					label: "Investiste",
					value: investRecorded ? formatMoney(invested, currency) : "—"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
					label: "Sobrou",
					value: blocked ? "—" : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedMoney, {
						value: leftover,
						currency
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm leading-relaxed text-muted",
			children: blocked ? "A sobra fecha quando ganhos, despesas e investimentos deste mês estiverem apontados." : missing.length > 0 ? `${leftoverText} Ainda falta fechar ${missing.join(" e ")}.` : leftoverText
		})]
	});
}
function CloseSteps({ steps }) {
	if (steps.length === 0) return null;
	const open = steps.find((step) => !step.done);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "overflow-hidden rounded-md border border-line",
			children: steps.map((step) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "border-t border-line first:border-t-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: step.go,
					className: "flex h-12 w-full items-center justify-between gap-3 px-3 text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium",
						children: step.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted",
						children: step.done ? "Feito" : step.detail
					})]
				})
			}, step.id))
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			className: "mt-3 w-full sm:w-auto",
			onClick: open.go,
			children: "Continuar o fecho"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-muted",
			children: "Fecho deste mês completo."
		})]
	});
}
function FireCard({ value, recorded, currency }) {
	const fireGoal = useLedger((state) => state.fireGoal);
	const setFireGoal = useLedger((state) => state.setFireGoal);
	const [editing, setEditing] = (0, import_react.useState)(fireGoal == null);
	const [draft, setDraft] = (0, import_react.useState)(fireGoal == null ? "" : formatPlain(fireGoal));
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		setDraft(fireGoal == null ? "" : formatPlain(fireGoal));
		setEditing(fireGoal == null);
	}, [fireGoal]);
	const width = fireGoal == null || fireGoal <= 0 ? 0 : Math.max(0, Math.min(100, Math.max(value, 0) / fireGoal * 100));
	const left = fireGoal == null ? 0 : cents(fireGoal - value);
	function save() {
		if (draft.trim() === "") {
			setFireGoal(null);
			setError("");
			setEditing(true);
			return;
		}
		const parsed = parseAmount(draft);
		if (parsed == null || parsed <= 0) {
			setError("O objetivo tem de ser um valor positivo.");
			return;
		}
		setFireGoal(parsed);
		setError("");
		setEditing(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-lg border border-line bg-card p-5 sm:p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "Objetivo FIRE"
		}), fireGoal != null && !editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 font-serif text-4xl tabular-nums",
				children: recorded ? formatShare(Math.max(value, 0) / fireGoal) : formatMoney(fireGoal, currency)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm leading-relaxed",
				children: recorded ? value >= fireGoal ? `A carteira vale ${formatMoney(value, currency)} e já passou o objetivo de ${formatMoney(fireGoal, currency)}.` : `Os ativos registados valem ${formatMoney(value, currency)}. Faltam ${formatMoney(left, currency)}.` : `O objetivo é ${formatMoney(fireGoal, currency)}. Ainda não há valores de ativos registados.`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 h-2 overflow-hidden rounded-full bg-chip",
				role: "progressbar",
				"aria-valuemin": 0,
				"aria-valuemax": 100,
				"aria-valuenow": Math.round(width),
				"aria-label": "Progresso do objetivo FIRE",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full rounded-full bg-forest",
					style: { width: `${width}%` }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm tabular-nums text-muted",
				children: [
					formatMoney(Math.max(value, 0), currency),
					" / ",
					formatMoney(fireGoal, currency)
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-4",
				variant: "soft",
				onClick: () => setEditing(true),
				children: "Alterar objetivo"
			})
		] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mt-3 space-y-3",
			onSubmit: (event) => {
				event.preventDefault();
				save();
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-muted",
					children: "O valor que a carteira tem de atingir. Conta o último valor que registares em cada ativo."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					inputMode: "decimal",
					value: draft,
					onChange: (event) => setDraft(event.target.value),
					placeholder: "0,00",
					className: "h-12 w-full rounded-md border border-line bg-paper px-3 text-base tabular-nums text-ink outline-none focus-visible:border-forest"
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-loss",
					children: error
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						children: "Guardar objetivo"
					}), fireGoal != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => setEditing(false),
						children: "Cancelar"
					}) : null]
				})
			]
		})]
	});
}
function story(snapshot, currency) {
	if (snapshot.withValue === 0) return "Quando registares o primeiro fim de mês, comparas aqui o que meteste com o que ficou.";
	const invested = formatMoney(snapshot.invested, currency);
	if (snapshot.result > 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		"Investiste ",
		invested,
		". Ficou",
		" ",
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-forest",
			children: formatMoney(snapshot.result, currency)
		}),
		" acima do que meteste."
	] });
	if (snapshot.result < 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		"Investiste ",
		invested,
		". Ficou",
		" ",
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-loss",
			children: formatMoney(Math.abs(snapshot.result), currency)
		}),
		" abaixo do que meteste."
	] });
	return `Investiste ${invested}, e a carteira vale o mesmo.`;
}
function monthStory(focus, platformCount, currency) {
	if (!focus || focus.recorded === 0) return "Este mês ainda não tem registos. Em cada plataforma, indica o aporte e o valor no fim do mês.";
	const aporte = focus.contributed === 0 ? "não houve aportes" : focus.contributed > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["entraram ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-forest",
		children: formatMoney(focus.contributed, currency)
	})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["saíram ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-loss",
		children: formatMoney(Math.abs(focus.contributed), currency)
	})] });
	const market = focus.market === 0 ? "o mercado não mexeu o saldo" : focus.market > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["o mercado somou ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-forest",
		children: formatMoney(focus.market, currency)
	})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["o mercado tirou ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-loss",
		children: formatMoney(Math.abs(focus.market), currency)
	})] });
	const coverage = focus.recorded < platformCount ? ` ${focus.recorded} de ${platformCount} plataformas.` : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		"Neste mês ",
		aporte,
		" e ",
		market,
		".",
		coverage
	] });
}
function PlatformsPanel({ selectedId, onOpen, onClose, onAdd, onEdit, onGoMonth }) {
	const platforms = useLedger((state) => state.platforms);
	const entries = useLedger((state) => state.entries);
	const currency = useLedger((state) => state.currency);
	const selected = platforms.find((platform) => platform.id === selectedId) ?? null;
	if (selected) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlatformDetail, {
		platformId: selected.id,
		onClose,
		onEdit: () => onEdit(selected.id),
		onGoMonth
	});
	const ranked = [...platforms].sort((a, b) => a.name.localeCompare(b.name, "pt"));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-2xl",
				children: "Plataformas"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: onAdd,
				children: "Nova"
			})]
		}), ranked.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "rounded-lg border border-line bg-card p-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Ainda não adicionaste nenhuma."
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-2",
			children: ranked.map((platform) => {
				const snap = platformSnapshot(platform, entries);
				const kind = PLATFORM_KINDS.find((item) => item.id === platform.kind)?.label;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onOpen(platform.id),
					className: "flex w-full items-center gap-3 rounded-lg border border-line bg-card p-3 text-left hover:border-forest",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KindMark, { kind: platform.kind }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate font-medium",
								children: platform.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "block text-sm text-muted",
								children: [kind, snap.months > 0 ? ` · ${snap.months} ${snap.months === 1 ? "mês" : "meses"}` : ""]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-serif text-lg tabular-nums",
								children: snap.value == null ? "—" : formatMoney(snap.value, currency)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-sm text-muted",
								children: snap.invested > 0 || snap.months > 0 ? `investido ${formatMoney(snap.invested, currency)}` : "sem capital"
							})]
						})
					]
				}) }, platform.id);
			})
		})]
	});
}
function PlatformDetail({ platformId, onClose, onEdit, onGoMonth }) {
	const platform = useLedger((state) => state.platforms.find((item) => item.id === platformId));
	const entries = useLedger((state) => state.entries);
	const currency = useLedger((state) => state.currency);
	const deletePlatform = useLedger((state) => state.deletePlatform);
	const deleteEntry = useLedger((state) => state.deleteEntry);
	const [confirmPlatform, setConfirmPlatform] = (0, import_react.useState)(false);
	const [confirmEntry, setConfirmEntry] = (0, import_react.useState)(null);
	if (!platform) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-lg border border-line bg-card p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Esta plataforma já não existe." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			className: "mt-4",
			variant: "soft",
			onClick: onClose,
			children: "Voltar"
		})]
	});
	const snap = platformSnapshot(platform, entries);
	const rows = platformRows(platform, entries);
	const kind = PLATFORM_KINDS.find((item) => item.id === platform.kind)?.label;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onClose,
				className: "inline-flex h-11 items-center text-sm font-medium text-forest",
				children: "Voltar às plataformas"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-line bg-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KindMark, { kind: platform.kind }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "truncate font-serif text-3xl",
								children: platform.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: kind
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Investido",
								value: formatMoney(snap.invested, currency)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Valor",
								value: snap.value == null ? "—" : formatMoney(snap.value, currency)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Resultado",
								value: snap.result == null ? "—" : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedMoney, {
									value: snap.result,
									currency
								}), snap.resultRatio != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2 text-sm text-muted",
									children: formatPercent(snap.resultRatio)
								}) : null] })
							})
						]
					}),
					platform.openingInvested > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-sm text-muted",
						children: [
							"Capital inicial ",
							formatMoney(platform.openingInvested, currency),
							", antes do primeiro mês registado."
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "soft",
							onClick: onEdit,
							children: "Editar"
						}), confirmPlatform ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "danger",
							onClick: () => {
								deletePlatform(platform.id);
								onClose();
							},
							children: "Apagar plataforma"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => setConfirmPlatform(false),
							children: "Cancelar"
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => setConfirmPlatform(true),
							children: "Apagar"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductList, { platformId: platform.id }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-line bg-card px-4 py-2 sm:px-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "py-3 font-serif text-2xl",
					children: "Meses"
				}), rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "pb-4 text-sm text-muted",
					children: "Ainda não há um fim de mês nesta plataforma."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "border-t border-line py-3 first:border-t-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => onGoMonth(row.month),
								className: "font-medium text-forest",
								children: formatMonth(row.month)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm tabular-nums",
								children: ["Aporte ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedMoney, {
									value: row.contributed,
									currency
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm",
								children: ["Mercado ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedMoney, {
									value: row.market,
									currency
								})]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-serif text-xl tabular-nums",
							children: formatMoney(row.endValue, currency)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2",
						children: confirmEntry === row.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "danger",
								onClick: () => deleteEntry(row.id),
								children: "Eliminar mês"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								onClick: () => setConfirmEntry(null),
								children: "Cancelar"
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setConfirmEntry(row.id),
							className: "text-sm text-muted hover:text-loss",
							children: "Eliminar"
						})
					})]
				}, row.id)) })]
			})
		]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md bg-paper px-3 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 font-medium tabular-nums",
			children: value
		})]
	});
}
function ProductList({ platformId }) {
	const products = useLedger((state) => state.products).filter((product) => product.platformId === platformId);
	const addProduct = useLedger((state) => state.addProduct);
	const renameProduct = useLedger((state) => state.renameProduct);
	const deleteProduct = useLedger((state) => state.deleteProduct);
	const [name, setName] = (0, import_react.useState)("");
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [draft, setDraft] = (0, import_react.useState)("");
	const [confirmId, setConfirmId] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-lg border border-line bg-card p-4 sm:p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-serif text-2xl",
				children: "Produtos"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Opcional. No fecho do mês divides o aporte e o valor que ficou por produto."
			}),
			products.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 divide-y divide-line border-t border-line",
				children: products.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-col gap-2 py-3 sm:flex-row sm:items-center",
					children: [editing === product.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: draft,
						maxLength: 40,
						onChange: (event) => setDraft(event.target.value),
						className: "h-12 min-w-0 flex-1 rounded-md border border-line bg-paper px-3 text-base text-ink outline-none focus-visible:border-forest"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "min-w-0 flex-1 truncate font-medium",
						children: product.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [editing === product.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "soft",
							onClick: () => {
								if (draft.trim() === "") return;
								renameProduct(product.id, draft);
								setEditing(null);
							},
							children: "Guardar"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => {
								setEditing(product.id);
								setDraft(product.name);
							},
							children: "Mudar nome"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => confirmId === product.id ? deleteProduct(product.id) : setConfirmId(product.id),
							children: confirmId === product.id ? "Confirmar" : "Tirar"
						})]
					})]
				}, product.id))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-4 flex flex-col gap-2 sm:flex-row",
				onSubmit: (event) => {
					event.preventDefault();
					if (name.trim() === "") return;
					addProduct(platformId, name);
					setName("");
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: name,
					maxLength: 40,
					placeholder: "Nome do produto",
					onChange: (event) => setName(event.target.value),
					className: "h-12 min-w-0 flex-1 rounded-md border border-line bg-paper px-3 text-base text-ink outline-none focus-visible:border-forest"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: name.trim() === "",
					children: "Adicionar"
				})]
			})
		]
	});
}
function TablesPanel({ selectedId, onOpen, onClose, onGoMonth, onDemo }) {
	const platforms = useLedger((state) => state.platforms);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const editing = platforms.find((platform) => platform.id === editingId) ?? null;
	function addPlatform() {
		setEditingId(null);
		setOpen(true);
	}
	function editPlatform(id) {
		setEditingId(id);
		setOpen(true);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [selectedId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlatformsPanel, {
		selectedId,
		onOpen,
		onClose,
		onAdd: addPlatform,
		onEdit: editPlatform,
		onGoMonth
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Catalog, {
		onOpen,
		onAdd: addPlatform,
		onEdit: editPlatform,
		onDemo
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlatformDialog, {
		open,
		platform: editing,
		onOpenChange: (next) => {
			setOpen(next);
			if (!next) setEditingId(null);
		}
	})] });
}
function Catalog({ onOpen, onAdd, onEdit, onDemo }) {
	const platforms = useLedger((state) => state.platforms);
	const sources = useLedger((state) => state.incomeSources);
	const types = useLedger((state) => state.expenseTypes);
	const cards = useLedger((state) => state.cashbackCards);
	const currency = useLedger((state) => state.currency);
	const empty = platforms.length + sources.length + types.length + cards.length === 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-line bg-card p-4 sm:p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-2xl",
						children: "Contas"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "Crias isto uma vez: onde está o dinheiro, o que ganhas, os tipos de despesa e os cartões. No fecho só apontas os valores do mês."
					}),
					empty ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-4",
						variant: "ghost",
						onClick: onDemo,
						children: "Ver um exemplo"
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlatformTable, {
				currency,
				onOpen,
				onAdd,
				onEdit
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IncomeTable, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleTable, {
				title: "Despesas",
				hint: "Renda, alimentação, transportes.",
				placeholder: "Novo tipo",
				empty: "Ainda sem tipos.",
				rows: types,
				onAdd: (name) => useLedger.getState().addExpenseType(name),
				onRename: (id, name) => useLedger.getState().renameExpenseType(id, name),
				onDelete: (id) => useLedger.getState().deleteExpenseType(id)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleTable, {
				title: "Cartões",
				hint: "Os cartões com cashback.",
				placeholder: "Novo cartão",
				empty: "Ainda sem cartões.",
				rows: cards,
				onAdd: (name) => useLedger.getState().addCashbackCard(name),
				onRename: (id, name) => useLedger.getState().renameCashbackCard(id, name),
				onDelete: (id) => useLedger.getState().deleteCashbackCard(id)
			})
		]
	});
}
function PlatformTable({ currency, onOpen, onAdd, onEdit }) {
	const platforms = useLedger((state) => state.platforms);
	const deletePlatform = useLedger((state) => state.deletePlatform);
	const [confirmId, setConfirmId] = (0, import_react.useState)(null);
	const ranked = [...platforms].sort((a, b) => a.name.localeCompare(b.name, "pt"));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-lg border border-line bg-card p-4 sm:p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-2xl",
				children: "Plataformas"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "O capital inicial é o que já tinhas investido antes do primeiro mês."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: onAdd,
				children: "Nova"
			})]
		}), ranked.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-sm text-muted",
			children: "Ainda sem plataformas."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-4 space-y-2",
			children: ranked.map((platform) => {
				const kind = PLATFORM_KINDS.find((item) => item.id === platform.kind)?.label;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-lg border border-line p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => onOpen(platform.id),
							className: "flex min-w-0 flex-1 items-center gap-3 text-left",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KindMark, { kind: platform.kind }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate font-medium",
									children: platform.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block text-sm text-muted",
									children: [
										kind,
										" · inicial ",
										formatMoney(platform.openingInvested, currency)
									]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-11 px-2 text-sm font-medium text-forest",
							onClick: () => onEdit(platform.id),
							children: "Editar"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2",
						children: confirmId === platform.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "danger",
								onClick: () => deletePlatform(platform.id),
								children: "Apagar"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								onClick: () => setConfirmId(null),
								children: "Cancelar"
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => setConfirmId(platform.id),
							children: "Eliminar"
						})
					})]
				}, platform.id);
			})
		})]
	});
}
function IncomeTable() {
	const sources = useLedger((state) => state.incomeSources);
	const addIncomeSource = useLedger((state) => state.addIncomeSource);
	const renameIncomeSource = useLedger((state) => state.renameIncomeSource);
	const setIncomeKind = useLedger((state) => state.setIncomeKind);
	const deleteIncomeSource = useLedger((state) => state.deleteIncomeSource);
	const [name, setName] = (0, import_react.useState)("");
	const [kind, setKind] = (0, import_react.useState)("ordenado");
	const [error, setError] = (0, import_react.useState)("");
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [editingName, setEditingName] = (0, import_react.useState)("");
	const [confirmId, setConfirmId] = (0, import_react.useState)(null);
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-lg border border-line bg-card p-4 sm:p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-2xl",
				children: "Ganhos"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Ordenados e extras. O valor de cada mês fica no fecho."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid grid-cols-2 gap-1 rounded-md bg-paper-2 p-1",
				children: INCOME_KINDS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-pressed": kind === item.id,
					onClick: () => setKind(item.id),
					className: cn("h-11 rounded-md text-sm font-medium", kind === item.id ? "bg-card text-ink" : "text-muted"),
					children: item.label
				}, item.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-3 flex flex-col gap-2 sm:flex-row",
				onSubmit: (event) => {
					event.preventDefault();
					add();
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: name,
					onChange: (event) => setName(event.target.value),
					placeholder: kind === "ordenado" ? "Nome do ordenado" : "Nome do extra",
					maxLength: 40,
					className: "h-12 w-full rounded-md border border-line bg-paper px-3 text-base text-ink outline-none focus-visible:border-forest"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					children: "Adicionar"
				})]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-loss",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 space-y-2",
				children: ordered.map((source) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-lg border border-line p-3",
					children: [
						editingId === source.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "flex flex-col gap-2 sm:flex-row",
							onSubmit: (event) => {
								event.preventDefault();
								const trimmed = editingName.trim();
								if (trimmed.length < 1) return;
								renameIncomeSource(source.id, trimmed);
								setEditingId(null);
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: editingName,
									onChange: (event) => setEditingName(event.target.value),
									maxLength: 40,
									className: "h-12 w-full rounded-md border border-line bg-paper px-3 text-base text-ink outline-none focus-visible:border-forest"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									children: "Guardar"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									onClick: () => setEditingId(null),
									children: "Cancelar"
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: source.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: source.kind === "ordenado" ? "Ordenado" : "Extra"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "h-11 px-2 text-sm font-medium text-forest",
								onClick: () => {
									setEditingId(source.id);
									setEditingName(source.name);
								},
								children: "Renomear"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 grid grid-cols-2 gap-1 rounded-md bg-paper-2 p-1",
							children: INCOME_KINDS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-pressed": source.kind === item.id,
								onClick: () => setIncomeKind(source.id, item.id),
								className: cn("h-10 rounded-md text-sm font-medium", source.kind === item.id ? "bg-card text-ink" : "text-muted"),
								children: item.label
							}, item.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2",
							children: confirmId === source.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "danger",
									onClick: () => deleteIncomeSource(source.id),
									children: "Apagar"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									onClick: () => setConfirmId(null),
									children: "Cancelar"
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								onClick: () => setConfirmId(source.id),
								children: "Eliminar"
							})
						})
					]
				}, source.id))
			})
		]
	});
}
function SimpleTable({ title, hint, placeholder, empty, rows, onAdd, onRename, onDelete }) {
	const [name, setName] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [editingName, setEditingName] = (0, import_react.useState)("");
	const [confirmId, setConfirmId] = (0, import_react.useState)(null);
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-lg border border-line bg-card p-4 sm:p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-2xl",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: hint
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-4 flex flex-col gap-2 sm:flex-row",
				onSubmit: (event) => {
					event.preventDefault();
					add();
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: name,
					onChange: (event) => setName(event.target.value),
					placeholder,
					maxLength: 40,
					className: "h-12 w-full rounded-md border border-line bg-paper px-3 text-base text-ink outline-none focus-visible:border-forest"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					children: "Adicionar"
				})]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-loss",
				children: error
			}) : null,
			rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-muted",
				children: empty
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 space-y-2",
				children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-lg border border-line p-3",
					children: [editingId === row.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "flex flex-col gap-2 sm:flex-row",
						onSubmit: (event) => {
							event.preventDefault();
							const trimmed = editingName.trim();
							if (trimmed.length < 1) return;
							onRename(row.id, trimmed);
							setEditingId(null);
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: editingName,
								onChange: (event) => setEditingName(event.target.value),
								maxLength: 40,
								className: "h-12 w-full rounded-md border border-line bg-paper px-3 text-base text-ink outline-none focus-visible:border-forest"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								children: "Guardar"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								onClick: () => setEditingId(null),
								children: "Cancelar"
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: row.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-11 px-2 text-sm font-medium text-forest",
							onClick: () => {
								setEditingId(row.id);
								setEditingName(row.name);
							},
							children: "Renomear"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2",
						children: confirmId === row.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "danger",
								onClick: () => onDelete(row.id),
								children: "Apagar"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								onClick: () => setConfirmId(null),
								children: "Cancelar"
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => setConfirmId(row.id),
							children: "Eliminar"
						})
					})]
				}, row.id))
			})
		]
	});
}
var TABS = [
	{
		id: "resumo",
		label: "Resumo"
	},
	{
		id: "fecho",
		label: "Fechar"
	},
	{
		id: "contas",
		label: "Contas"
	}
];
function LastroApp() {
	const ready = useLedger((state) => state.ready);
	const syncError = useLedger((state) => state.syncError);
	const saving = useLedger((state) => state.saving);
	const savedAt = useLedger((state) => state.savedAt);
	const conflictAt = useLedger((state) => state.conflictAt);
	const overwriteRemote = useLedger((state) => state.overwriteRemote);
	const takeRemote = useLedger((state) => state.takeRemote);
	const deviceDemo = useLedger((state) => state.deviceDemo);
	const dismissDeviceDemo = useLedger((state) => state.dismissDeviceDemo);
	const retryLoad = useLedger((state) => state.retryLoad);
	const platforms = useLedger((state) => state.platforms);
	const entries = useLedger((state) => state.entries);
	const expenseTypes = useLedger((state) => state.expenseTypes);
	const expenses = useLedger((state) => state.expenses);
	const cashbackCards = useLedger((state) => state.cashbackCards);
	const cashbacks = useLedger((state) => state.cashbacks);
	const incomeSources = useLedger((state) => state.incomeSources);
	const incomes = useLedger((state) => state.incomes);
	const demo = useLedger((state) => state.demo);
	const currency = useLedger((state) => state.currency);
	const closingDay = useLedger((state) => state.closingDay);
	const keepDemo = useLedger((state) => state.keepDemo);
	const reset = useLedger((state) => state.reset);
	const loadDemo = useLedger((state) => state.loadDemo);
	const remote = useLedger((state) => state.remote);
	const [tab, setTab] = (0, import_react.useState)("resumo");
	const [month, setMonth] = (0, import_react.useState)(() => dueMonth(1));
	const monthTouched = (0, import_react.useRef)(false);
	const routedEmpty = (0, import_react.useRef)(false);
	const scrollTo = (0, import_react.useRef)(null);
	const [platformId, setPlatformId] = (0, import_react.useState)(null);
	const [settingsOpen, setSettingsOpen] = (0, import_react.useState)(false);
	const empty = platforms.length === 0 && expenseTypes.length === 0 && cashbackCards.length === 0 && incomeSources.length === 0;
	(0, import_react.useEffect)(() => {
		if (ready && !monthTouched.current) setMonth(dueMonth(closingDay));
	}, [ready, closingDay]);
	(0, import_react.useEffect)(() => {
		if (!ready || routedEmpty.current) return;
		routedEmpty.current = true;
		if (empty) setTab("contas");
	}, [ready, empty]);
	(0, import_react.useEffect)(() => {
		if (tab !== "fecho" || !scrollTo.current) return;
		const id = scrollTo.current;
		scrollTo.current = null;
		document.getElementById(id)?.scrollIntoView({
			behavior: "smooth",
			block: "start"
		});
	}, [tab]);
	function changeMonth(next) {
		monthTouched.current = true;
		setMonth(next);
	}
	function openTables() {
		setPlatformId(null);
		setTab("contas");
	}
	function openClose(anchor = "fecho-investimentos") {
		if (tab === "fecho") {
			document.getElementById(anchor)?.scrollIntoView({
				behavior: "smooth",
				block: "start"
			});
			return;
		}
		scrollTo.current = anchor;
		setTab("fecho");
	}
	const monthClosed = platforms.length + incomeSources.length + expenseTypes.length + cashbackCards.length > 0 && platforms.every((platform) => entryFor(entries, platform.id, month)) && incomeSources.every((source) => incomeFor(incomes, source.id, month)) && expenseTypes.every((type) => expenseFor(expenses, type.id, month)) && cashbackCards.every((card) => cashbackFor(cashbacks, card.id, month));
	const saveLabel = conflictAt != null ? "Por guardar" : saving ? "A guardar…" : savedAt != null ? formatSavedAt(savedAt) : "";
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-dvh",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto w-full max-w-sm px-4 pt-16",
			children: syncError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-3xl",
					children: "Não abri a caderneta"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted",
					children: syncError
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: retryLoad,
					className: "mt-6 h-12 rounded-md bg-forest px-4 text-sm font-medium text-card",
					children: "Tentar outra vez"
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-40 animate-pulse rounded-md bg-paper-2" })
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto w-full max-w-5xl px-4 pt-6 pb-16 sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-w-0 items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-12 w-12 shrink-0 place-items-center rounded-md bg-forest font-serif text-2xl text-card",
							children: "L"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "font-serif text-2xl leading-none",
									children: "Lastro"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted",
									children: "O que investes, o que fica e o que gastas"
								}),
								saveLabel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted",
									children: saveLabel
								}) : null
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setSettingsOpen(true),
						"aria-label": "Definições",
						className: "inline-flex h-12 items-center gap-2 rounded-md bg-chip px-3 text-sm font-medium text-ink",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, {
							className: "size-4",
							"aria-hidden": "true"
						}), currency]
					})]
				}),
				syncError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 rounded-md bg-loss-soft px-4 py-3 text-sm text-loss",
					children: syncError
				}) : null,
				conflictAt != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 rounded-md bg-brass-soft px-4 py-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"A caderneta mudou noutro aparelho ",
						formatWhen(conflictAt),
						". O que está neste ecrã ainda não substituiu essa versão."
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: overwriteRemote,
							children: "Ficar com este ecrã"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "soft",
							onClick: takeRemote,
							children: "Trazer o outro aparelho"
						})]
					})]
				}) : null,
				demo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-col gap-3 rounded-lg bg-brass-soft px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm",
						children: "Isto é um exemplo, não são os teus números."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "soft",
							onClick: keepDemo,
							children: "Ficar com estes dados"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: reset,
							children: "Apagar"
						})]
					})]
				}) : null,
				deviceDemo && !demo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-col gap-3 rounded-lg bg-brass-soft px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm",
						children: "Neste dispositivo há um exemplo. Não o trouxe para esta conta."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "soft",
							onClick: loadDemo,
							children: "Usar o exemplo"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: dismissDeviceDemo,
							children: "Ignorar"
						})]
					})]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					role: "tablist",
					"aria-label": "Secções",
					className: "mt-6 flex flex-wrap gap-1 rounded-md bg-paper-2 p-1",
					children: TABS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						role: "tab",
						"aria-selected": tab === item.id,
						onClick: () => {
							setTab(item.id);
							if (item.id !== "contas") setPlatformId(null);
						},
						className: cn("h-11 min-w-24 flex-1 rounded-md px-2 text-xs font-medium sm:text-sm", tab === item.id ? "bg-card text-ink" : "text-muted"),
						children: item.label
					}, item.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted",
					children: monthClosed ? `${formatMonth(month)} está fechado.` : isClosingToday(closingDay) ? `Hoje é o dia de atualizar. Este fecho é ${formatCloseDay(month, closingDay)}.` : `Atualizas sempre no dia ${closingDay}. Este fecho é ${formatCloseDay(month, closingDay)}.`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4",
					children: [
						tab === "resumo" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryView, {
							month,
							onMonth: changeMonth,
							onRegister: () => openClose("fecho-investimentos"),
							onExpenses: () => openClose("fecho-despesas"),
							onCashback: () => openClose("fecho-cartoes"),
							onIncome: () => openClose("fecho-ganhos"),
							onOpenPlatform: (id) => {
								setPlatformId(id);
								setTab("contas");
							}
						}) : null,
						tab === "fecho" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloseView, {
							month,
							onMonth: changeMonth,
							onSetup: openTables
						}) : null,
						tab === "contas" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TablesPanel, {
							selectedId: platformId,
							onOpen: setPlatformId,
							onClose: () => setPlatformId(null),
							onGoMonth: (next) => {
								changeMonth(next);
								openClose();
							},
							onDemo: () => {
								loadDemo();
								setTab("resumo");
								monthTouched.current = false;
								setMonth(dueMonth(25));
							}
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-10 text-sm text-muted",
					children: remote ? "Os números ficam no PostgreSQL. Nas definições podes exportar uma cópia." : "Os números ficam neste dispositivo. Nas definições podes exportar uma cópia."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsDialog, {
			open: settingsOpen,
			onOpenChange: setSettingsOpen
		})]
	});
}
var BEARER_KEY = "grok-auth.bearer-token";
function rememberSession(token) {
	if (!token) return;
	try {
		window.sessionStorage.setItem(BEARER_KEY, token);
	} catch {}
}
function failureMessage(creating, raw) {
	const message = raw.toLowerCase();
	if (message.includes("origin")) return "Este endereço não deixa entrar. Abre a aplicação em http://localhost:8080, na própria máquina.";
	if (creating && message.includes("exist")) return "Já existe uma conta com este email. Entra com ela.";
	return creating ? "Não consegui criar a conta. Confirma o email e uma palavra-passe com 8 caracteres." : "Email ou palavra-passe não batem certo.";
}
function AccountGate() {
	const [creating, setCreating] = (0, import_react.useState)(true);
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(false);
	async function submit(event) {
		event.preventDefault();
		setError("");
		if (!email.includes("@")) {
			setError("Indica um email válido.");
			return;
		}
		if (password.length < 8) {
			setError("A palavra-passe precisa de pelo menos 8 caracteres.");
			return;
		}
		setPending(true);
		let token = null;
		try {
			const payload = {
				email: email.trim(),
				password,
				fetchOptions: { onSuccess(ctx) {
					token = ctx.response.headers.get("set-auth-token");
				} }
			};
			const result = creating ? await authClient.signUp.email({
				...payload,
				name: name.trim() || email.trim()
			}) : await authClient.signIn.email(payload);
			if (result.error || !result.data?.user) {
				setPending(false);
				setError(failureMessage(creating, result.error?.message ?? ""));
				return;
			}
			rememberSession(token);
			window.location.assign("/");
		} catch {
			setPending(false);
			setError("Não consegui falar com o servidor. Tenta outra vez.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center px-4 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-12 w-12 place-items-center rounded-md bg-forest font-serif text-2xl text-card",
					children: "L"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 font-serif text-3xl leading-none",
					children: creating ? "Criar conta" : "Entrar"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted",
					children: "A caderneta fica no PostgreSQL deste servidor. Cada conta vê só os seus números."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-6 space-y-3",
					onSubmit: (event) => void submit(event),
					children: [
						creating ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mb-1.5 block text-sm font-medium",
								children: "Nome"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: name,
								onChange: (event) => setName(event.target.value),
								autoComplete: "name",
								className: inputClassName()
							})]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mb-1.5 block text-sm font-medium",
								children: "Email"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "email",
								value: email,
								onChange: (event) => setEmail(event.target.value),
								autoComplete: "email",
								required: true,
								className: inputClassName()
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mb-1.5 block text-sm font-medium",
								children: "Palavra-passe"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "password",
								value: password,
								onChange: (event) => setPassword(event.target.value),
								autoComplete: creating ? "new-password" : "current-password",
								required: true,
								className: inputClassName()
							})]
						}),
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-loss",
							children: error
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "w-full",
							disabled: pending,
							children: pending ? "A entrar…" : creating ? "Criar conta" : "Entrar"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "mt-4 h-11 text-sm font-medium text-forest",
					onClick: () => {
						setCreating((value) => !value);
						setError("");
					},
					children: creating ? "Já tenho conta" : "Ainda não tenho conta"
				})
			]
		})
	});
}
var LEGACY_KEY = "lastro-ledger-v1";
function readLegacyEnvelope() {
	if (typeof window === "undefined") return null;
	try {
		const raw = window.localStorage.getItem(LEGACY_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		const state = parsed?.state;
		if (!state || typeof state !== "object") return null;
		const result = parseBackup({
			version: 1,
			currency: state.currency,
			monthlyGoal: state.monthlyGoal ?? null,
			fireGoal: state.fireGoal ?? null,
			closingDay: state.closingDay ?? 1,
			platforms: state.platforms ?? [],
			entries: state.entries ?? [],
			products: state.products ?? [],
			productEntries: state.productEntries ?? [],
			expenseTypes: state.expenseTypes ?? [],
			expenses: state.expenses ?? [],
			cashbackCards: state.cashbackCards ?? [],
			cashbacks: state.cashbacks ?? [],
			incomeSources: state.incomeSources ?? [],
			incomes: state.incomes ?? [],
			demo: state.demo === true
		});
		if (typeof result === "string") return null;
		if (result.platforms.length === 0 && result.entries.length === 0 && result.expenseTypes.length === 0 && result.expenses.length === 0 && result.cashbackCards.length === 0 && result.cashbacks.length === 0 && result.incomeSources.length === 0 && result.incomes.length === 0 && result.monthlyGoal == null && result.fireGoal == null) return null;
		return {
			data: result,
			savedAt: typeof parsed.savedAt === "number" && Number.isFinite(parsed.savedAt) ? parsed.savedAt : null
		};
	} catch {
		return null;
	}
}
function LocalLedger() {
	const loadAttempt = useLedger((state) => state.loadAttempt);
	const ready = useLedger((state) => state.ready);
	(0, import_react.useLayoutEffect)(() => {
		const found = readLegacyEnvelope();
		useLedger.getState().adopt(found?.data ?? null);
		if (found?.savedAt != null) useLedger.setState({ savedAt: found.savedAt });
	}, [loadAttempt]);
	(0, import_react.useEffect)(() => {
		if (!ready) return;
		let seen = JSON.stringify(selectData(useLedger.getState()));
		const persist = () => {
			const data = selectData(useLedger.getState());
			const payload = JSON.stringify(data);
			if (payload === seen) return;
			seen = payload;
			const savedAt = Date.now();
			try {
				window.localStorage.setItem(LEGACY_KEY, JSON.stringify({
					state: data,
					savedAt
				}));
				useLedger.setState({
					syncError: null,
					savedAt
				});
			} catch {
				useLedger.setState({ syncError: "Não consegui guardar neste dispositivo." });
			}
		};
		return useLedger.subscribe(persist);
	}, [ready]);
	return null;
}
function PostgresLedger() {
	const loadAttempt = useLedger((state) => state.loadAttempt);
	(0, import_react.useEffect)(() => {
		let stop = false;
		let unsub = () => {};
		let timer = 0;
		let writing = false;
		let dirty = false;
		let applying = false;
		let conflicted = false;
		let forceNext = false;
		let last = "";
		let seen = "";
		let retries = 0;
		let expected = null;
		const snapshot = () => JSON.stringify(selectData(useLedger.getState()));
		const flush = () => {
			if (stop || applying || conflicted) return;
			if (writing) {
				dirty = true;
				return;
			}
			const payload = snapshot();
			const force = forceNext;
			forceNext = false;
			writing = true;
			dirty = false;
			useLedger.setState({ saving: true });
			saveLedger({ data: {
				ledger: toBackup(JSON.parse(payload)),
				expectedUpdatedAt: expected,
				force
			} }).then((result) => {
				if (stop) return;
				writing = false;
				if (!result.ok) {
					conflicted = true;
					useLedger.setState({
						saving: false,
						syncError: null,
						conflictAt: result.updatedAt
					});
					return;
				}
				last = payload;
				expected = result.updatedAt;
				retries = 0;
				useLedger.setState({
					saving: false,
					syncError: null,
					savedAt: result.updatedAt,
					conflictAt: null
				});
				if (dirty || snapshot() !== last) flush();
			}).catch((err) => {
				if (stop) return;
				writing = false;
				retries += 1;
				const detail = err instanceof Error ? err.message.slice(0, 180) : "";
				useLedger.setState({
					saving: false,
					syncError: detail ? `Não consegui guardar na base de dados. ${detail}` : "Não consegui guardar na base de dados."
				});
				if (retries >= 3) return;
				window.clearTimeout(timer);
				timer = window.setTimeout(() => {
					if (!stop && snapshot() !== last) flush();
				}, 1200);
			});
		};
		const schedule = () => {
			window.clearTimeout(timer);
			timer = window.setTimeout(flush, 250);
		};
		const reloadRemote = async () => {
			applying = true;
			window.clearTimeout(timer);
			try {
				const remote = await loadLedger();
				if (stop) return;
				useLedger.getState().adopt(remote.data);
				expected = remote.updatedAt;
				last = snapshot();
				seen = last;
				conflicted = false;
				useLedger.setState({
					savedAt: remote.updatedAt,
					conflictAt: null,
					syncError: null,
					saving: false
				});
			} catch (err) {
				if (stop) return;
				const detail = err instanceof Error ? err.message.slice(0, 180) : "";
				useLedger.setState({
					saving: false,
					syncError: detail ? `Não consegui ler a caderneta na base de dados. ${detail}` : "Não consegui ler a caderneta na base de dados."
				});
			} finally {
				applying = false;
			}
		};
		(async () => {
			useLedger.getState().setRemote(true);
			useLedger.getState().prepareAccount();
			try {
				const remote = await loadLedger();
				if (stop) return;
				const local = readLegacyEnvelope();
				const bring = remote.data ?? (local && !local.data.demo ? local.data : null);
				useLedger.getState().adopt(bring);
				if (stop) return;
				expected = remote.updatedAt;
				if (!remote.data && local?.data.demo) useLedger.setState({ deviceDemo: true });
				if (remote.updatedAt != null) useLedger.setState({ savedAt: remote.updatedAt });
				last = snapshot();
				seen = last;
				unsub = useLedger.subscribe(() => {
					if (stop || applying) return;
					const choice = useLedger.getState().pendingSync;
					if (choice === "reload") {
						useLedger.setState({ pendingSync: null });
						reloadRemote();
						return;
					}
					if (choice === "overwrite") {
						useLedger.setState({
							pendingSync: null,
							conflictAt: null
						});
						conflicted = false;
						forceNext = true;
						flush();
						return;
					}
					const next = snapshot();
					if (next === seen) return;
					seen = next;
					retries = 0;
					if (conflicted) return;
					schedule();
				});
				if (!remote.data && bring) schedule();
			} catch (err) {
				if (stop) return;
				const detail = err instanceof Error ? err.message : "";
				useLedger.getState().failLoad(detail ? `Não consegui ler a caderneta na base de dados. ${detail}` : "Não consegui ler a caderneta na base de dados.");
			}
		})();
		const onHide = () => {
			if (document.visibilityState === "hidden") flush();
		};
		document.addEventListener("visibilitychange", onHide);
		return () => {
			stop = true;
			unsub();
			window.clearTimeout(timer);
			document.removeEventListener("visibilitychange", onHide);
		};
	}, [loadAttempt]);
	return null;
}
function LedgerHost({ initial }) {
	const backend = initial.mode === "postgres" && initial.authOff ? "blocked" : initial.mode;
	if (backend === "blocked") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "max-w-sm text-sm text-muted",
			children: "O PostgreSQL está ligado, mas a entrada está desligada. No Ubuntu, define VITE_AUTH_ENABLED=true antes de arrancar a aplicação."
		})
	});
	if (backend === "local") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocalLedger, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LastroApp, {})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PostgresApp, {});
}
function PostgresApp() {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "A abrir a caderneta…"
		})
	});
	if (!user || user.isDevFallback) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountGate, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PostgresLedger, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LastroApp, {})] });
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LedgerHost, { initial: Route$2.useLoaderData() });
}
//#endregion
export { Home as component };
