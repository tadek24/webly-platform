import type { Metadata } from "next";
import Link from "next/link";
import { MarketingFrame } from "@/components/marketing-frame";
import { Reveal } from "@/components/reveal";
import { siteContent } from "@/content/marketing";

export const metadata: Metadata = {
  title: "Gotowe strony i sklepy internetowe w abonamencie",
  description: "Wybierz projekt, podmień treści i zacznij działać. Gotowe strony firmowe, landing page i sklepy WooCommerce bez budowania od zera.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Webly — gotowa strona, która wygląda jak Twoja",
    description: "Gotowe strony i sklepy w abonamencie. Projekt, hosting i opieka w jednym miejscu.",
    url: "/",
  },
};

const templates = [
  { name: "Atelier 04", kind: "Usługi premium", className: "template-atelier", note: "cisza, rytm, detal" },
  { name: "Forma 12", kind: "Architektura", className: "template-forma", note: "duży obraz, mocny typ" },
  { name: "Mercato 03", kind: "Sklep", className: "template-mercato", note: "produkt na pierwszym planie" },
];

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Webly",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://webly-platform-sigma.vercel.app",
    description: siteContent.seo.description,
    offers: siteContent.plans.map((plan) => ({
      "@type": "Offer",
      name: plan.name,
      price: plan.price,
      priceCurrency: "PLN",
      category: plan.for,
    })),
  };

  return (
    <MarketingFrame>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="hero section-grid">
        <div className="hero-copy">
          <p className="section-index">01 / Nie zaczynaj od pustej kartki</p>
          <h1>
            Strona, która
            <span className="hero-shift"><i>od razu</i> wygląda</span>
            jak Twoja.
          </h1>
          <div className="hero-bottom">
            <p>{siteContent.hero.lead}</p>
            <div className="button-row">
              <Link className="button button-ink" href="/szablony">Zobacz projekty <span>↗</span></Link>
              <Link className="text-link" href="/oferta">Jak to działa <span>→</span></Link>
            </div>
          </div>
        </div>

        <div className="hero-stage" aria-label="Animowany podgląd procesu tworzenia strony">
          <div className="stage-grid" />
          <div className="stage-note note-one">gotowe<br />w kilka dni</div>
          <div className="stage-note note-two">bez<br />kombinowania</div>
          <div className="browser-sheet sheet-back">
            <div className="sheet-bar"><span /><span /><span /></div>
            <div className="wire-title" /><div className="wire-line" /><div className="wire-line short" />
          </div>
          <div className="browser-sheet sheet-front">
            <div className="sheet-brand">NORD / 24</div>
            <p>Nowa kolekcja</p>
            <strong>Rzeczy<br />z charakterem.</strong>
            <span className="sheet-cta">Przejdź do sklepu →</span>
          </div>
          <div className="stage-cursor"><span>WYBIERZ</span></div>
          <div className="stage-caption">Projekt łączy się z Twoją marką</div>
        </div>
      </section>

      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          <span>STRONA FIRMOWA</span><b>✦</b><span>SKLEP INTERNETOWY</span><b>✦</b><span>LANDING PAGE</span><b>✦</b><span>HOSTING I OPIEKA</span><b>✦</b>
          <span>STRONA FIRMOWA</span><b>✦</b><span>SKLEP INTERNETOWY</span><b>✦</b><span>LANDING PAGE</span><b>✦</b><span>HOSTING I OPIEKA</span><b>✦</b>
        </div>
      </div>

      <Reveal>
        <section className="manifesto section-grid section-pad">
          <p className="section-index">02 / Po prostu działa</p>
          <div className="manifesto-copy">
            <h2>Nie sprzedajemy kreatora.<br /><em>Oddajemy gotowy punkt startu.</em></h2>
            <div className="manifesto-columns">
              <p>Wybierasz kierunek, wysyłasz materiały, a my składamy całość. Bez tygodni przesuwania bloków i zastanawiania się, czy przycisk powinien być pięć pikseli wyżej.</p>
              <p>Każdy projekt ma własny rytm, typografię i charakter. Ty zajmujesz się firmą. My pilnujemy strony, aktualizacji i technicznego zaplecza.</p>
            </div>
          </div>
        </section>
      </Reveal>

      <section className="template-section section-pad">
        <div className="section-heading section-grid">
          <p className="section-index">03 / Projekty, nie motywy</p>
          <div><h2>Dobry szablon nie wygląda<br />jak szablon.</h2><Link className="text-link" href="/szablony">Cała biblioteka <span>→</span></Link></div>
        </div>
        <div className="template-rail">
          {templates.map((template, index) => (
            <Reveal key={template.name} delay={index * 90}>
              <article className="template-card">
                <div className={`template-art ${template.className}`}>
                  <span className="template-number">0{index + 1}</span>
                  <div className="mini-nav">{template.name}<span>MENU +</span></div>
                  <div className="mini-copy"><small>{template.kind}</small><strong>{template.note}</strong></div>
                </div>
                <footer><div><strong>{template.name}</strong><span>{template.kind}</span></div><span>Podgląd ↗</span></footer>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal>
        <section className="process section-grid section-pad">
          <p className="section-index">04 / Trzy ruchy</p>
          <div className="process-list">
            {siteContent.process.map((item, index) => (
              <div className="process-row" key={item.title}>
                <span>0{index + 1}</span><h3>{item.title}</h3><p>{item.text}</p><i>↘</i>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="home-pricing section-pad">
          <div className="pricing-intro">
            <p className="section-index">05 / Jasne zasady</p>
            <h2>Jedna opłata.<br /><em>Zero technicznego chaosu.</em></h2>
            <p>Projekt, hosting, SSL, aktualizacje i pomoc techniczna — w jednym abonamencie.</p>
          </div>
          <div className="price-ticket">
            <span className="ticket-label">Najczęstszy wybór</span>
            <div className="ticket-name">Strona firmowa</div>
            <div className="ticket-price"><strong>129</strong><span>zł netto<br />/ miesiąc</span></div>
            <ul><li>do 6 podstron</li><li>własna domena i SSL</li><li>opieka i aktualizacje</li><li>podstawowe SEO</li></ul>
            <Link className="button button-accent" href="/cennik">Porównaj pakiety <span>↗</span></Link>
          </div>
        </section>
      </Reveal>

      <section className="closing-cta">
        <div className="closing-orbit">WEBLY — ONLINE — WEBLY — ONLINE —</div>
        <p>Masz firmę.<br />My mamy dla niej <em>miejsce w sieci.</em></p>
        <Link className="button button-paper" href="/kontakt">Porozmawiajmy <span>↗</span></Link>
      </section>
    </MarketingFrame>
  );
}

