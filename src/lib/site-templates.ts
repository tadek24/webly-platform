import type { SiteBlock, SiteKind } from "@/lib/site-builder-types";

export type SiteTemplate = {
  id: string;
  name: string;
  kind: SiteKind;
  category: string;
  description: string;
  claim: string;
  theme: string;
  blocks: SiteBlock[];
};

export const SITE_TEMPLATES: SiteTemplate[] = [
  {
    id: "atelier-04",
    name: "Atelier 04",
    kind: "BUSINESS",
    category: "Beauty / usługi",
    description: "Spokojny, magazynowy układ dla marek osobistych, salonów i usług premium.",
    claim: "Spokój robi wrażenie.",
    theme: "sand",
    blocks: [
      { id: "atelier-hero", type: "hero", kicker: "STUDIO / WARSZAWA", title: "Mniej pośpiechu. Więcej Twojego czasu.", body: "Kameralne studio, świadome rytuały i pielęgnacja dopasowana do Ciebie.", buttonLabel: "Umów wizytę", buttonHref: "#kontakt", align: "left" },
      { id: "atelier-text", type: "text", kicker: "O NAS", title: "Piękno nie potrzebuje filtra.", body: "Pracujemy spokojnie, uważnie i bez obietnic bez pokrycia. Każda wizyta zaczyna się od rozmowy.", align: "left" },
      { id: "atelier-features", type: "features", kicker: "USŁUGI", title: "Wybierz swój rytuał", items: ["Pielęgnacja twarzy", "Masaż kobido", "Konsultacja skóry"], align: "left" },
      { id: "atelier-cta", type: "cta", title: "Znajdź godzinę tylko dla siebie.", buttonLabel: "Rezerwuję", buttonHref: "#kontakt", align: "center" },
    ],
  },
  {
    id: "forma-12",
    name: "Forma 12",
    kind: "BUSINESS",
    category: "Architektura / wnętrza",
    description: "Dużo światła, mocna typografia i miejsce na realizacje pracowni.",
    claim: "Mniej słów. Więcej przestrzeni.",
    theme: "blue",
    blocks: [
      { id: "forma-hero", type: "hero", kicker: "FORMA / ARCHITEKTURA", title: "Przestrzeń, która pracuje razem z Tobą.", body: "Projektujemy wnętrza prywatne i komercyjne od pierwszego szkicu po nadzór realizacji.", buttonLabel: "Zobacz projekty", buttonHref: "#realizacje", align: "left" },
      { id: "forma-features", type: "features", kicker: "PROCES", title: "Od rozmowy do realizacji", items: ["Koncepcja", "Projekt wykonawczy", "Nadzór autorski"], align: "left" },
      { id: "forma-text", type: "text", kicker: "PODEJŚCIE", title: "Najpierw funkcja. Potem forma.", body: "Nie projektujemy pod zdjęcie. Tworzymy miejsca, w których dobrze się mieszka, pracuje i odpoczywa.", align: "left" },
      { id: "forma-cta", type: "cta", title: "Opowiedz nam o swojej przestrzeni.", buttonLabel: "Zacznijmy projekt", buttonHref: "#kontakt", align: "center" },
    ],
  },
  {
    id: "mercato-03",
    name: "Mercato 03",
    kind: "STORE",
    category: "Sklep / produkt",
    description: "Wyrazisty sklep dla jednej kategorii produktów i krótkiej ścieżki zakupu.",
    claim: "Produkt mówi pierwszy.",
    theme: "red",
    blocks: [
      { id: "mercato-hero", type: "hero", kicker: "NOWA KOLEKCJA", title: "Przedmioty do codziennego używania.", body: "Dobre materiały, krótka seria i projekt, który zostaje na dłużej.", buttonLabel: "Kup kolekcję", buttonHref: "#produkty", align: "left" },
      { id: "mercato-products", type: "products", kicker: "SKLEP / BESTSELLERY", title: "Najczęściej wybierane", items: ["Kubek Terra|89 zł", "Talerz Forma|119 zł", "Wazon Alto|149 zł"], align: "left" },
      { id: "mercato-features", type: "features", kicker: "DLACZEGO MY", title: "Mniej, ale lepiej", items: ["Produkcja w Polsce", "Naturalne materiały", "Wysyłka w 24 godziny"], align: "left" },
      { id: "mercato-text", type: "text", kicker: "EDYCJA 03", title: "Krótka seria. Długi czas życia.", body: "Każdy produkt powstaje w małej partii i przechodzi ręczną kontrolę jakości.", align: "center" },
      { id: "mercato-cta", type: "cta", title: "Zobacz całą kolekcję.", buttonLabel: "Przejdź do sklepu", buttonHref: "#produkty", align: "center" },
      { id: "mercato-contact", type: "contact", kicker: "POMOC", title: "Zapytaj o produkt", body: "Odpowiadamy w dni robocze i pomagamy dobrać wariant.", buttonLabel: "Wyślij wiadomość", align: "left" },
    ],
  },
  {
    id: "local-08",
    name: "Local 08",
    kind: "BUSINESS",
    category: "Gastro / lokalnie",
    description: "Energetyczna strona dla restauracji, kawiarni i lokalnych miejsc.",
    claim: "Dobre miejsce blisko Ciebie.",
    theme: "green",
    blocks: [
      { id: "local-hero", type: "hero", kicker: "CODZIENNIE / 8–22", title: "Tu zaczyna się dobry dzień.", body: "Śniadania przez cały dzień, własne wypieki i kawa od ludzi, których znamy.", buttonLabel: "Zobacz menu", buttonHref: "#menu", align: "left" },
      { id: "local-features", type: "features", kicker: "DZISIAJ", title: "Prosto z kuchni", items: ["Jajka po turecku", "Chałka z ricottą", "Miska sezonowa"], align: "left" },
      { id: "local-text", type: "text", kicker: "NASZE MIEJSCE", title: "Wpadnij bez okazji.", body: "Jesteśmy osiedlowym stołem. Możesz przyjść na chwilę, zostać na długo albo zabrać wszystko ze sobą.", align: "left" },
      { id: "local-cta", type: "cta", title: "Stolik czeka.", buttonLabel: "Rezerwuję stolik", buttonHref: "#kontakt", align: "center" },
    ],
  },
  {
    id: "expert-02",
    name: "Expert 02",
    kind: "BUSINESS",
    category: "Doradztwo / B2B",
    description: "Precyzyjna strona ekspercka z jasną ofertą i mocnym wezwaniem do kontaktu.",
    claim: "Wiedza podana konkretnie.",
    theme: "cream",
    blocks: [
      { id: "expert-hero", type: "hero", kicker: "STRATEGIA / SPRZEDAŻ", title: "Decyzje oparte na liczbach, nie przeczuciach.", body: "Pomagam firmom uporządkować sprzedaż, ofertę i proces pozyskiwania klientów.", buttonLabel: "Umów konsultację", buttonHref: "#kontakt", align: "left" },
      { id: "expert-features", type: "features", kicker: "WSPÓŁPRACA", title: "Trzy konkretne formaty", items: ["Audyt procesu", "Warsztat strategiczny", "Wsparcie miesięczne"], align: "left" },
      { id: "expert-text", type: "text", kicker: "EFEKT", title: "Zespół wie, co robić dalej.", body: "Kończymy planem, odpowiedzialnością i miernikami. Bez prezentacji, która trafia do szuflady.", align: "left" },
      { id: "expert-cta", type: "cta", title: "Porozmawiajmy o Twoim celu.", buttonLabel: "Wybierz termin", buttonHref: "#kontakt", align: "center" },
    ],
  },
  {
    id: "motion-07",
    name: "Motion 07",
    kind: "LANDING",
    category: "Kampania / landing",
    description: "Szybki landing dla kampanii, premiery produktu lub zbierania zapisów.",
    claim: "Jedna akcja. Mocny efekt.",
    theme: "violet",
    blocks: [
      { id: "motion-hero", type: "hero", kicker: "PREMIERA / 24.09", title: "Jedno spotkanie może zmienić Twój następny kwartał.", body: "Intensywny warsztat dla właścicieli firm, którzy chcą odzyskać kontrolę nad marketingiem.", buttonLabel: "Rezerwuję miejsce", buttonHref: "#zapis", align: "center" },
      { id: "motion-features", type: "features", kicker: "W PROGRAMIE", title: "Cztery godziny konkretu", items: ["Pozycjonowanie oferty", "Plan komunikacji", "Priorytety na 90 dni"], align: "left" },
      { id: "motion-text", type: "text", kicker: "DLA KOGO", title: "Dla osób, które nie potrzebują kolejnej inspiracji.", body: "Potrzebujesz decyzji, planu i spokojnego przekonania, że wiesz, co zrobić w poniedziałek.", align: "center" },
      { id: "motion-cta", type: "cta", title: "Zostało 12 miejsc.", buttonLabel: "Dołączam", buttonHref: "#zapis", align: "center" },
    ],
  },
];

export function getSiteTemplate(id: string) {
  return SITE_TEMPLATES.find((template) => template.id === id);
}
