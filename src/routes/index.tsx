import { createFileRoute } from "@tanstack/react-router";
import { LastroApp } from "@/components/ledger/app";
import { LocalLedger } from "@/components/ledger/sync";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <>
      <LocalLedger />
      <LastroApp />
    </>
  );
}