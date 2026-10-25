import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as signOut, r as signIn } from "./client-IWHfIGH2.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as DialogOverlay, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { a as hasGateSessionMarker, t as GROK_PROVIDERS } from "./server-DVgSAzeK.mjs";
import { n as useCurrentUser, r as useCurrentUserState, t as AccountGate } from "./use-current-user-CmPHZtz3.mjs";
import { _ as parseAmount, a as clampClosingDay, b as toBackup, c as eachMonth, d as formatMoney, f as formatMonth, g as isClosingToday, h as formatShare, i as cents, l as formatCloseDay, m as formatPlain, n as PLATFORM_KINDS, o as currentMonth, p as formatPercent, r as authMiddleware, s as dueMonth, t as CURRENCIES, u as formatCompact, v as parseBackup, y as shiftMonth } from "./backup-CGc3vTvo.mjs";
import { a as Settings, c as ChevronRight, d as Bitcoin, i as Shapes, l as ChevronLeft, n as Wallet, o as PiggyBank, s as Landmark, t as X, u as ChartLine } from "../_libs/lucide-react.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { a as Area, c as Bar, d as Tooltip, i as XAxis, l as Cell, n as BarChart, o as Line, r as YAxis, s as CartesianGrid, t as ComposedChart, u as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DFZYctTA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
function demoLedger() {
	return {
		platforms: platforms.map((platform) => ({ ...platform })),
		entries: entries.map((entry) => ({ ...entry })),
		expenseTypes: expenseTypes.map((type) => ({ ...type })),
		expenses: expenses.map((entry) => ({ ...entry })),
		cashbackCards: cashbackCards.map((card) => ({ ...card })),
		cashbacks: cashbacks.map((entry) => ({ ...entry })),
		currency: "EUR",
		monthlyGoal: 650,
		fireGoal: 5e4,
		closingDay: 25,
		demo: true
	};
}
var empty = {
	platforms: [],
	entries: [],
	expenseTypes: [],
	expenses: [],
	cashbackCards: [],
	cashbacks: [],
	currency: "EUR",
	monthlyGoal: null,
	fireGoal: null,
	closingDay: 1,
	demo: false
};
var useLedger = create()((set) => ({
	...empty,
	ready: false,
	saving: false,
	syncError: null,
	loadAttempt: 0,
	setCurrency: (currency) => set({ currency }),
	setMonthlyGoal: (goal) => set({ monthlyGoal: goal == null || goal <= 0 ? null : cents(goal) }),
	setFireGoal: (goal) => set({ fireGoal: goal == null || goal <= 0 ? null : cents(goal) }),
	setClosingDay: (day) => set({ closingDay: clampClosingDay(day) }),
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
	addExpenseType: (name) => {
		const id = crypto.randomUUID();
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
			id: crypto.randomUUID(),
			typeId: input.typeId,
			month: input.month,
			amount
		}] };
	}),
	addCashbackCard: (name) => {
		const id = crypto.randomUUID();
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
			id: crypto.randomUUID(),
			cardId: input.cardId,
			month: input.month,
			amount
		}] };
	}),
	loadDemo: () => set({
		...demoLedger(),
		ready: true
	}),
	keepDemo: () => set({ demo: false }),
	reset: () => set({
		...empty,
		ready: true
	}),
	importData: (raw) => {
		const parsed = parseBackup(raw);
		if (typeof parsed === "string") return parsed;
		set({
			...parsed,
			ready: true
		});
		return null;
	},
	prepareAccount: () => set({
		...empty,
		ready: false,
		saving: false,
		syncError: null
	}),
	adopt: (data) => set({
		...data ?? empty,
		ready: true,
		saving: false,
		syncError: null
	}),
	failLoad: (message) => set({
		...empty,
		ready: false,
		saving: false,
		syncError: message
	}),
	retryLoad: () => set((state) => ({
		loadAttempt: state.loadAttempt + 1,
		syncError: null,
		ready: false
	}))
}));
function selectData(state) {
	return {
		platforms: state.platforms,
		entries: state.entries,
		expenseTypes: state.expenseTypes,
		expenses: state.expenses,
		cashbackCards: state.cashbackCards,
		cashbacks: state.cashbacks,
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
function resolveSignInGateState(input) {
	if (input.isPending) return "pending";
	return input.hasUser ? "signed_in" : "signed_out";
}
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
function SignInGate({ children, fallback }) {
	const { user, isPending } = useCurrentUserState();
	const state = resolveSignInGateState({
		isPending,
		hasUser: user !== null
	});
	if (state === "pending") return null;
	if (state === "signed_in") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: fallback ?? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignInButtons, {}) });
}
function SignInButtons() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex w-full max-w-sm flex-col gap-2",
		children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => signIn(p.providerId, { callbackURL: "/" }),
			className: "w-full cursor-pointer rounded-md border border-neutral-300 px-4 py-2 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900",
			children: ["Continue with ", p.label]
		}, p.providerId))
	});
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			!gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
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
			tone: "forest"
		})]
	});
}
function Bar$1({ label, amount, max, currency, tone }) {
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
	const hasData = useLedger((state) => state.platforms.length > 0 || state.entries.length > 0 || state.expenseTypes.length > 0 || state.expenses.length > 0 || state.cashbackCards.length > 0 || state.cashbacks.length > 0);
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
		description: "A caderneta está na tua conta. Exporta uma cópia se quiseres um ficheiro teu.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-md bg-chip px-3 py-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
				}),
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
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Isto apaga a caderneta da tua conta. Não dá para desfazer." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
function ExpensesPanel({ month, onMonth }) {
	const types = useLedger((state) => state.expenseTypes);
	const expenses = useLedger((state) => state.expenses);
	const currency = useLedger((state) => state.currency);
	const addExpenseType = useLedger((state) => state.addExpenseType);
	const renameExpenseType = useLedger((state) => state.renameExpenseType);
	const deleteExpenseType = useLedger((state) => state.deleteExpenseType);
	const upsertExpense = useLedger((state) => state.upsertExpense);
	const [drafts, setDrafts] = (0, import_react.useState)({});
	const [name, setName] = (0, import_react.useState)("");
	const [nameError, setNameError] = (0, import_react.useState)("");
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [editingName, setEditingName] = (0, import_react.useState)("");
	const [confirmId, setConfirmId] = (0, import_react.useState)(null);
	const [errors, setErrors] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		const next = {};
		for (const type of useLedger.getState().expenseTypes) {
			const saved = expenseFor(useLedger.getState().expenses, type.id, month);
			next[type.id] = saved ? formatPlain(saved.amount) : "";
		}
		setDrafts(next);
		setErrors({});
		setConfirmId(null);
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
	function createType() {
		const trimmed = name.trim();
		if (trimmed.length < 1) {
			setNameError("Dá um nome ao tipo.");
			return;
		}
		if (types.some((type) => type.name.toLocaleLowerCase("pt") === trimmed.toLocaleLowerCase("pt"))) {
			setNameError("Já existe um tipo com esse nome.");
			return;
		}
		addExpenseType(trimmed);
		setName("");
		setNameError("");
	}
	const series = expenseSeries(types, expenses);
	const monthTotal = expenseTotal(expenses, month);
	const recorded = types.filter((type) => expenseFor(expenses, type.id, month)).length;
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
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthSwitcher, {
					month,
					onChange: onMonth
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted",
					children: types.length === 0 ? "Cria os tipos — renda, alimentação, transportes — e em cada fecho apontas quanto saiu." : `${recorded} de ${types.length} tipos neste mês. Total ${formatMoney(monthTotal, currency)}.`
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-line bg-card p-4 sm:p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-2xl",
						children: "Tipos"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-4 flex flex-col gap-2 sm:flex-row",
						onSubmit: (event) => {
							event.preventDefault();
							createType();
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: name,
							onChange: (event) => setName(event.target.value),
							placeholder: "Novo tipo",
							maxLength: 40,
							className: "h-12 w-full rounded-md border border-line bg-paper px-3 text-base text-ink outline-none focus-visible:border-forest"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							children: "Adicionar"
						})]
					}),
					nameError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-loss",
						children: nameError
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
							editingId === type.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								className: "flex flex-col gap-2 sm:flex-row",
								onSubmit: (event) => {
									event.preventDefault();
									const trimmed = editingName.trim();
									if (trimmed.length < 1) return;
									renameExpenseType(type.id, trimmed);
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
										children: "Guardar nome"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										onClick: () => setEditingId(null),
										children: "Cancelar"
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: type.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted",
									children: saved && !dirty ? "Registado" : dirty ? "Por guardar" : "Por registar"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex gap-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "h-11 px-2 text-sm font-medium text-forest",
										onClick: () => {
											setEditingId(type.id);
											setEditingName(type.name);
										},
										children: "Renomear"
									})
								})]
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
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
								}), confirmId === type.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "danger",
									onClick: () => deleteExpenseType(type.id),
									children: "Apagar tipo"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									onClick: () => setConfirmId(null),
									children: "Cancelar"
								})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									onClick: () => setConfirmId(type.id),
									children: "Eliminar tipo"
								})]
							})
						]
					}, type.id);
				})
			}) : null,
			shareRows.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-line bg-card p-4 sm:p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-4 font-serif text-2xl",
					children: "Este mês"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShareList, {
					title: "Por tipo",
					slices: shareRows,
					currency
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpenseChart, {
				series,
				types,
				currency
			})
		]
	});
}
function CashbackPanel({ month, onMonth }) {
	const cards = useLedger((state) => state.cashbackCards);
	const cashbacks = useLedger((state) => state.cashbacks);
	const currency = useLedger((state) => state.currency);
	const addCashbackCard = useLedger((state) => state.addCashbackCard);
	const renameCashbackCard = useLedger((state) => state.renameCashbackCard);
	const deleteCashbackCard = useLedger((state) => state.deleteCashbackCard);
	const upsertCashback = useLedger((state) => state.upsertCashback);
	const [drafts, setDrafts] = (0, import_react.useState)({});
	const [name, setName] = (0, import_react.useState)("");
	const [nameError, setNameError] = (0, import_react.useState)("");
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [editingName, setEditingName] = (0, import_react.useState)("");
	const [confirmId, setConfirmId] = (0, import_react.useState)(null);
	const [errors, setErrors] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		const next = {};
		for (const card of useLedger.getState().cashbackCards) {
			const saved = cashbackFor(useLedger.getState().cashbacks, card.id, month);
			next[card.id] = saved ? formatPlain(saved.amount) : "";
		}
		setDrafts(next);
		setErrors({});
		setConfirmId(null);
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
	function createCard() {
		const trimmed = name.trim();
		if (trimmed.length < 1) {
			setNameError("Dá um nome ao cartão.");
			return;
		}
		if (cards.some((card) => card.name.toLocaleLowerCase("pt") === trimmed.toLocaleLowerCase("pt"))) {
			setNameError("Já existe um cartão com esse nome.");
			return;
		}
		addCashbackCard(trimmed);
		setName("");
		setNameError("");
	}
	const rows = cashbackRows(cards, cashbacks, month);
	const series = cashbackSeries(cards, cashbacks);
	const total = cashbackTotal(cashbacks, month);
	const recorded = cards.filter((card) => cashbackFor(cashbacks, card.id, month)).length;
	const leaders = rows.filter((row) => row.amount > 0 && row.amount === rows[0]?.amount);
	const fallback = [...series].reverse().find((point) => point.total > 0);
	const chartRows = leaders.length > 0 ? rows : fallback?.rows ?? [];
	const chartTitle = leaders.length > 0 ? leaders.length === 1 ? `${leaders[0].name} deu mais em ${formatMonth(month).toLowerCase()}.` : `${leaders.map((row) => row.name).join(" e ")} empataram em ${formatMonth(month).toLowerCase()}.` : fallback ? `Neste mês ainda não há cashback. O último foi ${formatMonth(fallback.month).toLowerCase()}.` : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-line bg-card p-4 sm:p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthSwitcher, {
					month,
					onChange: onMonth
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted",
					children: cards.length === 0 ? "Cria os cartões e, no fecho, aponta o cashback que cada um deu." : leaders.length > 0 ? `${recorded} de ${cards.length} cartões. Total ${formatMoney(total, currency)}.` : "Ainda sem cashback neste mês."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-line bg-card p-4 sm:p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-2xl",
						children: "Cartões"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-4 flex flex-col gap-2 sm:flex-row",
						onSubmit: (event) => {
							event.preventDefault();
							createCard();
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: name,
							onChange: (event) => setName(event.target.value),
							placeholder: "Novo cartão",
							maxLength: 40,
							className: "h-12 w-full rounded-md border border-line bg-paper px-3 text-base text-ink outline-none focus-visible:border-forest"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							children: "Adicionar"
						})]
					}),
					nameError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-loss",
						children: nameError
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
							editingId === card.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								className: "flex flex-col gap-2 sm:flex-row",
								onSubmit: (event) => {
									event.preventDefault();
									const trimmed = editingName.trim();
									if (trimmed.length < 1) return;
									renameCashbackCard(card.id, trimmed);
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
										children: "Guardar nome"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										onClick: () => setEditingId(null),
										children: "Cancelar"
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: card.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted",
									children: saved && !dirty ? "Registado" : dirty ? "Por guardar" : "Por registar"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "h-11 px-2 text-sm font-medium text-forest",
									onClick: () => {
										setEditingId(card.id);
										setEditingName(card.name);
									},
									children: "Renomear"
								})]
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
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
								}), confirmId === card.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "danger",
									onClick: () => deleteCashbackCard(card.id),
									children: "Apagar cartão"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									onClick: () => setConfirmId(null),
									children: "Cancelar"
								})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									onClick: () => setConfirmId(card.id),
									children: "Eliminar cartão"
								})]
							})
						]
					}, card.id);
				})
			}) : null,
			chartRows.some((row) => row.amount > 0) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CashbackMonthChart, {
				rows: chartRows,
				currency,
				title: chartTitle
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CashbackHistory, {
				series,
				cards,
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
function MonthPanel({ month, onMonth, onAddPlatform }) {
	const platforms = useLedger((state) => state.platforms);
	const entries = useLedger((state) => state.entries);
	const currency = useLedger((state) => state.currency);
	const upsertEntry = useLedger((state) => state.upsertEntry);
	const deleteEntry = useLedger((state) => state.deleteEntry);
	const monthlyGoal = useLedger((state) => state.monthlyGoal);
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
	const monthContributed = entries.reduce((sum, entry) => entry.month === month ? cents(sum + entry.contributed) : sum, 0);
	const dirtyCount = platforms.filter((platform) => isDirty(drafts[platform.id] ?? {
		contributed: "",
		endValue: ""
	}, entryFor(entries, platform.id, month))).length;
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
	function saveAll() {
		const updates = {};
		const nextErrors = {};
		for (const platform of platforms) {
			const draft = drafts[platform.id] ?? {
				contributed: "",
				endValue: ""
			};
			if (!isDirty(draft, entryFor(entries, platform.id, month))) continue;
			const parsed = parsedDraft(draft);
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthSwitcher, {
					month,
					onChange: onMonth
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-sm text-muted",
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
				dirtyCount >= 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-4",
					onClick: saveAll,
					children: "Guardar este mês"
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
function SummaryView({ month, onMonth, onRegister, onExpenses, onCashback, onOpenPlatform }) {
	const platforms = useLedger((state) => state.platforms);
	const entries = useLedger((state) => state.entries);
	const expenseTypes = useLedger((state) => state.expenseTypes);
	const expenses = useLedger((state) => state.expenses);
	const cashbackCards = useLedger((state) => state.cashbackCards);
	const cashbacks = useLedger((state) => state.cashbacks);
	const currency = useLedger((state) => state.currency);
	const monthlyGoal = useLedger((state) => state.monthlyGoal);
	const series = buildSeries(platforms, entries);
	const snapshot = totals(platforms, entries);
	const focus = pointFor(series, month);
	const years = yearlyRollup(series);
	const shares = valueShares(platforms, entries);
	const kinds = kindShares(platforms, entries);
	const pending = platforms.filter((platform) => !entryFor(entries, platform.id, month));
	const pendingExpenses = expenseTypes.filter((type) => !expenseFor(expenses, type.id, month));
	const spent = expenseTotal(expenses, month);
	const cashRows = cashbackRows(cashbackCards, cashbacks, month);
	const cashTotal = cashbackTotal(cashbacks, month);
	const cashLeaders = cashRows.filter((row) => row.amount > 0 && row.amount === cashRows[0]?.amount);
	const pendingCash = cashbackCards.filter((card) => !cashbackFor(cashbacks, card.id, month));
	const monthContributed = entries.reduce((sum, entry) => entry.month === month ? cents(sum + entry.contributed) : sum, 0);
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ValueChart, {
				points: series,
				currency
			}),
			shares.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-line bg-card p-4 sm:p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-4 font-serif text-2xl",
						children: "Onde está o dinheiro"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShareList, {
						title: "Por plataforma",
						slices: shares,
						currency
					}),
					kinds.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShareList, {
							title: "Por tipo",
							slices: kinds,
							currency
						})
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
		id: "despesas",
		label: "Despesas"
	},
	{
		id: "cashback",
		label: "Cartões"
	},
	{
		id: "plataformas",
		label: "Plataformas"
	}
];
function LastroApp() {
	const ready = useLedger((state) => state.ready);
	const syncError = useLedger((state) => state.syncError);
	const saving = useLedger((state) => state.saving);
	const retryLoad = useLedger((state) => state.retryLoad);
	const platforms = useLedger((state) => state.platforms);
	const expenseTypes = useLedger((state) => state.expenseTypes);
	const cashbackCards = useLedger((state) => state.cashbackCards);
	const addCashbackCard = useLedger((state) => state.addCashbackCard);
	const demo = useLedger((state) => state.demo);
	const currency = useLedger((state) => state.currency);
	const closingDay = useLedger((state) => state.closingDay);
	const addExpenseType = useLedger((state) => state.addExpenseType);
	const keepDemo = useLedger((state) => state.keepDemo);
	const reset = useLedger((state) => state.reset);
	const loadDemo = useLedger((state) => state.loadDemo);
	const [tab, setTab] = (0, import_react.useState)("resumo");
	const [month, setMonth] = (0, import_react.useState)(() => dueMonth(1));
	const monthTouched = (0, import_react.useRef)(false);
	const [platformId, setPlatformId] = (0, import_react.useState)(null);
	const [platformOpen, setPlatformOpen] = (0, import_react.useState)(false);
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [settingsOpen, setSettingsOpen] = (0, import_react.useState)(false);
	const editing = platforms.find((platform) => platform.id === editingId) ?? null;
	const empty = platforms.length === 0 && expenseTypes.length === 0 && cashbackCards.length === 0;
	(0, import_react.useEffect)(() => {
		if (ready && !monthTouched.current) setMonth(dueMonth(closingDay));
	}, [ready, closingDay]);
	function changeMonth(next) {
		monthTouched.current = true;
		setMonth(next);
	}
	function openCreate() {
		setEditingId(null);
		setPlatformOpen(true);
	}
	function openEdit(id) {
		setEditingId(id);
		setPlatformOpen(true);
	}
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
									children: "O que investes, o que fica e o que gastas"
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
							monthTouched.current = false;
							setMonth(dueMonth(25));
						},
						onCreateType: (label) => {
							addExpenseType(label);
							setTab("despesas");
						},
						onCreateCard: (label) => {
							addCashbackCard(label);
							setTab("cashback");
						}
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
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
									if (item.id !== "plataformas") setPlatformId(null);
								},
								className: cn("h-11 min-w-24 flex-1 rounded-md px-2 text-xs font-medium sm:text-sm", tab === item.id ? "bg-card text-ink" : "text-muted"),
								children: item.label
							}, item.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-sm text-muted",
							children: [
								isClosingToday(closingDay) ? `Hoje é o dia de atualizar.` : `Atualizas sempre no dia ${closingDay}.`,
								" ",
								"Este fecho é ",
								formatCloseDay(month, closingDay),
								"."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4",
							children: [
								tab === "resumo" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryView, {
									month,
									onMonth: changeMonth,
									onRegister: () => setTab("mes"),
									onExpenses: () => setTab("despesas"),
									onCashback: () => setTab("cashback"),
									onOpenPlatform: (id) => {
										setPlatformId(id);
										setTab("plataformas");
									}
								}) : null,
								tab === "mes" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthPanel, {
									month,
									onMonth: changeMonth,
									onAddPlatform: openCreate
								}) : null,
								tab === "despesas" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpensesPanel, {
									month,
									onMonth: changeMonth
								}) : null,
								tab === "cashback" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CashbackPanel, {
									month,
									onMonth: changeMonth
								}) : null,
								tab === "plataformas" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlatformsPanel, {
									selectedId: platformId,
									onOpen: setPlatformId,
									onClose: () => setPlatformId(null),
									onAdd: openCreate,
									onEdit: openEdit,
									onGoMonth: (next) => {
										changeMonth(next);
										setTab("mes");
									}
								}) : null
							]
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-10 text-sm text-muted",
						children: syncError ? syncError : saving ? "A guardar na tua conta…" : "Os números ficam na tua conta. Nas definições podes exportar uma cópia."
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
function EmptyLedger({ onAdd, onDemo, onCreateType, onCreateCard }) {
	const [name, setName] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [cardName, setCardName] = (0, import_react.useState)("");
	const [cardError, setCardError] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-8 rounded-lg border border-line bg-card px-5 py-8 sm:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-3xl sm:text-4xl",
				children: "O mesmo dia, todos os meses."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-xl text-base leading-relaxed text-muted",
				children: "Escolhes o dia de fecho. Nesse dia apontas investimentos, despesas e o cashback de cada cartão."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
				className: "mt-6 max-w-xl space-y-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-serif text-forest",
							children: "01"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Crias plataformas, tipos de despesa e cartões." })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-serif text-forest",
							children: "02"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "No dia de fecho, registas aportes, valores e gastos." })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-serif text-forest",
							children: "03"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Vês a carteira, as despesas e qual o cartão que deu mais cashback." })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-8 flex max-w-xl flex-col gap-2 sm:flex-row",
				onSubmit: (event) => {
					event.preventDefault();
					const trimmed = name.trim();
					if (trimmed.length < 1) {
						setError("Dá um nome ao primeiro tipo, por exemplo Renda.");
						return;
					}
					onCreateType(trimmed);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: name,
					onChange: (event) => setName(event.target.value),
					placeholder: "Primeiro tipo de despesa",
					maxLength: 40,
					className: "h-12 w-full rounded-md border border-line bg-paper px-3 text-base text-ink outline-none focus-visible:border-forest"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					children: "Criar tipo"
				})]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-loss",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-3 flex max-w-xl flex-col gap-2 sm:flex-row",
				onSubmit: (event) => {
					event.preventDefault();
					const trimmed = cardName.trim();
					if (trimmed.length < 1) {
						setCardError("Dá um nome ao cartão, por exemplo Universo.");
						return;
					}
					onCreateCard(trimmed);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: cardName,
					onChange: (event) => setCardName(event.target.value),
					placeholder: "Primeiro cartão de cashback",
					maxLength: 40,
					className: "h-12 w-full rounded-md border border-line bg-paper px-3 text-base text-ink outline-none focus-visible:border-forest"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					variant: "soft",
					children: "Criar cartão"
				})]
			}),
			cardError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-loss",
				children: cardError
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-col gap-3 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "soft",
					onClick: onAdd,
					children: "Adicionar plataforma"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: onDemo,
					children: "Ver um exemplo"
				})]
			})
		]
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var loadLedger = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("b1169f5b85e3d12f18a4ae8bfa2efe3c74a72d6fa29cb184412a323254a7101b"));
var saveLedger = createServerFn({ method: "POST" }).validator((input) => {
	const parsed = parseBackup(input);
	if (typeof parsed === "string") throw new Error("Caderneta inválida.");
	return parsed;
}).middleware([authMiddleware]).handler(createSsrRpc("94336ba60ad5fd3d3e26c0a812bda93c8cfff06ef5eb6a9fdc20d41278839862"));
var LEGACY_KEY = "lastro-ledger-v1";
function readLegacyLocal() {
	if (typeof window === "undefined") return null;
	try {
		const raw = window.localStorage.getItem(LEGACY_KEY);
		if (!raw) return null;
		const state = JSON.parse(raw)?.state;
		if (!state || typeof state !== "object") return null;
		const result = parseBackup({
			version: 1,
			currency: state.currency,
			monthlyGoal: state.monthlyGoal ?? null,
			fireGoal: state.fireGoal ?? null,
			closingDay: state.closingDay ?? 1,
			platforms: state.platforms ?? [],
			entries: state.entries ?? [],
			expenseTypes: state.expenseTypes ?? [],
			expenses: state.expenses ?? [],
			cashbackCards: state.cashbackCards ?? [],
			cashbacks: state.cashbacks ?? [],
			demo: state.demo === true
		});
		if (typeof result === "string") return null;
		return result.platforms.length === 0 && result.entries.length === 0 && result.expenseTypes.length === 0 && result.expenses.length === 0 && result.cashbackCards.length === 0 && result.cashbacks.length === 0 && result.monthlyGoal == null && result.fireGoal == null ? null : result;
	} catch {
		return null;
	}
}
function LedgerSync({ userId }) {
	const loadAttempt = useLedger((state) => state.loadAttempt);
	const ready = useLedger((state) => state.ready);
	(0, import_react.useLayoutEffect)(() => {
		useLedger.getState().prepareAccount();
	}, [userId, loadAttempt]);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		(async () => {
			try {
				const remote = await loadLedger();
				if (cancelled) return;
				if (remote) {
					useLedger.getState().adopt(remote);
					return;
				}
				const local = readLegacyLocal();
				if (local) {
					useLedger.getState().adopt(local);
					try {
						await saveLedger({ data: toBackup(local) });
						window.localStorage.removeItem(LEGACY_KEY);
					} catch {
						useLedger.setState({ syncError: "Encontrei os números neste telemóvel, mas ainda não os guardei na conta." });
					}
					return;
				}
				useLedger.getState().adopt(null);
			} catch {
				if (!cancelled) useLedger.getState().failLoad("Não consegui abrir a tua caderneta.");
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [userId, loadAttempt]);
	(0, import_react.useEffect)(() => {
		if (!ready) return;
		let timer = 0;
		let last = JSON.stringify(selectData(useLedger.getState()));
		const flush = () => {
			const data = selectData(useLedger.getState());
			const sent = JSON.stringify(data);
			last = sent;
			useLedger.setState({ saving: true });
			saveLedger({ data: toBackup(data) }).then(() => {
				if (JSON.stringify(selectData(useLedger.getState())) === sent) useLedger.setState({
					saving: false,
					syncError: null
				});
			}).catch(() => {
				useLedger.setState({
					saving: false,
					syncError: "Não guardei esta alteração. Os números continuam neste ecrã."
				});
			});
		};
		const unsub = useLedger.subscribe((state) => {
			if (JSON.stringify(selectData(state)) === last) return;
			window.clearTimeout(timer);
			timer = window.setTimeout(flush, 450);
		});
		const onHide = () => {
			if (JSON.stringify(selectData(useLedger.getState())) === last) return;
			window.clearTimeout(timer);
			flush();
		};
		window.addEventListener("pagehide", onHide);
		return () => {
			unsub();
			window.clearTimeout(timer);
			window.removeEventListener("pagehide", onHide);
		};
	}, [ready, userId]);
	return null;
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignInGate, {
		fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountGate, {}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthedLedger, {})
	});
}
function AuthedLedger() {
	const user = useCurrentUser();
	if (!user) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LedgerSync, { userId: user.id }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LastroApp, {})] });
}
//#endregion
export { Home as component };
