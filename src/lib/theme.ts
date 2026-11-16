export const THEMES = [
  { id: "papel", label: "Papel", paper: "#f3eee6", accent: "#1e5c40", dark: false },
  { id: "mar", label: "Mar", paper: "#e6eef0", accent: "#0f5c62", dark: false },
  { id: "oliva", label: "Oliva", paper: "#e7eadf", accent: "#3b5c28", dark: false },
  { id: "escuro", label: "Escuro", paper: "#161410", accent: "#8fceb0", dark: true },
  { id: "noite", label: "Noite", paper: "#10161a", accent: "#7ec8c0", dark: true },
  { id: "sistema", label: "Sistema", paper: "#f3eee6", accent: "#161410", dark: false },
] as const;

export type ThemeChoice = (typeof THEMES)[number]["id"];
export type ResolvedTheme = Exclude<ThemeChoice, "sistema">;

const KEY = "lastro-theme";

function isChoice(value: string | null): value is ThemeChoice {
  return THEMES.some((theme) => theme.id === value);
}

export function readTheme(): ThemeChoice {
  if (typeof window === "undefined") return "papel";
  try {
    const stored = window.localStorage.getItem(KEY);
    if (isChoice(stored)) return stored;
  } catch {
    /* a private browser can block storage */
  }
  return "papel";
}

export function resolvedTheme(choice: ThemeChoice): ResolvedTheme {
  if (choice === "sistema") {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "escuro";
    }
    return "papel";
  }
  return choice;
}

export function applyTheme(choice: ThemeChoice) {
  if (typeof document === "undefined") return;
  const resolved = resolvedTheme(choice);
  const theme = THEMES.find((item) => item.id === resolved) ?? THEMES[0];
  document.documentElement.dataset.theme = resolved;
  document.documentElement.style.colorScheme = theme.dark ? "dark" : "light";
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme.paper);
}

export function storeTheme(choice: ThemeChoice) {
  try {
    window.localStorage.setItem(KEY, choice);
  } catch {
    /* keep the choice for this visit even if storage is blocked */
  }
  applyTheme(choice);
  window.dispatchEvent(new Event("lastro-theme"));
}
