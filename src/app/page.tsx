const sites = [
  { name: "Bella Studio", type: "Strona firmowa", status: "Aktywna", domain: "bella.demo.webly.pl" },
  { name: "Nord Home", type: "Sklep", status: "Konfiguracja", domain: "nord.demo.webly.pl" },
  { name: "Kampania Jesień", type: "Landing page", status: "Aktywna", domain: "jesien.demo.webly.pl" },
];

export default function Dashboard() {
  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand"><span>W</span> Webly</div>
        <nav>
          <a className="active" href="#">Pulpit</a>
          <a href="#witryny">Witryny</a>
          <a href="#szablony">Szablony</a>
          <a href="#klienci">Klienci</a>
          <a href="#abonamenty">Abonamenty</a>
          <a href="#ustawienia">Ustawienia</a>
        </nav>
        <div className="profile"><div className="avatar">TA</div><div><strong>Administrator</strong><small>Panel właściciela</small></div></div>
      </aside>
      <section className="content">
        <header><div><p className="eyebrow">PANEL PLATFORMY</p><h1>Dzień dobry</h1><p className="muted">Twoje strony, sklepy i abonamenty w jednym miejscu.</p></div><button>+ Nowa witryna</button></header>
        <div className="stats">
          <article><p>Aktywne witryny</p><strong>24</strong><span className="up">+3 w tym miesiącu</span></article>
          <article><p>Klienci</p><strong>19</strong><span className="up">+2 w tym miesiącu</span></article>
          <article><p>Przychód miesięczny</p><strong>4 381 zł</strong><span className="up">+12,4%</span></article>
          <article><p>Wymagają uwagi</p><strong>2</strong><span className="warn">Sprawdź płatności</span></article>
        </div>
        <section className="panel" id="witryny">
          <div className="panelTitle"><div><h2>Ostatnie witryny</h2><p>Stan ostatnio tworzonych projektów</p></div><a href="#">Zobacz wszystkie</a></div>
          <div className="table">
            {sites.map((site) => <div className="row" key={site.name}><div className="siteIcon">{site.name[0]}</div><div className="siteName"><strong>{site.name}</strong><small>{site.domain}</small></div><span className="type">{site.type}</span><span className={site.status === "Aktywna" ? "badge live" : "badge setup"}>{site.status}</span><button className="more" aria-label={`Opcje ${site.name}`}>•••</button></div>)}
          </div>
        </section>
        <section className="steps"><div><p className="eyebrow">PIERWSZE MVP</p><h2>Fundament jest gotowy</h2><p>Panel połączymy z WooCommerce przez bezpieczny most API. Następnie dodamy tworzenie witryn z szablonu i prawdziwe dane klientów.</p></div><div className="progress"><span>1</span><div><strong>Panel i architektura</strong><small>W trakcie budowy</small></div></div></section>
      </section>
    </main>
  );
}

