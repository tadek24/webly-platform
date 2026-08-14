import Link from "next/link";

const nav = [
  ["Oferta", "/oferta"], ["Szablony", "/szablony"], ["Cennik", "/cennik"], ["Kontakt", "/kontakt"],
];

export function MarketingFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="marketing-shell">
      <header className="site-header">
        <Link href="/" className="wordmark" aria-label="Webly — strona główna"><span>W</span><strong>webly</strong><small>strony, które działają</small></Link>
        <nav aria-label="Główna nawigacja">{nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav>
        <Link className="header-panel-link" href="/logowanie">Zaloguj się <span>↗</span></Link>
        <details className="mobile-menu">
          <summary>MENU +</summary>
          <div>{nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}<Link href="/logowanie">Panel klienta ↗</Link><Link href="/rejestracja">Załóż konto →</Link></div>
        </details>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <div className="footer-brand"><span>W</span><strong>webly</strong><p>Gotowe strony i sklepy<br />w spokojnym abonamencie.</p></div>
        <div><small>NA SKRÓTY</small>{nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</div>
        <div><small>PRODUKT</small><Link href="/logowanie">Panel klienta</Link><Link href="/rejestracja">Załóż konto</Link><Link href="/oferta#faq">FAQ</Link></div>
        <div className="footer-contact"><small>KONTAKT</small><a href="mailto:hello@webly.pl">hello@webly.pl</a><p>pon–pt / 9:00–17:00</p></div>
        <p className="footer-legal">© {new Date().getFullYear()} Webly <span>Projektujemy w Polsce.</span></p>
      </footer>
    </div>
  );
}
