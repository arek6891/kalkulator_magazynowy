# ☁️ Instrukcja Integracji: Baza Danych (Supabase) + Vercel

Ten dokument opisuje krok po kroku, jak połączyć aplikację z darmową bazą danych w chmurze, aby historia obliczeń była dostępna na wszystkich urządzeniach (telefon, komputer).

---

## CZĘŚĆ 1: Konfiguracja Bazy Danych (Supabase)

### 1. Założenie projektu
1. Wejdź na stronę [Supabase.com](https://supabase.com) i kliknij **"Start your project"**.
2. Zaloguj się (najlepiej przez GitHub).
3. Kliknij **"New Project"**.
4. Wypełnij formularz:
   * **Name:** np. `magazyn-baza`
   * **Database Password:** Wymyśl hasło (zapisz je w menedżerze haseł, choć w aplikacji go nie użyjemy bezpośrednio).
   * **Region:** Wybierz `Central Europe (Frankfurt)` lub `Warsaw` (dla szybkości).
5. Kliknij **"Create new project"** i poczekaj około 1-2 minut na utworzenie bazy.

### 2. Utworzenie tabeli na dane
Aby aplikacja miała gdzie zapisywać wyniki, musimy stworzyć tabelę `history`.

1. W panelu Supabase po lewej stronie kliknij ikonę **SQL Editor** (wygląda jak terminal `>_`).
2. Kliknij **"New query"** (pusta strona).
3. Wklej poniższy kod SQL:

```sql
-- Tworzenie tabeli historii
create table history (
  id uuid primary key,
  timestamp bigint,
  data jsonb,
  result jsonb,
  ai_analysis text,
  created_at timestamptz default now()
);

-- Włączenie zabezpieczeń (Row Level Security)
alter table history enable row level security;

-- Utworzenie polityki "Otwartej", aby każdy użytkownik aplikacji mógł zapisać i odczytać dane
-- (Wersja uproszczona dla małych zespołów bez logowania)
create policy "Enable all access for all users" 
on history for all 
using (true) 
with check (true);
```

4. Kliknij zielony przycisk **RUN** (prawy dolny róg). Powinien pojawić się komunikat "Success".

### 3. Pobranie kluczy (Credentials)
Teraz musimy wziąć "adres" i "klucz" do Twojej nowej bazy.

1. W menu po lewej kliknij ikonę zębatki **Project Settings**.
2. Wybierz zakładkę **API**.
3. Znajdź sekcję **Project URL** i **Project API keys**. Będziesz potrzebować:
   * **URL:** (np. `https://xyzxyz.supabase.co`)
   * **anon public:** (długi ciąg znaków)

---

## CZĘŚĆ 2: Podłączenie do Vercel (Aby działało na telefonie)

Aby strona internetowa widziała bazę danych, musimy podać jej te klucze jako zmienne środowiskowe.

1. Zaloguj się na [Vercel.com](https://vercel.com) i wejdź w swój projekt (`kalkulator_magazynowy`).
2. Kliknij zakładkę **Settings** (u góry).
3. Kliknij **Environment Variables** (w menu po lewej).
4. Dodaj dwie nowe zmienne (kopiując dane z Supabase):

| Key (Nazwa) | Value (Wartość) |
| :--- | :--- |
| `VITE_SUPABASE_URL` | Tu wklej Project URL |
| `VITE_SUPABASE_ANON_KEY` | Tu wklej klucz `anon public` |

5. Kliknij **Save**.

### ⚠️ WAŻNE: Restart Serwera (Redeploy)
Samo dodanie kluczy nie wystarczy. Musisz przebudować stronę, aby "zassała" nowe ustawienia.

1. W Vercel wejdź w zakładkę **Deployments**.
2. Znajdź najwyższą (najnowszą) pozycję na liście.
3. Kliknij **trzy kropki** (...) po prawej stronie tego wiersza.
4. Wybierz **Redeploy**.
5. Poczekaj, aż kółko zmieni się na zielone "Ready".

Teraz otwórz aplikację na telefonie. W nagłówku powinieneś widzieć ikonę **Zielonej Chmurki (Online)**.

---

## CZĘŚĆ 3: Konfiguracja Lokalna (Dla programisty)

Jeśli chcesz rozwijać aplikację na swoim komputerze, musisz dodać te same klucze do pliku `.env`.

1. Otwórz plik `.env` w głównym folderze projektu (jeśli go nie ma, utwórz go).
2. Wpisz:

```env
API_KEY=twoj_klucz_google_gemini
VITE_SUPABASE_URL=tu_wklej_url_z_supabase
VITE_SUPABASE_ANON_KEY=tu_wklej_klucz_anon_z_supabase
```

3. Zrestartuj terminal (`Ctrl+C`, potem `npm run dev`).

---

## ❓ Rozwiązywanie problemów

**Ikona chmurki jest szara (Lokalnie):**
* Sprawdź, czy zrobiłeś Redeploy na Vercel.
* Sprawdź, czy nazwy zmiennych (`VITE_...`) nie mają literówek.

**Błąd przy zapisie (czerwony komunikat w konsoli):**
* Sprawdź w Supabase w zakładce **Table Editor**, czy tabela `history` na pewno powstała.
* Upewnij się, że wykonałeś komendę SQL tworzącą "policy" (politykę dostępu). Bez tego baza domyślnie blokuje zapis.
