import { useLayoutEffect } from "react";
import { applyTheme, readTheme } from "@/lib/theme";

export function ThemeBoot() {
  useLayoutEffect(() => {
    const sync = () => applyTheme(readTheme());
    sync();
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    query.addEventListener("change", sync);
    window.addEventListener("lastro-theme", sync);
    return () => {
      query.removeEventListener("change", sync);
      window.removeEventListener("lastro-theme", sync);
    };
  }, []);
  return null;
}
