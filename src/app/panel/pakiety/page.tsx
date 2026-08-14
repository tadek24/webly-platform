import { PackageManager } from "@/components/package-manager";
import { getAdminOverview } from "@/lib/admin-data";

export default async function PackagesPage() {
  const overview = await getAdminOverview();
  return <main className="studio-main admin-page"><section className="admin-page-title"><span>PAKIETY / CENNIK</span><h1>Ceny pod Twoją<br /><em>pełną kontrolą.</em></h1><p>Webly pobiera te dane także na stronie cennika i w panelu abonamentu klienta.</p></section><PackageManager initial={overview.packages} /></main>;
}
