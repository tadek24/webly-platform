# Architektura MVP

## Docelowe adresy

- `panel.twojadomena.pl` — panel Next.js na Vercel,
- `api.twojadomena.pl` — centralne API i zadania asynchroniczne,
- `wp-stage.twojadomena.pl` — testowa instalacja WordPress/WooCommerce,
- `*.demo.twojadomena.pl` — demonstracyjne witryny klientów.

Panel na Vercel nie powinien łączyć się bezpośrednio z bazą WordPress. Korzysta z uwierzytelnionego Webly Bridge. Sekrety są przechowywane jako zmienne środowiskowe, nigdy w przeglądarce.

## Granice systemu

Next.js odpowiada za klientów, pakiety, abonamenty, tworzenie witryn i wspólny interfejs. WordPress odpowiada za treści, a WooCommerce za produkty, zamówienia, kupony i magazyn.

## Izolacja

W wersji lokalnej jeden sklep służy do budowy integracji. W produkcji sklepy powinny być izolowane przynajmniej osobną bazą i zestawem danych. Proste strony mogą później działać w kontrolowanym Multisite.

