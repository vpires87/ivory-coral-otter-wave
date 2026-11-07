import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth/client";
import { Button, inputClassName } from "@/components/ledger/ui";

export function AccountGate() {
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent) {
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
    const result = creating
      ? await authClient.signUp.email({ email: email.trim(), password, name: name.trim() || email.trim() })
      : await authClient.signIn.email({ email: email.trim(), password });
    setPending(false);
    if (result.error) {
      const message = result.error.message ?? "";
      setError(
        creating
          ? message.toLowerCase().includes("exist")
            ? "Já existe uma conta com este email. Entra com ela."
            : "Não consegui criar a conta. Confirma o email e uma palavra-passe com 8 caracteres."
          : "Email ou palavra-passe não batem certo.",
      );
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="grid h-12 w-12 place-items-center rounded-md bg-forest font-serif text-2xl text-card">L</div>
        <h1 className="mt-4 font-serif text-3xl leading-none">{creating ? "Criar conta" : "Entrar"}</h1>
        <p className="mt-3 text-sm text-muted">
          A caderneta fica no PostgreSQL deste servidor. Cada conta vê só os seus números.
        </p>
        <form className="mt-6 space-y-3" onSubmit={(event) => void submit(event)}>
          {creating ? (
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Nome</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                className={inputClassName()}
              />
            </label>
          ) : null}
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
              className={inputClassName()}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Palavra-passe</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={creating ? "new-password" : "current-password"}
              required
              className={inputClassName()}
            />
          </label>
          {error ? <p className="text-sm text-loss">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "A esperar…" : creating ? "Criar conta" : "Entrar"}
          </Button>
        </form>
        <button
          type="button"
          className="mt-4 h-11 text-sm font-medium text-forest"
          onClick={() => {
            setCreating((value) => !value);
            setError("");
          }}
        >
          {creating ? "Já tenho conta" : "Ainda não tenho conta"}
        </button>
      </div>
    </main>
  );
}
