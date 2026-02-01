# Kontekst Deweloperski i Wskazówki dla AI

Ten plik zawiera kluczowe informacje techniczne, decyzje architektoniczne i "pułapki", o których należy pamiętać przy dalszym rozwoju projektu.

## ⚠️ Najważniejsze (Critical)
1.  **Hosting (GitHub Pages)**:
    *   Projekt jest hostowany na GitHub Pages, ale **nie używa** automatycznego builda GitHuba (Jekyll/Actions).
    *   **Deploy**: Ręczny skrypt `npm run deploy`. Buduje folder `dist` i wypycha go na gałąź `gh-pages`.
    *   **Źródło**: Kod źródłowy jest na `main`. Gotowa strona na `gh-pages`.
    *   **Router**: `vite.config.ts` ma ustawiony `base: '/kalkulator_magazynowy/'`. Wszystkie ścieżki (ikonki, manifest) muszą być relatywne lub uwzględniać ten base.

2.  **Zmienne Środowiskowe (Secrets)**:
    *   Aplikacja jest typu client-side (SPA). **Klucze API (Supabase, Google AI) są publiczne w zbudowanym kodzie**.
    *   **Lokalnie**: Używamy `.env` (zignorowany w `.gitignore`).
    *   **Produkcja**: Ponieważ GitHub Pages nie ma "zmiennych środowiskowych" w runtime, klucze są "pieczone" (baked-in) w kodzie podczas `npm run build` na maszynie dewelopera.
    *   **Supabase**: Używamy klucza `ANON`. Bezpieczeństwo opiera się na RLS (Row Level Security) po stronie bazy, nie na ukrywaniu klucza.

3.  **AI (Gemini)**:
    *   Model: `gemini-1.5-flash` (wersje `preview` lub `gemini-pro` mogą rzucać błędy 404/400).
    *   Error Handling: Wdrożono specjalny mechanizm wyświetlania surowych błędów AI użytkownikowi (np. `API_KEY_HTTP_REFERRER_BLOCKED`), aby łatwiej debugować problemy z domeną.

4.  **Service Worker (PWA)**:
    *   Wersja `v10-disabled`: Obecnie **wyłączyliśmy caching** (`ASSETS = []`), ponieważ agresywne cache'owanie powodowało problemy z aktualizacją strony po deployu (błędy 404 dla starych plików).
    *   Przy włączaniu PWA w przyszłości: Pamiętać o zmianie `CACHE_NAME` przy każdym deployu.

## 💡 Tipy dla AI (Jak pracować z tym kodem)
*   **Edycja UI**: Używamy Tailwind CSS. Nie twórz nowych plików `.css`, edytuj klasy w komponentach.
*   **Ikony**: Biblioteka `lucide-react`.
*   **Baza Danych**: Jeśli dodajesz nową tabelę w Supabase, upewnij się, że zaktualizowałeś plik `types.ts` i `useHistory.ts`.
*   **Debugowanie**: W `index.html` jest zaszyty "Global Error Handler", który wyłapuje błędy zanim React wstanie (pomocne przy "białym ekranie").

## 🔄 Workflow Pracy
1.  Wprowadź zmiany w kodzie (`src/`).
2.  Przetestuj lokalnie: `npm run dev`.
3.  Zbuduj i wyślij: `npm run deploy` (to automatycznie robi build + push na gh-pages).
4.  Commit kodu źródłowego: `git add .`, `git commit`, `git push origin main`.
