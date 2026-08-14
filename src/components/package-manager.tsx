"use client";

import { useState } from "react";
import type { PackageDefinition } from "@/lib/site-builder-types";

export function PackageManager({ initial }: { initial: PackageDefinition[] }) {
  const [packages, setPackages] = useState(initial);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  function change(id: PackageDefinition["id"], patch: Partial<PackageDefinition>) {
    setPackages((current) => current.map((item) => item.id === id ? { ...item, ...patch } : item));
  }

  async function save() {
    setBusy(true); setMessage("Publikuję nowy cennik…");
    const response = await fetch("/api/admin/packages", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ packages }) });
    const result = await response.json() as { packages?: PackageDefinition[]; error?: string };
    if (response.ok && result.packages) { setPackages(result.packages); setMessage("Cennik został zapisany w WordPressie i jest gotowy dla strony oraz klientów."); }
    else setMessage(result.error ?? "Nie udało się zapisać cennika.");
    setBusy(false);
  }

  return <section className="package-manager">
    <div className="package-manager-grid">{packages.map((item) => <article key={item.id}>
      <span>{item.id}</span>
      <label>Nazwa<input value={item.name} onChange={(event) => change(item.id, { name: event.target.value })} /></label>
      <div className="package-number-row"><label>Abonament / mies.<input type="number" min="0" value={item.price} onChange={(event) => change(item.id, { price: Number(event.target.value) })} /></label><label>Uruchomienie<input type="number" min="0" value={item.setup} onChange={(event) => change(item.id, { setup: Number(event.target.value) })} /></label></div>
      <label>Dla kogo<input value={item.audience} onChange={(event) => change(item.id, { audience: event.target.value })} /></label>
      <label>Opis<textarea value={item.description} onChange={(event) => change(item.id, { description: event.target.value })} /></label>
      <label>Funkcje — każda w osobnej linii<textarea value={item.features.join("\n")} onChange={(event) => change(item.id, { features: event.target.value.split("\n").filter(Boolean) })} /></label>
    </article>)}</div>
    <div className="package-save"><p>{message || "Zmiany tutaj wpływają na cennik publiczny i wybór abonamentu w panelu klienta."}</p><button disabled={busy} onClick={save}>{busy ? "ZAPISUJĘ…" : "ZAPISZ I OPUBLIKUJ CENNIK →"}</button></div>
  </section>;
}
