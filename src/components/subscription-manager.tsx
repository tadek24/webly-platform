"use client";

import { useState } from "react";
import type { CustomerSubscription } from "@/lib/site-builder-types";

const plans = [
  { id: "START" as const, name: "Start", price: "79 zł", detail: "1 strona / własna domena" },
  { id: "PRO" as const, name: "Pro", price: "149 zł", detail: "3 strony / więcej sekcji" },
  { id: "COMMERCE" as const, name: "Commerce", price: "249 zł", detail: "sklep / WooCommerce" },
];

export function SubscriptionManager({ initial }: { initial: CustomerSubscription }) {
  const [subscription, setSubscription] = useState(initial);
  const [status, setStatus] = useState("");

  async function choose(plan: CustomerSubscription["plan"]) {
    setStatus("Zapisuję zmianę…");
    const response = await fetch("/api/subscription", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plan }) });
    const result = await response.json() as { subscription?: CustomerSubscription; error?: string };
    if (response.ok && result.subscription) {
      setSubscription(result.subscription);
      setStatus("Plan został zapisany. Płatności podłączymy w kolejnym etapie.");
    } else setStatus(result.error ?? "Nie udało się zmienić planu.");
  }

  return <div><div className="subscription-grid">{plans.map((plan) => <article key={plan.id} className={subscription.plan === plan.id ? "current" : ""}><span>{subscription.plan === plan.id ? "TWÓJ PLAN" : "PLAN"}</span><h2>{plan.name}</h2><strong>{plan.price}<small>/ mies.</small></strong><p>{plan.detail}</p><button onClick={() => choose(plan.id)} disabled={subscription.plan === plan.id}>{subscription.plan === plan.id ? "AKTYWNY" : "WYBIERAM →"}</button></article>)}</div>{status && <p className="subscription-message">{status}</p>}</div>;
}

