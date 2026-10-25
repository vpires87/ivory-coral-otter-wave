import { createFileRoute } from "@tanstack/react-router";
import { LastroApp } from "@/components/ledger/app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <LastroApp />;
}
