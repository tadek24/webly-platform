export type MarketingContentKey = "home.hero" | "offer.hero" | "templates.hero" | "pricing.hero" | "contact.hero";

export type MarketingHeroContent = {
  eyebrow: string;
  title: string;
  accent: string;
  tail?: string;
  lastLine?: string;
  lead: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export const DEFAULT_MARKETING_CONTENT: Record<MarketingContentKey, MarketingHeroContent> = {
  "home.hero": {
    eyebrow: "01 / Nie zaczynaj od pustej kartki",
    title: "Strona, która",
    accent: "od razu",
    tail: "wygląda",
    lastLine: "jak Twoja.",
    lead: "Gotowy projekt, Twoje treści i pełne zaplecze techniczne. Uruchamiamy stronę, a potem dbamy, żeby po prostu działała.",
    primaryLabel: "Zobacz projekty",
    primaryHref: "/szablony",
    secondaryLabel: "Jak to działa",
    secondaryHref: "/oferta",
  },
  "offer.hero": {
    eyebrow: "01 / Oferta",
    title: "Wybierz punkt startu.",
    accent: "Nie buduj zaplecza.",
    lead: "Każdy wariant obejmuje projekt, uruchomienie i późniejszą opiekę. Różni je skala — nie jakość wykonania.",
  },
  "templates.hero": {
    eyebrow: "01 / Biblioteka",
    title: "Punkty wyjścia z",
    accent: "własnym charakterem.",
    lead: "Nie zmieniamy wyłącznie logo i koloru przycisku. Każdy kierunek ma odrębną kompozycję, rytm i zachowanie.",
  },
  "pricing.hero": {
    eyebrow: "01 / Cennik",
    title: "Płacisz za efekt.",
    accent: "Nie za liczbę kliknięć.",
    lead: "Na początku opłata za przygotowanie i uruchomienie. Później prosty abonament za technikę, opiekę i rozwój produktu.",
  },
  "contact.hero": {
    eyebrow: "01 / Kontakt",
    title: "Najpierw krótka",
    accent: "rozmowa o Twojej firmie.",
    lead: "Nie musisz znać technologii ani mieć gotowego briefu. Napisz, czym się zajmujesz i czego potrzebujesz.",
  },
};

export async function getPublishedContent(key: MarketingContentKey): Promise<MarketingHeroContent> {
  const fallback = DEFAULT_MARKETING_CONTENT[key];
  const baseUrl = process.env.WP_BASE_URL?.replace(/\/$/, "");
  if (!baseUrl) return fallback;

  try {
    const url = new URL(baseUrl);
    url.searchParams.set("rest_route", "/webly/v1/content");
    url.searchParams.set("key", key);
    url.searchParams.set("status", "published");

    const response = await fetch(url, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return fallback;
    const data = await response.json() as { content?: Partial<MarketingHeroContent> };
    return { ...fallback, ...(data.content ?? {}) };
  } catch {
    return fallback;
  }
}
