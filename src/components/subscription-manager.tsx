"use client";

import { useState } from "react";
import type { CustomerSubscription, PackageDefinition } from "@/lib/site-builder-types";

export function SubscriptionManager({ initial, packages }: { initial: CustomerSubscription; packages: PackageDefinition[] }) {
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

  return <div><div className="subscription-grid">{packages.map((plan) => <article key={plan.id} className={subscription.plan === plan.id ? "current" : ""}><span>{subscription.plan === plan.id ? "TWÓJ PLAN" : "PLAN"}</span><h2>{plan.name}</h2><strong>{plan.price.toLocaleString("pl-PL")} zł<small>/ mies.</small></strong><p>{plan.description}</p><ul>{plan.features.slice(0, 4).map((feature) => <li key={feature}>{feature}</li>)}</ul><button onClick={() => choose(plan.id)} disabled={subscription.plan === plan.id}>{subscription.plan === plan.id ? "AKTYWNY" : "WYBIERAM →"}</button></article>)}</div>{status && <p className="subscription-message">{status}</p>}</div>;
}
