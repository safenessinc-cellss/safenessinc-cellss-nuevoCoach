import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  
  return {
    plugins: [react(), tailwindcss()],
    
    // ⭐ 1. BASE CORRECTA para Vercel
    base: './',
    
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
      // ⭐ 2. Variables de entorno para Vercel
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
    },
    
    resolve: {
      alias: {
        // ⭐ 3. ALIAS CORRECTO (apunta a src/)
        '@': path.resolve(__dirname, './src'),
        // Si usas otros alias, añádelos aquí
      },
    },
    
    // ⭐ 4. CONFIGURACIÓN DE BUILD para Vercel
    build: {
      outDir: 'dist',
      sourcemap: true, // Para debugging en producción
      rollupOptions: {
        output: {
          manualChunks: {
            // Separa librerías grandes para mejor caché
            vendor: ['react', 'react-dom'],
            i18n: ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
          },
        },
      },
      // ⭐ 5. Asegura que los assets se copien correctamente
      assetsDir: 'assets',
      copyPublicDir: true,
    },
    
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    
    // ⭐ 6. Optimiza dependencias para Vercel
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'i18next',
        'react-i18next',
        'i18next-browser-languagedetector',
      ],
    },
  };
});
