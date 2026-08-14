"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { StoreData } from "@/lib/site-builder-types";

type Tab = "overview" | "products" | "orders" | "integrations";

const labels: Record<Tab, string> = { overview: "Przegląd", products: "Produkty", orders: "Zamówienia", integrations: "Integracje" };
const categoryNames = { PAYMENTS: "Płatności", DELIVERY: "Dostawy", ERP: "Systemy sprzedaży", MARKETPLACE: "Marketplace" } as const;

export function StoreConsole({ initial }: { initial: StoreData }) {
  const [store, setStore] = useState(initial);
  const [tab, setTab] = useState<Tab>("overview");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [productImage, setProductImage] = useState("");

  async function addProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setMessage("Dodaję produkt…");
    const form = new FormData(event.currentTarget);
    const payload = { name: String(form.get("name") ?? ""), sku: String(form.get("sku") ?? ""), price: Number(form.get("price") ?? 0), stock: Number(form.get("stock") ?? 0), status: "ACTIVE" as const, imageUrl: productImage || String(form.get("imageUrl") ?? "") };
    const response = await fetch("/api/store/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const result = await response.json() as { store?: StoreData; error?: string };
    if (response.ok && result.store) { setStore(result.store); event.currentTarget.reset(); setProductImage(""); setMessage("Produkt został zapisany."); }
    else setMessage(result.error ?? "Nie udało się dodać produktu.");
    setBusy(false);
  }

  async function uploadProductImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) { setMessage("Zdjęcie może mieć maksymalnie 4 MB."); return; }
    setBusy(true); setMessage("Wysyłam zdjęcie produktu…");
    const formData = new FormData(); formData.set("file", file);
    const response = await fetch("/api/media", { method: "POST", body: formData });
    const result = await response.json() as { asset?: { url: string }; error?: string };
    if (response.ok && result.asset) { setProductImage(result.asset.url); setMessage("Zdjęcie gotowe. Uzupełnij dane i dodaj produkt."); }
    else setMessage(result.error ?? "Nie udało się wysłać zdjęcia.");
    setBusy(false);
  }

  async function toggleIntegration(id: string) {
    const selected = store.integrations.filter((item) => item.selected).map((item) => item.id);
    const next = selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id];
    setBusy(true); setMessage("Zapisuję wybór integracji…");
    const response = await fetch("/api/store/integrations", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ selected: next }) });
    const result = await response.json() as { store?: StoreData; error?: string };
    if (response.ok && result.store) { setStore(result.store); setMessage("Lista integracji została zapisana."); }
    else setMessage(result.error ?? "Nie udało się zapisać wyboru.");
    setBusy(false);
  }

  const revenue = store.orders.filter((order) => order.status !== "CANCELED").reduce((sum, order) => sum + order.total, 0);

  return <section className="store-console">
    <header className="store-console-tabs">{(Object.keys(labels) as Tab[]).map((key) => <button key={key} className={tab === key ? "active" : ""} onClick={() => setTab(key)}>{labels[key]}</button>)}<span>{store.mode === "WOOCOMMERCE" ? "WOOCOMMERCE / ONLINE" : "TRYB PRZYGOTOWAWCZY"}</span></header>
    {message && <p className="store-message">{message}</p>}

    {tab === "overview" && <div className="store-overview"><div className="store-kpis"><article><span>PRODUKTY</span><strong>{String(store.products.length).padStart(2, "0")}</strong><small>{store.products.filter((item) => item.status === "ACTIVE").length} aktywnych</small></article><article><span>ZAMÓWIENIA</span><strong>{String(store.orders.length).padStart(2, "0")}</strong><small>{store.orders.filter((item) => item.status === "NEW").length} nowych</small></article><article><span>SPRZEDAŻ DEMO</span><strong>{revenue.toLocaleString("pl-PL")} zł</strong><small>wszystkie kanały</small></article><article><span>INTEGRACJE</span><strong>{String(store.integrations.filter((item) => item.selected).length).padStart(2, "0")}</strong><small>wybrane do wdrożenia</small></article></div><div className="store-flow"><span>MODEL ZARZĄDZANY PRZEZ WEBLY</span><h2>Jedno miejsce.<br />Wiele kanałów sprzedaży.</h2><div><b>PANEL WEBLY</b><i>→</i><b>SILNIK SKLEPU</b><i>→</i><b>WEBLY HUB</b><i>→</i><b>ALLEGRO / ERLI / AMAZON</b></div><p>Klient widzi tylko Webly. Silnik WooCommerce uruchamiamy, aktualizujemy i zabezpieczamy po swojej stronie; BaseLinker lub Apilo dołączamy wyłącznie tam, gdzie potrzebna jest realna sprzedaż wielokanałowa.</p></div></div>}

    {tab === "products" && <div className="store-products-layout"><form onSubmit={addProduct}><span>NOWY PRODUKT</span><label>Nazwa<input name="name" required /></label><label>SKU<input name="sku" required /></label><div><label>Cena brutto<input name="price" type="number" min="0" step="0.01" required /></label><label>Stan<input name="stock" type="number" min="0" required /></label></div><label className="store-image-upload">{productImage ? "✓ ZDJĘCIE DODANE — ZMIEŃ" : "+ WGRAJ ZDJĘCIE"}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={uploadProductImage} disabled={busy} /></label>{productImage && <img className="store-product-preview" src={productImage} alt="Podgląd produktu" />}<label>Lub wklej adres zdjęcia<input name="imageUrl" type="url" placeholder="https://…" /></label><button disabled={busy}>+ DODAJ PRODUKT</button></form><div className="store-product-list"><div className="store-list-head"><span>PRODUKT</span><span>SKU</span><span>CENA</span><span>STAN</span><span>STATUS</span></div>{store.products.map((product) => <article key={product.id}><div>{product.imageUrl ? <img src={product.imageUrl} alt="" /> : <i /> }<strong>{product.name}</strong></div><span>{product.sku}</span><b>{product.price.toLocaleString("pl-PL")} zł</b><span>{product.stock} szt.</span><em>{product.status === "ACTIVE" ? "AKTYWNY" : "ROBOCZY"}</em></article>)}</div></div>}

    {tab === "orders" && <div className="store-orders"><div className="store-list-head"><span>NUMER</span><span>KLIENT</span><span>KANAŁ</span><span>KWOTA</span><span>STATUS</span><span>DATA</span></div>{store.orders.length ? store.orders.map((order) => <article key={order.id}><strong>{order.number}</strong><span>{order.customer}</span><b>{order.channel}</b><span>{order.total.toLocaleString("pl-PL")} zł</span><em>{order.status}</em><time>{new Intl.DateTimeFormat("pl-PL").format(new Date(order.createdAt))}</time></article>) : <div className="store-empty"><strong>Brak zamówień.</strong><p>Pojawią się tutaj po podłączeniu WooCommerce albo marketplace.</p></div>}</div>}

    {tab === "integrations" && <div className="integration-catalog">{(Object.keys(categoryNames) as Array<keyof typeof categoryNames>).map((category) => <section key={category}><header><span>{categoryNames[category]}</span><b>{store.integrations.filter((item) => item.category === category && item.selected).length} wybranych</b></header><div>{store.integrations.filter((item) => item.category === category).map((item) => <article key={item.id} className={item.selected ? "selected" : ""}><div><strong>{item.name}</strong><small>{item.availability === "READY" ? "GOTOWA DO PODŁĄCZENIA" : "PLANOWANA"}</small></div><p>{item.description}</p><button disabled={busy} onClick={() => toggleIntegration(item.id)}>{item.selected ? "WYBRANA ✓" : "DODAJ DO PLANU +"}</button></article>)}</div></section>)}</div>}
  </section>;
}
