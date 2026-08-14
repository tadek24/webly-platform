import Link from "next/link";
import { StoreConsole } from "@/components/store-console";
import { getCustomerSites, getStoreData } from "@/lib/customer-data";
import { requireCustomerSession } from "@/lib/customer-session";

export default async function StorePage() {
  const customer = await requireCustomerSession();
  const [sites, store] = await Promise.all([getCustomerSites(customer.id), getStoreData(customer.id)]);
  const hasStore = sites.some((site) => site.kind === "STORE");
  return <main className="account-main"><section className="account-page-title store-page-title"><span>CENTRUM SPRZEDAŻY</span><h1>Sklep, zamówienia<br /><em>i wszystkie kanały.</em></h1><p>Cały sklep obsługujesz tutaj. Webly utrzymuje silnik sprzedaży, hosting i aktualizacje — nie instalujesz WordPressa ani żadnych wtyczek.</p></section>{hasStore ? <StoreConsole initial={store} /> : <div className="store-no-site"><span>SKLEP / 00</span><h2>Uruchom sklep z gotowego projektu.</h2><p>Wybierz Mercato, wpisz nazwę i od razu przejdź do produktów. Domena może zostać podłączona później samodzielnie lub przez nas jako usługa dodatkowa.</p><Link href="/konto/witryny/nowa?template=mercato-03">UTWÓRZ SKLEP →</Link></div>}</main>;
}
