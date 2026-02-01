import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Ładuje zmienne środowiskowe z plików .env (dla lokalnego developmentu)
  const env = loadEnv(mode, '.', '');
  
  return {
    plugins: [react()],
    base: '/kalkulator_magazynowy/',
    server: {
      host: true, // Pozwala na dostęp z zewnątrz kontenera (StackBlitz)
      port: 5173,
      strictPort: true, // Wymusza ten sam port, żeby link się nie zmieniał
    },
    preview: {
      host: true, // To samo dla trybu podglądu produkcji
      port: 5173,
      strictPort: true,
    },
    define: {
      // Priorytet: 1. Zmienna systemowa (Vercel) 2. Zmienna z pliku .env (Lokalnie)
      'process.env.API_KEY': JSON.stringify(process.env.API_KEY || env.API_KEY),
      'process.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL || env.VITE_SUPABASE_URL),
      'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY)
    }
  }
})