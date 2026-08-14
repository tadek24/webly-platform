import type { Metadata } from "next";
import Link from "next/link";
import { MarketingFrame } from "@/components/marketing-frame";
import { PageIntro } from "@/components/page-intro";
import { getPackages } from "@/lib/customer-data";
import { getPublishedContent } from "@/lib/marketing-content";
import { DEFAULT_PACKAGES } from "@/lib/package-defaults";

export const metadata: Metadata = {
  title: "Cennik stron i sklepów w abonamencie",
  description: "Przejrzysty cennik stron firmowych, landing page i zarządzanych sklepów Webly. Hosting, SSL i opieka bez instalowania WordPressa.",
  alternates: { canonical: "/cennik" },
};

export default async function PricingPage() {
  const [hero, packages] = await Promise.all([getPublishedContent("pricing.hero"), getPackages().catch(() => DEFAULT_PACKAGES)]);
  return (
    <MarketingFrame>
      <PageIntro index={hero.eyebrow.split("/")[0].trim()} kicker={hero.eyebrow.split("/")[1]?.trim() ?? "Cennik"} title={hero.title} italic={hero.accent} lead={hero.lead} />
      <section className="pricing-ledger section-pad">
        {packages.map((plan, index) => <article key={plan.id} className={plan.id === "PRO" ? "featured" : ""}>
          <div className="plan-top"><span>{String(index + 1).padStart(2, "0")}</span>{plan.id === "PRO" && <b>NAJCZĘŚCIEJ WYBIERANY</b>}</div>
          <h2>{plan.name}</h2><p>{plan.audience}</p>
          <div className="plan-price"><strong>{plan.price.toLocaleString("pl-PL")}</strong><span>zł netto<br />miesięcznie</span></div>
          <div className="setup-price"><span>Uruchomienie</span><b>{plan.setup.toLocaleString("pl-PL")} zł netto</b></div>
          <ul>{plan.features.map((item) => <li key={item}>{item}<span>✓</span></li>)}</ul>
          <Link className={plan.id === "PRO" ? "button button-accent" : "button button-ink"} href="/rejestracja">Wybieram {plan.name.toLowerCase()} <span>↗</span></Link>
        </article>)}
      </section>
      <div className="pricing-footnotes section-grid"><p className="section-index">02 / Webly zajmuje się techniką</p><div><p>Bez instalacji WordPressa</p><p>Hosting i SSL</p><p>Aktualizacje</p><p>Kopie bezpieczeństwa</p><p>Pomoc techniczna</p><p>Podłączenie domeny</p></div></div>
    </MarketingFrame>
  );
}
