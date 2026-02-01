# 🔐 Instrukcja Bezpieczeństwa: Klucz API Google (Gemini)

Ta instrukcja opisuje krok po kroku, jak bezpiecznie używać klucza API w aplikacji, która jest publicznie dostępna w internecie (np. na Vercel).

---

## 🚨 Sytuacja Awaryjna: Klucz wyciekł?
Jeśli dostałeś maila od Google, że Twój klucz znalazł się w publicznym repozytorium:
1. Natychmiast wejdź na **Google AI Studio** lub **Google Cloud Console**.
2. **Usuń stary klucz** (przycisk Delete/Trash). Ten klucz jest "spalony" i nie wolno go używać.
3. Wygeneruj **nowy klucz** i postępuj zgodnie z poniższymi krokami.

---

## KROK 1: Zabezpieczenie Klucza (Wymagane!)
Ponieważ Twoja aplikacja działa w przeglądarce użytkownika, klucz technicznie "lata" w sieci. Aby nikt go nie ukradł i nie użył do własnych celów, musisz nałożyć na niego "kaganiec" (restrykcje domenowe).

1. Wejdź na stronę [Google AI Studio - API Keys](https://aistudio.google.com/app/apikey).
2. Kliknij swój klucz (lub stwórz nowy).
3. Kliknij **"Edit API key in Google Cloud Console"** (lub poszukaj opcji edycji).
4. W sekcji **"Application restrictions"** (Restrykcje aplikacji):
   * Zaznacz opcję: **Websites** (Strony internetowe).
5. W sekcji **"Website restrictions"** kliknij **Add**:
   * Dodaj adres produkcyjny (z gwiazdką na końcu):  
     `https://kalkulator-magazynowy.vercel.app/*`
   * Dodaj adres lokalny (do testów u Ciebie):  
     `http://localhost:5173/*`
6. Kliknij **Save**.

**Efekt:** Teraz Twój klucz zadziała TYLKO wtedy, gdy zapytanie przyjdzie z Twojej strony. Jeśli ktoś ukradnie klucz i spróbuje go użyć u siebie – dostanie błąd.

---

## KROK 2: Dodanie Klucza do Vercel (Produkcja)
Vercel musi znać Twój klucz, aby "wstrzyknąć" go do aplikacji podczas budowania.

1. Zaloguj się na [vercel.com](https://vercel.com) i wejdź w swój projekt.
2. Wejdź w zakładkę **Settings** -> **Environment Variables**.
3. Dodaj nową zmienną:
   * **Key:** `API_KEY`
   * **Value:** (Twój klucz zaczynający się od `AIza...`)
4. Kliknij **Save**.
5. **WAŻNE:** Aby zmiana zadziałała, musisz przebudować aplikację. Wejdź w zakładkę **Deployments**, kliknij trzy kropki przy ostatnim wdrożeniu i wybierz **Redeploy**.

---

## KROK 3: Praca Lokalna (Twój komputer/StackBlitz)
Nigdy nie wpisuj klucza w kodzie (pliki `.tsx`, `.ts`).

1. Stwórz w głównym folderze plik o nazwie `.env`.
2. Wpisz w nim:
   ```
   API_KEY=twoj_klucz_tutaj
   ```
3. Upewnij się, że plik `.gitignore` zawiera linię `.env`. Dzięki temu Git nie wyśle tego pliku do internetu.

---

## KROK 4: Czyszczenie GitHuba (Jeśli plik .env tam trafił)
Jeśli przez przypadek wysłałeś plik `.env` do repozytorium, samo usunięcie go w edytorze nie wystarczy (zostanie w historii). Wykonaj te komendy w terminalu:

```bash
# 1. Usuń plik .env z indeksu Gita (ale zostaw go na dysku)
git rm --cached .env

# 2. Zatwierdź zmianę
git commit -m "Usunięcie pliku .env z repozytorium dla bezpieczeństwa"

# 3. Wyślij zmianę na serwer
git push
```
