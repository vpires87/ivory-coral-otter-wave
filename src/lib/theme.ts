export const THEMES = [
  { id: "papel", label: "Papel", paper: "#f3eee6", accent: "#1e5c40" },
  { id: "escuro", label: "Escuro", paper: "#161410", accent: "#8fceb0" },
  { id: "sistema", label: "Sistema", paper: "#f3eee6", accent: "#161410" },
] as const;

export type ThemeChoice = (typeof THEMES)[number]["id"];

const KEY = "lastro-theme";

export function readTheme(): ThemeChoice {
  if (typeof window === "undefined") return "papel";
  try {
    const stored = window.localStorage.getItem(KEY);
    if (stored === "papel" || stored === "escuro" || stored === "sistema") return stored;
  } catch {
    /* a private browser can block storage */
  }
  return "papel";
}

export function resolvedTheme(choice: ThemeChoice): "papel" | "escuro" {
  if (choice === "sistema" && typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "escuro" : "papel";
  }
  return choice === "escuro" ? "escuro" : "papel";
}

export function applyTheme(choice: ThemeChoice) {
  if (typeof document === "undefined") return;
  const resolved = resolvedTheme(choice);
  document.documentElement.dataset.theme = resolved;
  document.documentElement.style.colorScheme = resolved === "escuro" ? "dark" : "light";
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", resolved === "escuro" ? "#161410" : "#f3eee6");
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
