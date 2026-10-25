import { useState } from "react";
import { GROK_PROVIDERS, signIn } from "@/lib/auth/client";

export function AccountGate() {
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function start(providerId: string) {
    setError("");
    setPending(providerId);
    try {
      await signIn(providerId, { callbackURL: "/" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      setError(
        message.includes("Pop-up")
          ? "O telemóvel bloqueou a janela. Permite pop-ups e tenta outra vez."
          : "Não consegui concluir a entrada. Tenta outra vez e acaba a escolha da conta na janela que abrir.",
      );
    } finally {
      setPending(null);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="grid h-12 w-12 place-items-center rounded-md bg-forest font-serif text-2xl text-card">
          L
        </div>
        <h1 className="mt-4 font-serif text-3xl leading-none">Entra na tua conta</h1>
        <p className="mt-3 text-sm text-muted">
          A caderneta fica ligada a ti. Neste telemóvel ou noutro, só tu vês os teus números.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          {GROK_PROVIDERS.map((provider) => (
            <button
              key={provider.providerId}
              type="button"
              disabled={pending !== null}
              onClick={() => void start(provider.providerId)}
              className="h-12 w-full rounded-md bg-forest px-4 text-sm font-medium text-card disabled:opacity-40"
            >
              {pending === provider.providerId ? "A abrir…" : `Continuar com ${provider.label}`}
            </button>
          ))}
        </div>
        {error ? <p className="mt-3 text-sm text-loss">{error}</p> : null}
      </div>
    </main>
  );
}