import Link from "next/link";
import { getCustomerSites, getSubscription } from "@/lib/customer-data";
import { requireCustomerSession } from "@/lib/customer-session";
import type { CustomerSite, CustomerSubscription } from "@/lib/site-builder-types";

export default async function CustomerDashboard() {
  const customer = await requireCustomerSession();
  let sites: CustomerSite[] = [];
  let subscription: CustomerSubscription = { plan: "START", status: "TRIALING", renewsAt: "2026-08-28T00:00:00.000Z" };
  let connectionError = "";
  try { [sites, subscription] = await Promise.all([getCustomerSites(customer.id), getSubscription(customer.id)]); } catch (error) { connectionError = error instanceof Error ? error.message : "Nie udało się pobrać danych."; }

  return <main className="account-main"><section className="account-hero"><div><span>PANEL KLIENTA / DZIEŃ DOBRY</span><h1>{customer.name},<br /><em>co dziś zmieniamy?</em></h1></div><Link href="/konto/witryny/nowa">+ UTWÓRZ NOWĄ WITRYNĘ</Link></section>{connectionError && <p className="account-warning">{connectionError}</p>}<section className="account-metrics"><div><span>WITRYNY</span><strong>{String(sites.length).padStart(2, "0")}</strong><small>{sites.filter((site) => site.status === "PUBLISHED").length} online</small></div><div><span>PLAN</span><strong>{subscription.plan}</strong><small>{subscription.status === "TRIALING" ? "okres próbny" : subscription.status.toLowerCase()}</small></div><div><span>NAJBLIŻSZE ODNOWIENIE</span><strong>{new Intl.DateTimeFormat("pl-PL", { day: "2-digit", month: "short" }).format(new Date(subscription.renewsAt))}</strong><small>Zarządzaj abonamentem →</small></div></section><section className="account-sites"><div className="account-section-heading"><span>TWOJE WITRYNY</span><h2>Projekty</h2></div>{sites.length ? <div className="account-site-list">{sites.map((site, index) => <article key={site.id}><span>W–{String(index + 1).padStart(3, "0")}</span><div><strong>{site.name}</strong><small>{site.slug}.webly.site</small></div><b>{site.kind === "STORE" ? "SKLEP" : site.kind === "LANDING" ? "LANDING" : "STRONA"}</b><i className={`site-state state-${site.status.toLowerCase()}`}>{site.status === "PUBLISHED" ? "ONLINE" : "ROBOCZA"}</i><time>{new Intl.DateTimeFormat("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(site.updatedAt))}</time><Link href={`/konto/witryny/${site.id}/edytor`}>EDYTUJ →</Link></article>)}</div> : <div className="account-empty"><span>01</span><h3>Nie masz jeszcze witryny.</h3><p>Wybierz gotowy kierunek i zacznij od treści zamiast od pustej kartki.</p><Link href="/konto/witryny/nowa">PRZEJDŹ DO SZABLONÓW →</Link></div>}</section></main>;
}
