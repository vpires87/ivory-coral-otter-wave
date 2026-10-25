import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as Settings, c as ChevronRight, d as Bitcoin, i as Shapes, l as ChevronLeft, n as Wallet, o as PiggyBank, s as Landmark, t as X, u as ChartLine } from "../_libs/lucide-react.mjs";
import { n as parse, r as format, t as pt } from "../_libs/date-fns.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { a as DialogOverlay, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { a as Line, c as Tooltip, i as Area, n as YAxis, o as CartesianGrid, r as XAxis, s as ResponsiveContainer, t as ComposedChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BcVfxkp5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cents(n) {
	return Math.round(n * 100) / 100;
}
function currentMonth(now = /* @__PURE__ */ new Date()) {
	return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
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
	return {
		currency: data.currency,
		platforms,
		entries,
		demo: false
	};
}
function toBackup(data) {
	return {
		version: 1,
		app: "lastro",
		exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
		currency: data.currency,
		platforms: data.platforms,
		entries: data.entries
	};
}
var platforms = [
	{
		id: "demo-xtb",
		name: "XTB",
		kind: "corretora",
		openingInvested: 4200
	},
	{
		id: "demo-tr",
		name: "Trade Republic",
		kind: "corretora",
		openingInvested: 1500
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
		openingInvested: 800
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
function demoLedger() {
	return {
		platforms: platforms.map((platform) => ({ ...platform })),
		entries: entries.map((entry) => ({ ...entry })),
		currency: "EUR",
		demo: true
	};
}
var empty = {
	platforms: [],
	entries: [],
	currency: "EUR",
	demo: false
};
function memoryStorage() {
	const jar = /* @__PURE__ */ new Map();
	return {
		get length() {
			return jar.size;
		},
		clear: () => jar.clear(),
		getItem: (key) => jar.get(key) ?? null,
		key: (index) => [...jar.keys()][index] ?? null,
		removeItem: (key) => {
			jar.delete(key);
		},
		setItem: (key, value) => {
			jar.set(key, value);
		}
	};
}
var useLedger = create()(persist((set) => ({
	...empty,
	hydrated: false,
	setCurrency: (currency) => set({ currency }),
	addPlatform: (draft) => {
		const id = crypto.randomUUID();
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
		entries: state.entries.filter((entry) => entry.platformId !== id)
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
			id: crypto.randomUUID(),
			platformId: input.platformId,
			month: input.month,
			...next
		}] };
	}),
	deleteEntry: (id) => set((state) => ({ entries: state.entries.filter((entry) => entry.id !== id) })),
	loadDemo: () => set(demoLedger()),
	keepDemo: () => set({ demo: false }),
	reset: () => set(empty),
	importData: (raw) => {
		const parsed = parseBackup(raw);
		if (typeof parsed === "string") return parsed;
		set(parsed);
		return null;
	}
}), {
	name: "lastro-ledger-v1",
	storage: createJSONStorage(() => typeof window === "undefined" ? memoryStorage() : localStorage),
	skipHydration: true,
	partialize: (state) => ({
		platforms: state.platforms,
		entries: state.entries,
		currency: state.currency,
		demo: state.demo
	})
}));
function selectData(state) {
	return {
		platforms: state.platforms,
		entries: state.entries,
		currency: state.currency,
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
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
			label: "Investido",
			amount: invested,
			max,
			currency,
			tone: "brass"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
			label: "Valor",
			amount: value,
			max,
			currency,
			tone: "forest"
		})]
	});
}
function Bar({ label, amount, max, currency, tone }) {
	const width = max === 0 ? 0 : Math.min(100, amount / max * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-1 flex items-baseline justify-between gap-3 text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "tabular-nums font-medium",
			children: formatMoney(amount, currency)
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-2 overflow-hidden rounded-full bg-chip",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("h-full rounded-full", tone === "forest" ? "bg-forest" : "bg-brass"),
			style: { width: `${width}%` }
		})
	})] });
}
function Sheet({ open, onOpenChange, title, description, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-40 bg-ink/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
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
	const hasData = useLedger((state) => state.platforms.length > 0 || state.entries.length > 0);
	const fileRef = (0, import_react.useRef)(null);
	const [message, setMessage] = (0, import_react.useState)("");
	const [confirmWipe, setConfirmWipe] = (0, import_react.useState)(false);
	const [confirmDemo, setConfirmDemo] = (0, import_react.useState)(false);
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
		description: "A caderneta fica neste browser. Exporta uma cópia se mudares de aparelho.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-5",
			children: [
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
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Isto apaga plataformas e meses neste browser. Não dá para desfazer." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
				}) : null
			]
		})
	});
}
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
function entryFor(entries, platformId, month) {
	return entries.find((entry) => entry.platformId === platformId && entry.month === month) ?? null;
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
function MonthPanel({ month, onMonth, onAddPlatform }) {
	const platforms = useLedger((state) => state.platforms);
	const entries = useLedger((state) => state.entries);
	const currency = useLedger((state) => state.currency);
	const upsertEntry = useLedger((state) => state.upsertEntry);
	const deleteEntry = useLedger((state) => state.deleteEntry);
	const [drafts, setDrafts] = (0, import_react.useState)(() => initialDrafts(platforms, entries, month));
	const [errors, setErrors] = (0, import_react.useState)({});
	const [confirmId, setConfirmId] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		setDrafts(initialDrafts(platforms, entries, month));
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
	if (platforms.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-lg border border-line bg-card p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-2xl",
				children: "Ainda não há plataformas"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Cria a primeira e depois apontas o mês."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-4",
				onClick: onAddPlatform,
				children: "Adicionar plataforma"
			})
		]
	});
	const ordered = [...platforms].sort((a, b) => {
		const aSaved = entryFor(entries, a.id, month) != null;
		if (aSaved !== (entryFor(entries, b.id, month) != null)) return aSaved ? 1 : -1;
		return a.name.localeCompare(b.name, "pt");
	});
	const recorded = platforms.filter((platform) => entryFor(entries, platform.id, month)).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-lg border border-line bg-card p-4 sm:p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthSwitcher, {
				month,
				onChange: onMonth
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm text-muted",
				children: [
					recorded,
					" de ",
					platforms.length,
					" plataformas neste mês. O aporte é o que entrou ou saiu. O valor é o que a plataforma mostrava no fim do mês."
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "grid gap-3 lg:grid-cols-2",
			children: ordered.map((platform) => {
				const draft = drafts[platform.id] ?? {
					contributed: "",
					endValue: ""
				};
				const saved = entryFor(entries, platform.id, month);
				const previous = previousEntry(entries, platform.id, month);
				const contributed = parseAmount(draft.contributed);
				const endValue = parseAmount(draft.endValue);
				const dirty = saved ? contributed !== saved.contributed || endValue !== saved.endValue : draft.contributed.trim() !== "" || draft.endValue.trim() !== "";
				const kind = PLATFORM_KINDS.find((item) => item.id === platform.kind)?.label;
				const market = saved && !dirty ? previous ? cents(saved.endValue - previous.endValue - saved.contributed) : cents(saved.endValue - (platform.openingInvested + saved.contributed)) : null;
				function update(patch) {
					setDrafts((current) => ({
						...current,
						[platform.id]: {
							...draft,
							...patch
						}
					}));
				}
				function save() {
					if (draft.contributed.trim() === "" || contributed == null) {
						setErrors((current) => ({
							...current,
							[platform.id]: "Indica o aporte. Se não meteste dinheiro, escreve 0."
						}));
						return;
					}
					if (draft.endValue.trim() === "" || endValue == null) {
						setErrors((current) => ({
							...current,
							[platform.id]: "Indica o valor que ficou no fim do mês."
						}));
						return;
					}
					if (endValue < 0) {
						setErrors((current) => ({
							...current,
							[platform.id]: "O valor no fim do mês não pode ser negativo."
						}));
						return;
					}
					upsertEntry({
						platformId: platform.id,
						month,
						contributed,
						endValue
					});
					setDrafts((current) => ({
						...current,
						[platform.id]: {
							contributed: formatPlain(contributed),
							endValue: formatPlain(endValue)
						}
					}));
					setErrors((current) => ({
						...current,
						[platform.id]: ""
					}));
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
									children: [kind, saved && !dirty ? " · registado" : dirty ? " · por guardar" : " · por registar"]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
								previous ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "soft",
									onClick: () => update({
										contributed: draft.contributed.trim() === "" ? formatPlain(0) : draft.contributed,
										endValue: formatPlain(previous.endValue)
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
								children: ["Aporte ", formatMoney(row.contributed, currency, { sign: true })]
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
											children: ["Aporte ", formatMoney(point.contributed, currency, { sign: true })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "tabular-nums",
											children: ["Mercado ", formatMoney(point.market, currency, { sign: true })]
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
			points.some((point) => point.recorded === 0) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: "Meses sem atualização repetem o último valor conhecido de cada plataforma."
			}) : null
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
function SummaryView({ month, onMonth, onRegister, onOpenPlatform }) {
	const platforms = useLedger((state) => state.platforms);
	const entries = useLedger((state) => state.entries);
	const currency = useLedger((state) => state.currency);
	const series = buildSeries(platforms, entries);
	const snapshot = totals(platforms, entries);
	const focus = pointFor(series, month);
	const years = yearlyRollup(series);
	const ranked = platforms.map((platform) => ({
		platform,
		snap: platformSnapshot(platform, entries)
	})).sort((a, b) => (b.snap.value ?? -1) - (a.snap.value ?? -1));
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
							snapshot.resultRatio != null ? ` · ${formatPercent(snapshot.resultRatio)}` : ""
						]
					}) : null,
					snapshot.withValue > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompareBars, {
						invested: snapshot.invested,
						value: snapshot.value,
						currency
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-line bg-card p-4 sm:p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthSwitcher, {
						month,
						onChange: onMonth
					}),
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-4 w-full sm:w-auto",
						onClick: onRegister,
						children: "Registar este mês"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ValueChart, {
				points: series,
				currency
			}),
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
			})] }) : null
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
function story(snapshot, currency) {
	if (snapshot.withValue === 0) return "Quando registares o primeiro fim de mês, comparas aqui o que meteste com o que ficou.";
	const invested = formatMoney(snapshot.invested, currency);
	if (snapshot.result > 0) return `Investiste ${invested}. Ficou ${formatMoney(snapshot.result, currency)} acima do que meteste.`;
	if (snapshot.result < 0) return `Investiste ${invested}. Ficou ${formatMoney(Math.abs(snapshot.result), currency)} abaixo do que meteste.`;
	return `Investiste ${invested}, e a carteira vale o mesmo.`;
}
function monthStory(focus, platformCount, currency) {
	if (!focus || focus.recorded === 0) return "Este mês ainda não tem registos. Em cada plataforma, indica o aporte e o valor no fim do mês.";
	return `Neste mês ${focus.contributed === 0 ? "não houve aportes" : focus.contributed > 0 ? `entraram ${formatMoney(focus.contributed, currency)}` : `saíram ${formatMoney(Math.abs(focus.contributed), currency)}`} e ${focus.market === 0 ? "o mercado não mexeu o saldo" : focus.market > 0 ? `o mercado somou ${formatMoney(focus.market, currency)}` : `o mercado tirou ${formatMoney(Math.abs(focus.market), currency)}`}.${focus.recorded < platformCount ? ` ${focus.recorded} de ${platformCount} plataformas.` : ""}`;
}
var TABS = [
	{
		id: "resumo",
		label: "Resumo"
	},
	{
		id: "mes",
		label: "Mês"
	},
	{
		id: "plataformas",
		label: "Plataformas"
	}
];
function LastroApp() {
	usePersist();
	const platforms = useLedger((state) => state.platforms);
	const demo = useLedger((state) => state.demo);
	const currency = useLedger((state) => state.currency);
	const keepDemo = useLedger((state) => state.keepDemo);
	const reset = useLedger((state) => state.reset);
	const loadDemo = useLedger((state) => state.loadDemo);
	const [tab, setTab] = (0, import_react.useState)("resumo");
	const [month, setMonth] = (0, import_react.useState)(currentMonth);
	const [platformId, setPlatformId] = (0, import_react.useState)(null);
	const [platformOpen, setPlatformOpen] = (0, import_react.useState)(false);
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [settingsOpen, setSettingsOpen] = (0, import_react.useState)(false);
	const editing = platforms.find((platform) => platform.id === editingId) ?? null;
	const empty = platforms.length === 0;
	function openCreate() {
		setEditingId(null);
		setPlatformOpen(true);
	}
	function openEdit(id) {
		setEditingId(id);
		setPlatformOpen(true);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "font-serif text-2xl leading-none",
									children: "Lastro"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted",
									children: "O que investes e o que fica"
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setSettingsOpen(true),
							"aria-label": "Definições e moeda",
							className: "inline-flex h-12 items-center gap-2 rounded-md bg-chip px-3 text-sm font-medium text-ink",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, {
								className: "size-4",
								"aria-hidden": "true"
							}), currency]
						})]
					}),
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
					empty ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyLedger, {
						onAdd: openCreate,
						onDemo: () => {
							loadDemo();
							setTab("resumo");
						}
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						role: "tablist",
						"aria-label": "Secções",
						className: "mt-6 grid grid-cols-3 gap-1 rounded-md bg-paper-2 p-1",
						children: TABS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							role: "tab",
							"aria-selected": tab === item.id,
							onClick: () => {
								setTab(item.id);
								if (item.id !== "plataformas") setPlatformId(null);
							},
							className: cn("h-11 rounded-md text-sm font-medium", tab === item.id ? "bg-card text-ink" : "text-muted"),
							children: item.label
						}, item.id))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4",
						children: [
							tab === "resumo" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryView, {
								month,
								onMonth: setMonth,
								onRegister: () => setTab("mes"),
								onOpenPlatform: (id) => {
									setPlatformId(id);
									setTab("plataformas");
								}
							}) : null,
							tab === "mes" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthPanel, {
								month,
								onMonth: setMonth,
								onAddPlatform: openCreate
							}) : null,
							tab === "plataformas" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlatformsPanel, {
								selectedId: platformId,
								onOpen: setPlatformId,
								onClose: () => setPlatformId(null),
								onAdd: openCreate,
								onEdit: openEdit,
								onGoMonth: (next) => {
									setMonth(next);
									setTab("mes");
								}
							}) : null
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-10 text-sm text-muted",
						children: "Os números ficam neste browser, neste aparelho. Nas definições podes exportar uma cópia."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlatformDialog, {
				open: platformOpen,
				platform: editing,
				onOpenChange: (open) => {
					setPlatformOpen(open);
					if (!open) setEditingId(null);
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsDialog, {
				open: settingsOpen,
				onOpenChange: setSettingsOpen
			})
		]
	});
}
function EmptyLedger({ onAdd, onDemo }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-8 rounded-lg border border-line bg-card px-5 py-8 sm:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-3xl sm:text-4xl",
				children: "Cada mês, duas perguntas."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-xl text-base leading-relaxed text-muted",
				children: "Quanto meteste em cada plataforma — e quanto é que lá ficou no fim do mês. O ganho, a perda e o que foi mercado calculam-se sozinhos."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
				className: "mt-6 max-w-xl space-y-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-serif text-forest",
							children: "01"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Crias as plataformas: corretora, banco, PPR, cripto." })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-serif text-forest",
							children: "02"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "No fim do mês, apontas o aporte e o valor que ficou." })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-serif text-forest",
							children: "03"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Vês o que investiste ao lado do que a carteira vale." })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-col gap-3 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: onAdd,
					children: "Adicionar plataforma"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "soft",
					onClick: onDemo,
					children: "Ver um exemplo"
				})]
			})
		]
	});
}
function usePersist() {
	(0, import_react.useEffect)(() => {
		Promise.resolve(useLedger.persist.rehydrate());
	}, []);
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LastroApp, {});
}
//#endregion
export { Home as component };
