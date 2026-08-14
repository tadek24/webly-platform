import Link from "next/link";

const navigation = [["Przegląd", "/panel"], ["Witryny", "/panel#witryny"], ["Treści", "/panel/tresci"], ["Klienci", "/panel#klienci"], ["Rozliczenia", "/panel#rozliczenia"]];

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="studio-shell">
      <header className="studio-header">
        <Link href="/panel" className="studio-wordmark"><span>W</span><strong>WEBLY / STUDIO</strong></Link>
        <nav>{navigation.map(([name, href]) => <Link key={name} href={href}>{name}</Link>)}</nav>
        <div className="studio-user"><span>System działa</span><button aria-label="Menu użytkownika">TA</button></div>
      </header>
      {children}
    </div>
  );
}

