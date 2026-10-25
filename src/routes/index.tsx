import { createFileRoute } from "@tanstack/react-router";
import { AccountGate } from "@/components/ledger/account-gate";
import { LastroApp } from "@/components/ledger/app";
import { LedgerSync } from "@/components/ledger/sync";
import { SignInGate } from "@/lib/auth/gates";
import { useCurrentUser } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <SignInGate fallback={<AccountGate />}>
      <AuthedLedger />
    </SignInGate>
  );
}

function AuthedLedger() {
  const user = useCurrentUser();
  if (!user) return null;
  return (
    <>
      <LedgerSync userId={user.id} />
      <LastroApp />
    </>
  );
}
