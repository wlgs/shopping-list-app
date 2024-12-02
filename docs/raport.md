# Dokumentacja testów

## 0. Środowisko testowe

Środowisko testowe to lokalny komputer (testy wykonywały się lokalnie).

Wersje znaczących bibliotek:

- Jest `version: 29.5.13`
- Playwright `version: 1.49.0`
- NextJS `specifier: 14.2.14`

Wszystko na Node `version 20.12.1`

Przykładowe pliki:

- [test e2e](/e2e/list/list.spec.ts)
- [test pojedynczego komponentu](/app/(login)/login/page.test.tsx)
- [test api](/app/api/logout/route.test.ts)
- [test server action](/app/list/actions/editTask.test.ts)

## 1. Testy jednostkowe

### Testy działań serwerowych (Server Actions)

- **addList.test.ts**: Testy dodawania nowej listy zakupów
  - Weryfikacja autoryzacji użytkownika
  - Poprawne dodawanie nowej listy
  - Obsługa błędów bazy danych

- **addTask.test.ts**: Testy dodawania nowego zadania
  - Weryfikacja autoryzacji użytkownika
  - Poprawne dodawanie nowego zadania
  - Obsługa błędów bazy danych

- **deleteList.test.ts**: Testy usuwania listy
  - Weryfikacja autoryzacji użytkownika
  - Blokada usuwania domyślnej listy
  - Blokada usuwania listy z zadaniami
  - Obsługa błędów bazy danych

- **deleteTask.test.ts**: Testy usuwania zadania
  - Weryfikacja autoryzacji użytkownika
  - Poprawne usuwanie zadania
  - Obsługa błędów bazy danych

- **editTask.test.ts**: Testy edycji zadania
  - Weryfikacja autoryzacji użytkownika
  - Edycja zadania
  - Oznaczanie zadania jako wykonane/niewykonane
  - Obsługa błędów bazy danych

- **getTasks.test.ts**: Testy pobierania zadań
  - Obsługa niezalogowanego użytkownika
  - Grupowanie zadań według list
  - Sortowanie zadań według daty utworzenia
  - Obsługa błędów bazy danych

### Testy autentykacji

- **logout-action.test.ts**: Testy wylogowania
  - Usuwanie ciasteczka sesji

- **signin-action.test.ts**: Testy logowania
  - Walidacja danych logowania
  - Obsługa niepoprawnych danych
  - Utworzenie sesji dla poprawnych danych

- **signup-action.test.ts**: Testy rejestracji
  - Walidacja danych rejestracji
  - Obsługa istniejących użytkowników
  - Poprawne utworzenie konta

### Testy komponentów

- **logout-button.test.tsx**: Testy przycisku wylogowania
  - Renderowanie przycisku
  - Obsługa kliknięcia

## 2. Testy integracyjne

### Testy stron

- **login/page.test.tsx**: Testy strony logowania
  - Renderowanie formularza
  - Obsługa przesyłania formularza
  - Przekierowania dla zalogowanych użytkowników

- **sign-up/page.test.tsx**: Testy strony logowania
  - Renderowanie formularza
  - Obsługa przesyłania formularza
  - Przekierowania dla zalogowanych użytkowników

## 3. Testy E2E (systemowe)

### Testy funkcjonalności

- **home.spec.ts**: Testy strony głównej
  - Testy nawigacji dla niezalogowanych użytkowników
  - Testy nawigacji dla zalogowanych użytkowników
  - Test wylogowania

- **list.spec.ts**: Testy zarządzania listami i zadaniami
  - Dodawanie list
  - Usuwanie list
  - Dodawanie zadań do list
  - Usuwanei zadań z list
  - Edycja zadań
  - Oznaczanie zadań jako wykonane/niewykonane
  - Walidacja usuwania list z zadaniami

- **sign-in.spec.ts**: Testy procesu logowania
  - Poprawne logowanie
  - Obsługa błędnych danych
  - Walidacja formularza

- **signup.spec.ts**: Testy procesu rejestracji
  - Poprawna rejestracja
  - Obsługa istniejących użytkowników
  - Przekierowania po rejestracji

## 4. Testy wydajnościowe

Prosty test wydajnościowy aplikacji został przeprowadzony przy uzyciu narzędzia `wrk`

```bash
> wrk -t12 -c1000 -d30s http://localhost:3000/login
Running 30s test @ http://localhost:3000/login
  12 threads and 1000 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   269.60ms   73.01ms   1.99s    88.99%
    Req/Sec    68.96     40.34   202.00     74.53%
  24656 requests in 30.10s, 334.75MB read
  Socket errors: connect 757, read 460, write 0, timeout 122
Requests/sec:    819.08
Transfer/sec:     11.12MB
```

## 5. Testy bezpieczeństwa

### Skanowanie bibliotek projektu `pnpm audit`

```
> pnpm audit
┌─────────────────────┬────────────────────────────────────────────────────────┐
│ high                │ Regular Expression Denial of Service (ReDoS) in        │
│                     │ cross-spawn                                            │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Package             │ cross-spawn                                            │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Vulnerable versions │ >=7.0.0 <7.0.5                                         │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Patched versions    │ >=7.0.5                                                │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ Paths               │ . > tailwindcss-animate@1.0.7 > tailwindcss@3.4.13 >   │
│                     │ sucrase@3.35.0 > glob@10.4.5 > foreground-child@3.3.0  │
│                     │ > cross-spawn@7.0.3                                    │
│                     │                                                        │
│                     │ . > eslint@8.57.1 > cross-spawn@7.0.3                  │
│                     │                                                        │
│                     │ . > eslint-config-next@14.2.14 >                       │
│                     │ @next/eslint-plugin-next@14.2.14 > glob@10.3.10 >      │
│                     │ foreground-child@3.3.0 > cross-spawn@7.0.3             │
│                     │                                                        │
│                     │ ... Found 27 paths, run `pnpm why cross-spawn` for     │
│                     │ more information                                       │
├─────────────────────┼────────────────────────────────────────────────────────┤
│ More info           │ https://github.com/advisories/GHSA-3xgq-45jj-v275      │
└─────────────────────┴────────────────────────────────────────────────────────┘
1 vulnerabilities found
Severity: 1 high
```
