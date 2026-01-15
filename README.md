# kalkulator_magazynowy

Aplikacja webowa typu SPA (Single Page Application) służąca do planowania zasobów ludzkich w logistyce. Pozwala na precyzyjne obliczenie zapotrzebowania na pracowników (FTE - Full Time Equivalent) w oparciu o wolumeny operacyjne oraz realne parametry wydajnościowe.

## 🚀 Główne Funkcjonalności

### 1. Zaawansowany Algorytm Obliczeniowy (Logistyka)
Aplikacja nie opiera się na prostym dzieleniu wolumenu przez godziny. Zastosowano standardy inżynierii procesowej:
*   **Efektywny Czas Pracy (Net Available Time):** Automatyczne odejmowanie czasu przerw od czasu zmiany.
*   **Wskaźnik Wydajności (OEE/Performance):** Możliwość zdefiniowania % wydajności procesu (np. 85%), uwzględniającego zmęczenie pracowników i mikropastoje.
*   **Zaokrąglanie:** Wyniki są zaokrąglane w górę (sufit) dla zapewnienia pełnego pokrycia operacyjnego.

### 2. Obsługa Kluczowych Procesów Magazynowych
Kalkulator uwzględnia trzy główne obszary operacyjne:
*   **Przyjęcie (Receiving):** Na podstawie liczby dostaw i normy rozładunku.
*   **Kompletacja (Picking):** Na podstawie linii zlecenia/sztuk i normy zbierania.
*   **Pakowanie (Packing):** Na podstawie ilości paczek/zamówień i normy pakowania.

### 3. Interaktywny Dashboard
*   **Wizualizacja FTE:** Wykres kołowy pokazujący podział etatu na działy.
*   **Wizualizacja Wolumenu:** Wykres słupkowy obciążenia pracą.
*   **Wskaźniki KPI:** Wyświetlanie efektywnego czasu pracy na osobę oraz "bufora" (narzutu wynikającego ze strat wydajności).

### 4. UX / UI
*   **Tryb Ciemny (Dark Mode):** Pełna obsługa motywu jasnego i ciemnego.
*   **Moduł Edukacyjny:** Wbudowane okno modalne "Jak to działa?", wyjaśniające matematykę stojącą za wynikami.
*   **Import Danych:** Możliwość załadowania przykładowego zestawu danych jednym kliknięciem.

---

## ⚙️ Technologia

*   **Framework:** React 19
*   **Style:** Tailwind CSS
*   **Wykresy:** Recharts
*   **Ikony:** Lucide React

---

## 📝 Metodologia Obliczeń

Wzór na zapotrzebowanie (FTE):

```
FTE = Pracochłonność (h) / Efektywny Czas Pracy (h)
```

Gdzie:
1.  **Pracochłonność** = Wolumen / Norma na godzinę
2.  **Efektywny Czas Pracy** = (Czas Zmiany - Czas Przerw) * (Wydajność %)

---

## 📅 Dziennik Zmian (Changelog)

### [2.0.7] - Zmiana nazwy i poprawki
*   Zmiana nazwy aplikacji na "kalkulator_magazynowy" dla zgodności z Vercel/GitHub.
*   Naprawa zależności i aktualizacja wersji.

### [1.1.0] - Aktualizacja Standardów Logistycznych
**Dodano:**
*   Nowe pola w formularzu: "Czas przerw (min)" oraz "Wydajność procesu (%)".
*   Ikony sekcji w formularzu (Dostawy, Zlecenia, Parametry) dla lepszej czytelności.
*   Komponent `CalculationInfoModal` wyjaśniający metodologię obliczeń.
*   Przycisk "Jak to działa?" w nagłówku aplikacji.
*   Wyświetlanie "Efektywnego czasu pracy" na Dashboardzie.

**Zmieniono:**
*   Silnik obliczeniowy (`calculationService.ts`) uwzględnia teraz czas netto i współczynnik OEE zamiast prostego czasu brutto.
*   Definicja "Bufora" na dashboardzie teraz reprezentuje narzut wynikający z przerw i strat wydajności.
*   Zaktualizowano przykładowe dane (`mockData`) o parametry logistyczne (30 min przerwy, 85% wydajności).

### [1.0.0] - Inicjalna Wersja
*   Podstawowy kalkulator oparty na godzinach brutto.
*   Wykresy kołowe i słupkowe.
*   Obsługa trybu ciemnego.
*   Podstawowa walidacja danych.