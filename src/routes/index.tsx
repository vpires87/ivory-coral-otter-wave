import { createFileRoute } from "@tanstack/react-router";
import { LedgerHost } from "@/components/ledger/sync";
import { ledgerBackend } from "@/lib/ledger/remote";

export const Route = createFileRoute("/")({
  loader: () => ledgerBackend(),
  component: Home,
});

function Home() {
  return <LedgerHost initial={Route.useLoaderData()} />;
}