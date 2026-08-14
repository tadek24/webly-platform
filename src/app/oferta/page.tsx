import type { Metadata } from "next";
import Link from "next/link";
import { MarketingFrame } from "@/components/marketing-frame";
import { PageIntro } from "@/components/page-intro";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Oferta — strony, landing page i sklepy internetowe",
  description: "Strony firmowe, landing page i sklepy WooCommerce w abonamencie. Poznaj zakres wdrożenia, opieki i obsługi technicznej Webly.",
  alternates: { canonical: "/oferta" },
};

const services = [
  { no: "A", title: "Landing page", text: "Jedna dobrze poprowadzona historia dla konkretnej usługi, kampanii albo premiery.", items: ["projekt dopasowany do celu", "formularz i analityka", "wersja mobilna", "podpięcie domeny"] },
  { no: "B", title: "Strona firmowa", text: "Pełna, wiarygodna obecność firmy w sieci bez tygodni samodzielnego układania sekcji.", items: ["do 6 podstron", "oferta, realizacje i kontakt", "podstawowe SEO", "opieka techniczna"] },
  { no: "C", title: "Sklep internetowy", text: "Gotowy projekt połączony z WooCommerce — z wygodną obsługą produktów i zamówień.", items: ["produkty i warianty", "płatności i dostawy", "kupony i zamówienia", "szkolenie z obsługi"] },
];

export default function OfferPage() {
  return (
    <MarketingFrame>
      <PageIntro index="01" kicker="Oferta" title="Wybierz punkt startu." italic="Nie buduj zaplecza." lead="Każdy wariant obejmuje projekt, uruchomienie i późniejszą opiekę. Różni je skala — nie jakość wykonania." />
      <section className="service-ledger section-pad">
        {services.map((service, index) => <Reveal key={service.title} delay={index * 80}>
          <article className="service-entry">
            <span className="service-letter">{service.no}</span>
            <div><small>0{index + 1} / PRODUKT</small><h2>{service.title}</h2><p>{service.text}</p></div>
            <ul>{service.items.map(item => <li key={item}>{item}<span>+</span></li>)}</ul>
            <Link href="/cennik" aria-label={`Cena: ${service.title}`}>Sprawdź cenę ↗</Link>
          </article>
        </Reveal>)}
      </section>
      <Reveal>
        <section className="care-band">
          <div><span>STAŁA OPIEKA / 365</span><h2>Po publikacji<br /><em>nie znikamy.</em></h2></div>
          <div className="care-grid"><p><b>01</b> Hosting i SSL</p><p><b>02</b> Aktualizacje systemu</p><p><b>03</b> Codzienne kopie</p><p><b>04</b> Pomoc techniczna</p></div>
        </section>
      </Reveal>
      <section id="faq" className="faq section-grid section-pad">
        <p className="section-index">02 / Pytania bez drobnego druku</p>
        <div>
          {[ ["Czy strona jest moja?", "Tak. Masz własną domenę, treści i dane. Abonament obejmuje infrastrukturę, opiekę i licencję na wybrany projekt."], ["Czy mogę zmieniać treści?", "Tak. Panel treści przygotowujemy właśnie po to, aby najczęstsze zmiany nie wymagały kontaktu z programistą."], ["Ile trwa uruchomienie?", "Landing zwykle 3–5 dni roboczych, strona firmowa 5–10 dni, a sklep zależnie od liczby produktów i integracji."], ["Co jeśli potrzebuję czegoś nietypowego?", "Najpierw sprawdzamy, czy da się to rozsądnie dołączyć do produktu. Większe funkcje wyceniamy oddzielnie."] ].map(([q,a]) => <details key={q}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}
        </div>
      </section>
    </MarketingFrame>
  );
}

