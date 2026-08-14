"use client";

import { useState } from "react";

export function ContentWorkspace() {
  const [headline, setHeadline] = useState("Strona, która od razu wygląda jak Twoja.");
  const [lead, setLead] = useState("Gotowy projekt, Twoje treści i pełne zaplecze techniczne.");
  const [status, setStatus] = useState("Zmiany lokalne");

  function prepareDraft() {
    setStatus("Wersja robocza przygotowana — zapis podłączymy przez WordPress API");
  }

  return (
    <div className="content-workspace">
      <aside className="content-tree">
        <span>STRONA PUBLICZNA</span>
        <button className="active">Strona główna <b>8</b></button><button>Oferta <b>6</b></button><button>Szablony <b>2</b></button><button>Cennik <b>4</b></button><button>Kontakt <b>3</b></button>
        <div className="source-state"><i /><strong>Źródło: plik lokalny</strong><p>Połączymy z WordPress REST API.</p></div>
      </aside>
      <section className="content-editor">
        <header><div><span>TREŚCI / STRONA GŁÓWNA</span><h1>Sekcja otwierająca</h1></div><div><small>{status}</small><button onClick={prepareDraft}>PRZYGOTUJ WERSJĘ ROBOCZĄ</button></div></header>
        <div className="editor-grid">
          <form>
            <label><span>Nagłówek H1</span><textarea rows={3} value={headline} onChange={(event) => setHeadline(event.target.value)} /><small>{headline.length} / 90 znaków</small></label>
            <label><span>Tekst wprowadzający</span><textarea rows={4} value={lead} onChange={(event) => setLead(event.target.value)} /><small>{lead.length} / 180 znaków</small></label>
            <label><span>Tekst przycisku</span><input defaultValue="Zobacz projekty" /></label>
            <label><span>Adres przycisku</span><input defaultValue="/szablony" /></label>
          </form>
          <div className="live-preview"><div className="preview-bar"><span>PODGLĄD / DESKTOP</span><i>webly.pl</i></div><div className="preview-body"><small>01 / NIE ZACZYNAJ OD PUSTEJ KARTKI</small><h2>{headline}</h2><p>{lead}</p><button>Zobacz projekty ↗</button></div></div>
        </div>
      </section>
    </div>
  );
}

