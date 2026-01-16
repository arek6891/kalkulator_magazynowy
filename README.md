# kalkulator_magazynowy

Aplikacja webowa typu SPA (Single Page Application) służąca do planowania zasobów ludzkich w logistyce. Pozwala na precyzyjne obliczenie zapotrzebowania na pracowników (FTE) w oparciu o wolumeny operacyjne.

---

## 🛠️ Środowisko Deweloperskie: Google AI Studio

**Ten projekt jest rozwijany przy wsparciu Google AI Studio.**

### ⚠️ Złota zasada bezpieczeństwa dla tego projektu:
1.  **NIGDY** nie wklejaj klucza API bezpośrednio do kodu (pliki `.tsx`, `.ts`, `.js`, `.html`).
2.  Klucz API przechowujemy **TYLKO**:
    *   Lokalnie: w pliku `.env` (który jest ignorowany przez Gita).
    *   W chmurze (Vercel): w sekcji **Environment Variables**.
3.  Jeśli AI poprosi o klucz lub wygeneruje kod z miejscem na klucz, upewnij się, że używa `process.env.API_KEY`.

---

## 🔒 Bezpieczeństwo Klucza API (Google Cloud)

Ponieważ aplikacja działa w przeglądarce (Client-Side), sam klucz będzie widoczny w ruchu sieciowym. Aby nikt nie ukradł Twojego limitu zapytań, **musisz** nałożyć blokadę w panelu Google:

1. Wejdź na **Google AI Studio / Cloud Console** -> sekcja **API Keys**.
2. Kliknij swój klucz.
3. W sekcji **"API restrictions"** lub **"Website restrictions"**:
   * Zaznacz **Websites**.
   * Dodaj domenę produkcyjną: `https://kalkulator-magazynowy.vercel.app/*`
   * Dodaj domenę lokalną (do testów): `http://localhost:5173/*`
4. Zapisz zmiany. Teraz klucz zadziała tylko na Twoich stronach.

---

## 🌍 Jak wdrożyć/zaktualizować aplikację? (Vercel)

### Krok 1: Wysłanie kodu
1. W AI Studio / StackBlitz upewnij się, że plik `.env` **nie jest** wysyłany do GitHuba (dba o to plik `.gitignore`).
2. Wyślij zmiany (Commit & Push).

### Krok 2: Konfiguracja Vercel
1. Jeśli to pierwsze uruchomienie, zaimportuj projekt na [vercel.com](https://vercel.com).
2. W sekcji **Environment Variables** dodaj:
   * Name: `API_KEY`
   * Value: (Twój klucz z Google AI Studio zaczynający się od `AIza...`)
3. Jeśli aktualizujesz aplikację, Vercel sam wykryje zmiany na GitHubie i przebuduje stronę w ciągu minuty.

### Krok 3: Link dla użytkowników
Używaj linku publicznego: `https://kalkulator-magazynowy.vercel.app`.
(Nie mylić z linkiem do panelu administracyjnego Vercel).

---

## 🚀 Uruchomienie lokalne (Testy)
1. Pobierz kod / otwórz terminal.
2. `npm install`
3. Stwórz plik `.env` w głównym folderze:
   ```
   API_KEY=twoj_klucz_api_tutaj
   ```
4. `npm run dev`

## ⚙️ Technologia
*   React 19 + TypeScript
*   Vite + Tailwind CSS
*   Google Gemini API
