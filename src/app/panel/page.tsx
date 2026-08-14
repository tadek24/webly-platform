import Link from "next/link";
import { getAdminOverview } from "@/lib/admin-data";

const kindLabel = { BUSINESS: "FIRMA", LANDING: "LANDING", STORE: "SKLEP" } as const;

export default async function StudioDashboard() {
  const overview = await getAdminOverview();
  const projects = overview.customers.flatMap((customer) => customer.sites.map((site) => ({ ...site, customer: customer.name }))).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 8);
  const activeCustomers = overview.customers.filter((customer) => customer.access !== "SUSPENDED").length;
  const attention = overview.customers.filter((customer) => customer.subscription.status === "PAST_DUE" || customer.access === "SUSPENDED").length;

  return (
    <main className="studio-main">
      <section className="studio-masthead">
        <div><p>WEBLY / CENTRUM OPERACYJNE</p><h1>Wszystko pod<br /><em>Twoją kontrolą.</em></h1></div>
        <div className="studio-actions"><Link href="/panel/tresci">Edytuj stronę Webly <span>↗</span></Link><Link className="studio-primary-action" href="/panel/klienci">KLIENCI →</Link></div>
      </section>

      <section className="metric-line" aria-label="Najważniejsze statystyki">
        <div><span>WITRYNY</span><strong>{overview.totals.sites}</strong><small>{overview.totals.stores} sklepów</small></div>
        <div><span>AKTYWNI KLIENCI</span><strong>{activeCustomers}</strong><small>z {overview.totals.customers}</small></div>
        <div className="wide"><span>PRZYCHÓD CYKLICZNY</span><strong>{overview.totals.monthlyRevenue.toLocaleString("pl-PL")} <i>PLN</i></strong><small>według aktywnych planów</small></div>
        <div className="attention"><span>DO SPRAWDZENIA</span><strong>{String(attention).padStart(2, "0")}</strong><small>konta / płatności</small></div>
      </section>

      <section className="workbench" id="witryny">
        <div className="workbench-head"><div><span>REJESTR / WITRYNY</span><h2>Ostatnia aktywność</h2></div><Link className="admin-inline-link" href="/panel/klienci">ZARZĄDZAJ KLIENTAMI →</Link></div>
        <div className="project-ledger">
          <div className="ledger-head"><span>ID</span><span>PROJEKT</span><span>TYP</span><span>STATUS</span><span>KLIENT</span><span /></div>
          {projects.map((project) => <div className="project-record" key={project.id}>
            <span>{project.id.replace("site_", "#").slice(0, 8)}</span><div><strong>{project.name}</strong><small>/s/{project.slug}</small></div><span>{kindLabel[project.kind]}</span><b className={`project-status status-${project.status.toLowerCase()}`}>{project.status === "PUBLISHED" ? "ONLINE" : project.status === "DRAFT" ? "W BUDOWIE" : "WSTRZYMANA"}</b><span>{project.customer}</span><Link aria-label={`Otwórz ${project.name}`} href={`/s/${project.slug}`}>↗</Link>
          </div>)}
          {!projects.length && <div className="admin-empty">Pierwsze projekty pojawią się po rejestracji klientów.</div>}
        </div>
      </section>

      <section className="studio-bottom">
        <div className="build-queue"><span>MODEL PLATFORMY</span><strong>Webly zarządza techniką</strong><div><i style={{ width: "78%" }} /></div><p>Panel klienta <b>bez WordPressa</b></p></div>
        <div className="quick-note"><span>NAJWAŻNIEJSZE</span><p>Klient wybiera projekt, wgrywa treści i publikuje. Nie pobiera ani nie instaluje żadnego systemu.</p><Link href="/panel/pakiety">Ustaw pakiety →</Link></div>
        <div className="pulse"><span>SPRZEDAŻ</span><svg viewBox="0 0 240 70" role="img" aria-label="Rozwój platformy"><path d="M2 61 C20 58, 28 60, 42 48 S73 51, 88 38 S117 43, 132 28 S164 36, 180 19 S212 27, 238 5" fill="none" stroke="currentColor" strokeWidth="2" /></svg><p>Pakiety sklepowe <b>{overview.packages.filter((item) => item.id === "COMMERCE" || item.id === "OMNICHANNEL").length}</b></p></div>
      </section>
    </main>
  );
}
