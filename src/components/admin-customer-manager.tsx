"use client";

import { useState } from "react";
import type { AdminCustomer, CustomerSubscription } from "@/lib/site-builder-types";

export function AdminCustomerManager({ initial }: { initial: AdminCustomer[] }) {
  const [customers, setCustomers] = useState(initial);
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  async function save(customer: AdminCustomer, input: Partial<CustomerSubscription> & { access?: "ACTIVE" | "SUSPENDED" }) {
    setBusyId(customer.id); setMessage("Zapisuję zmiany…");
    const response = await fetch(`/api/admin/customers/${customer.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) });
    const result = await response.json() as { customer?: AdminCustomer; error?: string };
    if (response.ok && result.customer) {
      setCustomers((current) => current.map((item) => item.id === customer.id ? result.customer! : item));
      setMessage(`Zapisano konto ${customer.email}.`);
    } else setMessage(result.error ?? "Nie udało się zapisać zmian.");
    setBusyId(null);
  }

  return <section className="admin-customer-table">
    <header><span>KLIENT</span><span>WITRYNY</span><span>PAKIET</span><span>STATUS</span><span>DOSTĘP</span></header>
    {customers.map((customer) => <article key={customer.id}>
      <div><strong>{customer.name}</strong><small>{customer.email}</small></div>
      <span>{customer.sites.length} / {customer.sites.filter((site) => site.kind === "STORE").length} sklep</span>
      <select value={customer.subscription.plan} disabled={busyId === customer.id} onChange={(event) => save(customer, { plan: event.target.value as CustomerSubscription["plan"] })}><option>START</option><option>PRO</option><option>COMMERCE</option><option>OMNICHANNEL</option></select>
      <select value={customer.subscription.status} disabled={busyId === customer.id} onChange={(event) => save(customer, { status: event.target.value as CustomerSubscription["status"] })}><option value="TRIALING">OKRES PRÓBNY</option><option value="ACTIVE">AKTYWNY</option><option value="PAST_DUE">ZALEGŁOŚĆ</option><option value="CANCELED">ANULOWANY</option></select>
      <button className={customer.access === "SUSPENDED" ? "danger" : ""} disabled={busyId === customer.id} onClick={() => save(customer, { access: customer.access === "SUSPENDED" ? "ACTIVE" : "SUSPENDED" })}>{customer.access === "SUSPENDED" ? "PRZYWRÓĆ" : "WSTRZYMAJ"}</button>
    </article>)}
    {!customers.length && <div className="admin-empty">Nie ma jeszcze klientów.</div>}
    {message && <p className="admin-message">{message}</p>}
  </section>;
}
