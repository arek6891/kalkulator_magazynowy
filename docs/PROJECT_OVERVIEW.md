# Kalkulator Magazynowy - Dokumentacja Projektu

## 📌 O Projekcie
Kalkulator Magazynowy to aplikacja webowa typu PWA (Progressive Web App) wspomagająca planowanie zasobów ludzkich (FTE) w logistyce. Pozwala kierownikom magazynów szybko oszacować zapotrzebowanie na pracowników w oparciu o wolumeny wejściowe (dostawy/zamówienia) i wskaźniki wydajności (KPI).

Wersja online: [https://arek6891.github.io/kalkulator_magazynowy/](https://arek6891.github.io/kalkulator_magazynowy/)

## 🚀 Główne Funkcje
1.  **Kalkulator FTE**: Obliczanie potrzebnej liczby pracowników dla procesów: Przyjęcia, Kompletacji i Pakowania.
2.  **Analiza AI (Gemini 1.5 Flash)**: Generowanie taktycznych porad i analizy "wąskich gardeł" na podstawie wyników obliczeń. Import danych z "brudnego" tekstu (np. e-maila).
3.  **Historia i Chmura**:
    *   Zapis wyników lokalnie (LocalStorage).
    *   Synchronizacja z chmurą (Supabase) – opcjonalnie.
    *   Tryb Offline (PWA) – aplikacja działa bez internetu (poza funkcjami AI/Cloud).
4.  **Raporty PDF**: Eksport wyników do profesjonalnego pliku PDF.

## 🛠️ Stack Technologiczny
*   **Frontend**: React 19, TypeScript, Vite.
*   **UI/Styling**: Tailwind CSS, Lucide React (ikony).
*   **AI**: Google Generative AI SDK (`@google/genai`).
*   **Backend/Baza**: Supabase (Database & Realtime).
*   **Hosting**: GitHub Pages (Build & Deploy via `npm run deploy`).
*   **PWA**: Vite PWA Plugin, Service Workers.

## 🏗️ Struktura Projektu
*   `/src` - Kod źródłowy aplikacji.
    *   `/components` - Komponenty React (UI).
    *   `/services` - Logika biznesowa (AI, Supabase, PDF).
    *   `/hooks` - Custom hooks (np. `useHistory` do synchronizacji).
*   `/docs` - Dokumentacja projektowa.
*   `/dist` - Zbudowana wersja produkcyjna (generowana automatycznie).
