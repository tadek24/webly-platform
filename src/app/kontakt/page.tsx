import type { Metadata } from "next";
import { MarketingFrame } from "@/components/marketing-frame";
import { PageIntro } from "@/components/page-intro";
import { getPublishedContent } from "@/lib/marketing-content";

export const metadata: Metadata = {
  title: "Kontakt — rozpocznij projekt",
  description: "Opowiedz nam o swojej firmie. Dobierzemy rodzaj strony, projekt i pakiet Webly.",
  alternates: { canonical: "/kontakt" },
};

export default async function ContactPage() {
  const hero = await getPublishedContent("contact.hero");
  return (
    <MarketingFrame>
      <PageIntro index={hero.eyebrow.split("/")[0].trim()} kicker={hero.eyebrow.split("/")[1]?.trim() ?? "Kontakt"} title={hero.title} italic={hero.accent} lead={hero.lead} />
      <section className="contact-layout section-pad">
        <form className="contact-form">
          <label><span>01 / Jak masz na imię?</span><input name="name" placeholder="Twoje imię" autoComplete="name" /></label>
          <label><span>02 / Gdzie możemy odpisać?</span><input name="email" type="email" placeholder="adres@twojafirma.pl" autoComplete="email" /></label>
          <label><span>03 / Czego potrzebujesz?</span><select name="product" defaultValue=""><option value="" disabled>Wybierz rodzaj projektu</option><option>Landing page</option><option>Strona firmowa</option><option>Sklep internetowy</option><option>Jeszcze nie wiem</option></select></label>
          <label><span>04 / Opowiedz dwa zdania</span><textarea name="message" rows={4} placeholder="Czym zajmuje się firma i co powinna robić nowa strona?" /></label>
          <button className="button button-ink" type="button">Wyślij wiadomość <span>↗</span></button>
          <small>Formularz podłączymy do WordPressa po konfiguracji zaplecza.</small>
        </form>
        <aside className="contact-aside"><span>BEZ FORMULARZA?</span><a href="mailto:hello@webly.pl">hello@webly.pl ↗</a><p>Odpowiadamy zwykle w ciągu jednego dnia roboczego.</p><div className="contact-stamp"><strong>W</strong><i>MADE FOR<br />REAL BUSINESS</i></div></aside>
      </section>
    </MarketingFrame>
  );
}
