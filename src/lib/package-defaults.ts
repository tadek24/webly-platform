import type { PackageDefinition } from "@/lib/site-builder-types";

export const DEFAULT_PACKAGES: PackageDefinition[] = [
  { id: "START", name: "Start", price: 79, setup: 990, description: "Prosta strona lub landing page.", audience: "Dla jednoosobowej firmy i kampanii", siteLimit: 1, features: ["1 witryna", "własna domena", "formularz kontaktowy", "hosting i SSL"] },
  { id: "PRO", name: "Pro", price: 149, setup: 1490, description: "Pełna strona firmowa z większą liczbą sekcji.", audience: "Dla rozwijającej się firmy", siteLimit: 3, features: ["3 witryny", "galerie i formularze", "podstawowe SEO", "opieka techniczna"] },
  { id: "COMMERCE", name: "Commerce", price: 299, setup: 2990, description: "Zarządzany sklep internetowy Webly.", audience: "Dla własnego sklepu internetowego", siteLimit: 2, features: ["produkty i warianty", "płatności i dostawy", "panel zamówień", "zarządzany silnik sklepu"] },
  { id: "OMNICHANNEL", name: "Omnichannel", price: 699, setup: 5990, description: "Sklep z obsługą wielu kanałów sprzedaży.", audience: "Dla sprzedaży marketplace", siteLimit: 4, features: ["Allegro i ERLI", "Amazon i Empik", "BaseLinker lub Apilo", "automatyzacje zamówień"] },
];
