import { AdminCustomerManager } from "@/components/admin-customer-manager";
import { getAdminOverview } from "@/lib/admin-data";

export default async function CustomersPage() {
  const overview = await getAdminOverview();
  return <main className="studio-main admin-page"><section className="admin-page-title"><span>KLIENCI / DOSTĘPY</span><h1>Kontroluj abonamenty<br /><em>bez wchodzenia do WordPressa.</em></h1><p>Zmiana pakietu, statusu płatności i dostępu do konta odbywa się z jednego miejsca.</p></section><AdminCustomerManager initial={overview.customers} /></main>;
}
