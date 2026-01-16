# kalkulator_magazynowy

Aplikacja webowa typu SPA (Single Page Application) służąca do planowania zasobów ludzkich w logistyce. Pozwala na precyzyjne obliczenie zapotrzebowania na pracowników (FTE) w oparciu o wolumeny operacyjne.

---

## ☁️ Synchronizacja Danych (Shared History)

Aplikacja obsługuje **wspólną historię** dla wszystkich użytkowników (laptop, telefon, tablet) przy użyciu bazy danych **Supabase**.

### Jak włączyć synchronizację?

1. Załóż darmowe konto na [Supabase.com](https://supabase.com).
2. Stwórz nowy projekt.
3. Wejdź w **SQL Editor** w panelu Supabase i wklej poniższy kod, aby utworzyć tabelę:

```sql
create table history (
  id uuid primary key,
  timestamp bigint,
  data jsonb,
  result jsonb,
  ai_analysis text,
  created_at timestamptz default now()
);

-- Opcjonalnie: Zezwól wszystkim na odczyt/zapis (dla małych zespołów)
alter table history enable row level security;
create policy "Enable all access for all users" on history for all using (true) with check (true);
```

4. Wejdź w **Project Settings -> API** i skopiuj:
   * **Project URL**
   * **anon public key**

5. Dodaj te klucze do Vercel (Environment Variables) lub lokalnie do pliku `.env`:
   ```
   VITE_SUPABASE_URL=twoj_url_projektu
   VITE_SUPABASE_ANON_KEY=twoj_klucz_anon
   ```

Po ponownym uruchomieniu aplikacji ikonka w nagłówku zmieni się na **"Online"** (zielona chmurka).

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
   * `API_KEY`: (Twój klucz z Google AI Studio)
   * `VITE_SUPABASE_URL`: (Opcjonalnie: URL bazy danych)
   * `VITE_SUPABASE_ANON_KEY`: (Opcjonalnie: Klucz bazy danych)
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
*   Supabase (Baza Danych)
