import { GROK_PROVIDERS, signIn } from "@/lib/auth/client";

export function AccountGate() {
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
              onClick={() => signIn(provider.providerId, { callbackURL: "/" })}
              className="h-12 w-full rounded-md bg-forest px-4 text-sm font-medium text-card"
            >
              Continuar com {provider.label}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
