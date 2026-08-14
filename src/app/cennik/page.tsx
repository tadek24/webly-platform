import type { Metadata } from "next";
import Link from "next/link";
import { MarketingFrame } from "@/components/marketing-frame";
import { PageIntro } from "@/components/page-intro";
import { siteContent } from "@/content/marketing";
import { getPublishedContent } from "@/lib/marketing-content";

export const metadata: Metadata = {
  title: "Cennik stron i sklepów w abonamencie",
  description: "Przejrzysty cennik landing page, stron firmowych i sklepów internetowych Webly. Hosting, SSL i opieka w abonamencie.",
  alternates: { canonical: "/cennik" },
};

const details = [
  ["Jedna strona", "formularz kontaktowy", "analityka", "hosting i SSL"],
  ["Do 6 podstron", "realizacje lub galeria", "podstawowe SEO", "hosting i SSL"],
  ["WooCommerce", "produkty i warianty", "płatności i dostawy", "hosting i SSL"],
];

export default async function PricingPage() {
  const hero = await getPublishedContent("pricing.hero");
  return (
    <MarketingFrame>
      <PageIntro index={hero.eyebrow.split("/")[0].trim()} kicker={hero.eyebrow.split("/")[1]?.trim() ?? "Cennik"} title={hero.title} italic={hero.accent} lead={hero.lead} />
      <section className="pricing-ledger section-pad">
        {siteContent.plans.map((plan, index) => <article key={plan.name} className={index === 1 ? "featured" : ""}>
          <div className="plan-top"><span>0{index + 1}</span>{index === 1 && <b>NAJCZĘŚCIEJ WYBIERANY</b>}</div>
          <h2>{plan.name}</h2><p>{plan.for}</p>
          <div className="plan-price"><strong>{plan.price}</strong><span>zł netto<br />miesięcznie</span></div>
          <div className="setup-price"><span>Uruchomienie</span><b>{plan.setup} zł netto</b></div>
          <ul>{details[index].map(item => <li key={item}>{item}<span>✓</span></li>)}</ul>
          <Link className={index === 1 ? "button button-accent" : "button button-ink"} href="/kontakt">Wybieram {plan.name.toLowerCase()} <span>↗</span></Link>
        </article>)}
      </section>
      <div className="pricing-footnotes section-grid"><p className="section-index">02 / W cenie każdego planu</p><div><p>Certyfikat SSL</p><p>Aktualizacje</p><p>Kopie bezpieczeństwa</p><p>Pomoc techniczna</p><p>Wersja mobilna</p><p>Własna domena</p></div></div>
    </MarketingFrame>
  );
}
