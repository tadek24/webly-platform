# Wdrożenie: Vercel + własny serwer

## Zalecany podział

| Adres | Miejsce | Rola |
|---|---|---|
| `panel.twojadomena.pl` | Vercel | panel Next.js |
| `wp-stage.twojadomena.pl` | VPS | WordPress/WooCommerce do testów |
| `*.demo.twojadomena.pl` | VPS | demonstracyjne witryny |
| baza PostgreSQL | zarządzana usługa lub VPS | klienci, pakiety i subskrypcje |

Nie należy umieszczać WordPressa na Vercel. Vercel uruchamia panel Next.js, natomiast WordPress, MariaDB, zadania cykliczne i pliki klientów działają na serwerze z trwałym dyskiem.

## Minimalny serwer testowy

- Ubuntu LTS,
- 2 vCPU, 4 GB RAM i około 60 GB SSD,
- publiczny adres IPv4,
- Docker Engine z Compose,
- otwarte porty 80 i 443,
- codzienna kopia danych poza tym samym serwerem.

Do produkcji z płacącymi klientami zalecane jest minimum 4 vCPU i 8 GB RAM oraz osobny, monitorowany system kopii. Wielkość trzeba później dopasować do liczby sklepów i ruchu.

## DNS

1. W Vercel dodaj `panel.twojadomena.pl` w ustawieniach projektu.
2. U operatora domeny ustaw rekord CNAME dokładnie na wartość pokazaną przez Vercel.
3. Dla `wp-stage.twojadomena.pl` ustaw rekord A na adres IPv4 serwera.
4. Dla `*.demo.twojadomena.pl` ustaw rekord A na ten sam adres serwera.
5. Nie zmieniaj serwerów nazw całej domeny, jeżeli działa na niej poczta lub inne usługi, dopóki wszystkie rekordy nie zostaną zinwentaryzowane.

## Vercel

1. Umieść kod w prywatnym repozytorium Git.
2. Zaimportuj repozytorium w Vercel jako nowy projekt.
3. Ustaw wersję Node.js zgodną z projektem.
4. Dodaj sekrety w `Settings → Environment Variables`:
   - `DATABASE_URL`,
   - `APP_URL=https://panel.twojadomena.pl`,
   - `WP_BASE_URL=https://wp-stage.twojadomena.pl`,
   - `WP_API_TOKEN`.
5. Najpierw wykonaj Preview Deployment, a po testach Production Deployment.
6. Dodaj subdomenę panelu i poczekaj na automatyczny certyfikat SSL.

Nie zapisuj sekretów w zmiennych zaczynających się od `NEXT_PUBLIC_`, ponieważ takie wartości trafiają do przeglądarki.

## Serwer WordPress

1. Utwórz osobnego użytkownika systemowego do wdrożenia; nie uruchamiaj aplikacji jako root podczas zwykłej pracy.
2. Sklonuj repozytorium do katalogu przeznaczonego wyłącznie dla Webly.
3. Utwórz `infra/.env` na podstawie `infra/.env.example` i wygeneruj trzy różne, długie hasła.
4. Usuń publikowanie portów baz danych na zewnątrz. Bazy mają być osiągalne wyłącznie wewnątrz sieci Docker.
5. Postaw przed WordPressem reverse proxy (Caddy, Traefik albo Nginx) z automatycznym TLS.
6. Przekazuj nagłówki `Host`, `X-Forwarded-For` oraz `X-Forwarded-Proto`.
7. W produkcyjnym `wp-config.php` ustaw `FORCE_SSL_ADMIN`, wyłącz edycję plików i skonfiguruj poprawne rozpoznawanie HTTPS za proxy.
8. Zainstaluj WooCommerce i aktywuj `Webly Bridge`.
9. Ogranicz endpoint mostu przez podpisane żądania i rotowalny sekret przed podłączeniem prawdziwych danych.
10. Skonfiguruj zewnętrzny cron, monitoring dostępności oraz alerty wykorzystania dysku.

## Kopie i odtwarzanie

- codziennie: bazy PostgreSQL i MariaDB,
- codziennie: `wp-content/uploads`,
- przed każdą aktualizacją: migawka,
- jedna kopia poza serwerem,
- regularny test odtworzenia, nie tylko sprawdzanie, czy plik kopii istnieje.

## Dane potrzebne do właściwego wdrożenia

- nazwa domeny i subdomena panelu,
- dostęp do DNS albo możliwość samodzielnego dodania wskazanych rekordów,
- konto Vercel lub zaproszenie do projektu,
- adres serwera, użytkownik SSH i informacja o systemie,
- decyzja, gdzie będzie centralny PostgreSQL,
- później dane operatora płatności cyklicznych.

