# Webly Platform — MVP

Pierwszy fundament platformy do sprzedaży gotowych stron, landing pages i sklepów w abonamencie.

## Elementy

- panel administracyjny i kliencki: Next.js,
- centralne dane klientów i abonamentów: PostgreSQL + Prisma,
- strony i sklepy: WordPress/WooCommerce,
- komunikacja z witrynami: własna wtyczka `Webly Bridge`,
- lokalna infrastruktura: odizolowany projekt Docker Compose `webly_mvp`.

## Bezpieczne uruchomienie lokalne

1. Skopiuj `infra/.env.example` jako `infra/.env` i ustaw losowe hasła.
2. Przed uruchomieniem sprawdź, czy porty 5447 i 8097 są wolne. Jeśli nie, zmień je w `infra/.env`.
3. Z katalogu `infra` uruchom `docker compose config`, aby zweryfikować konfigurację.
4. Dopiero potem uruchom `docker compose up -d`.
5. Panel uruchamia się poleceniem `npm run dev` z katalogu głównego.

Projekt używa wyłącznie nazw zaczynających się od `webly_mvp_`, więc nie korzysta z istniejących woluminów, sieci ani kontenerów innych projektów.

