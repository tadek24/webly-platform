import Link from "next/link";
import { requireAdminSession } from "@/lib/customer-session";

const navigation = [["Przegląd", "/panel"], ["Klienci", "/panel/klienci"], ["Pakiety", "/panel/pakiety"], ["Treści", "/panel/tresci"], ["Strona Webly ↗", "/"]];

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdminSession();
  return (
    <div className="studio-shell">
      <header className="studio-header">
        <Link href="/panel" className="studio-wordmark"><span>W</span><strong>WEBLY / STUDIO</strong></Link>
        <nav>{navigation.map(([name, href]) => <Link key={name} href={href}>{name}</Link>)}</nav>
        <div className="studio-user"><span>{admin.name}</span><form action="/api/auth/logout" method="post"><button aria-label="Wyloguj">WYJDŹ</button></form></div>
      </header>
      {children}
    </div>
  );
}
