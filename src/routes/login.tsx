import { createFileRoute, Navigate } from "@tanstack/react-router";
import { AccountGate } from "@/components/ledger/account-gate";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) return <div className="min-h-dvh" />;
  if (user) return <Navigate to="/" />;
  return <AccountGate />;
}
