import Link from "next/link";

const projects = [
  { id: "W–024", name: "Bella Studio", url: "bella.demo.webly.pl", type: "Firma", status: "ONLINE", activity: "12 min temu" },
  { id: "W–023", name: "Nord Home", url: "nord.demo.webly.pl", type: "Sklep", status: "W BUDOWIE", activity: "dzisiaj, 09:42" },
  { id: "W–022", name: "Kampania Jesień", url: "jesien.demo.webly.pl", type: "Landing", status: "ONLINE", activity: "wczoraj" },
  { id: "W–021", name: "Forma Studio", url: "forma.demo.webly.pl", type: "Firma", status: "OCZEKUJE", activity: "12.08.2026" },
];

export default function StudioDashboard() {
  return (
    <main className="studio-main">
      <section className="studio-masthead">
        <div><p>PIĄTEK / 14 SIERPNIA</p><h1>Co dziś<br /><em>uruchamiamy?</em></h1></div>
        <div className="studio-actions"><Link href="/panel/tresci">Edytuj stronę Webly <span>↗</span></Link><button>+ NOWA WITRYNA</button></div>
      </section>

      <section className="metric-line" aria-label="Najważniejsze statystyki">
        <div><span>AKTYWNE WITRYNY</span><strong>24</strong><small>↑ 3 / miesiąc</small></div>
        <div><span>KLIENCI</span><strong>19</strong><small>↑ 2 / miesiąc</small></div>
        <div className="wide"><span>PRZYCHÓD CYKLICZNY</span><strong>4 381 <i>PLN</i></strong><small>↑ 12,4%</small></div>
        <div className="attention"><span>DO SPRAWDZENIA</span><strong>02</strong><small>płatności</small></div>
      </section>

      <section className="workbench" id="witryny">
        <div className="workbench-head"><div><span>REJESTR / WITRYNY</span><h2>Ostatnia aktywność</h2></div><div className="view-switch"><button className="selected">Lista</button><button>Siatka</button><button>Filtr +</button></div></div>
        <div className="project-ledger">
          <div className="ledger-head"><span>ID</span><span>PROJEKT</span><span>TYP</span><span>STATUS</span><span>OSTATNIA ZMIANA</span><span /></div>
          {projects.map((project) => <div className="project-record" key={project.id}>
            <span>{project.id}</span><div><strong>{project.name}</strong><small>{project.url}</small></div><span>{project.type}</span><b className={`project-status status-${project.status.replace(" ", "-").toLowerCase()}`}>{project.status}</b><span>{project.activity}</span><button aria-label={`Otwórz ${project.name}`}>↗</button>
          </div>)}
        </div>
      </section>

      <section className="studio-bottom">
        <div className="build-queue"><span>KOLEJKA WDROŻEŃ</span><strong>Nord Home</strong><div><i style={{ width: "68%" }} /></div><p>Treści i produkty <b>68%</b></p></div>
        <div className="quick-note"><span>NOTATKA / 14.08</span><p>Po podłączeniu WordPressa uruchomić synchronizację sekcji marketingowych.</p><Link href="/panel/tresci">Otwórz treści →</Link></div>
        <div className="pulse"><span>OSTATNIE 30 DNI</span><svg viewBox="0 0 240 70" role="img" aria-label="Wykres wzrostu"><path d="M2 61 C20 58, 28 60, 42 48 S73 51, 88 38 S117 43, 132 28 S164 36, 180 19 S212 27, 238 5" fill="none" stroke="currentColor" strokeWidth="2" /></svg><p>Nowe wdrożenia <b>+7</b></p></div>
      </section>
    </main>
  );
}

