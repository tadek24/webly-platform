import type { Metadata } from "next";
import Link from "next/link";
import { MarketingFrame } from "@/components/marketing-frame";
import { PageIntro } from "@/components/page-intro";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Szablony stron i sklepów",
  description: "Zobacz gotowe projekty stron firmowych, landing page i sklepów internetowych. Każdy projekt można dopasować do marki.",
  alternates: { canonical: "/szablony" },
};

const library = [
  { name: "Atelier 04", kind: "Beauty / usługi", tone: "sand", claim: "Spokój robi wrażenie." },
  { name: "Forma 12", kind: "Architektura / wnętrza", tone: "blue", claim: "Mniej słów. Więcej przestrzeni." },
  { name: "Mercato 03", kind: "Sklep / produkt", tone: "red", claim: "Produkt mówi pierwszy." },
  { name: "Local 08", kind: "Gastro / lokalnie", tone: "green", claim: "Dobre miejsce blisko Ciebie." },
  { name: "Expert 02", kind: "Doradztwo / B2B", tone: "cream", claim: "Wiedza podana konkretnie." },
  { name: "Motion 07", kind: "Kampania / landing", tone: "violet", claim: "Jedna akcja. Mocny efekt." },
];

export default function TemplatesPage() {
  return (
    <MarketingFrame>
      <PageIntro index="01" kicker="Biblioteka" title="Punkty wyjścia z" italic="własnym charakterem." lead="Nie zmieniamy wyłącznie logo i koloru przycisku. Każdy kierunek ma odrębną kompozycję, rytm i zachowanie." />
      <div className="filter-line"><span>WSZYSTKIE / 06</span><button>Firmowe</button><button>Sklepy</button><button>Landing page</button><i>Biblioteka rośnie co miesiąc.</i></div>
      <section className="library-grid section-pad">
        {library.map((item, index) => <Reveal key={item.name} delay={(index % 2) * 80}>
          <article className={`library-item tone-${item.tone}`}>
            <div className="library-canvas">
              <div className="library-top"><span>{item.name}</span><i>●</i><span>MENU</span></div>
              <small>WEBLY / EDITION {String(index + 1).padStart(2,"0")}</small>
              <h2>{item.claim}</h2>
              <div className="library-lines"><span /><span /><span /></div>
              <b>↗</b>
            </div>
            <footer><div><strong>{item.name}</strong><span>{item.kind}</span></div><Link href="/kontakt">Wybieram ten kierunek →</Link></footer>
          </article>
        </Reveal>)}
      </section>
      <section className="custom-note"><span>NIE WIDZISZ SIEBIE?</span><p>Biblioteka jest początkiem rozmowy, nie zamkniętym katalogiem. Dobierzemy najbliższy kierunek i dostosujemy go do Twojej branży.</p><Link className="button button-ink" href="/kontakt">Napisz do nas ↗</Link></section>
    </MarketingFrame>
  );
}

