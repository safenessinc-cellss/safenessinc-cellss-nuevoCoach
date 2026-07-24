import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  
  return {
    plugins: [react(), tailwindcss()],
    
    base: './',
    
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
    },
    
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    
    build: {
      outDir: 'dist',
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            // ✅ Solo incluye lo que realmente usas
            vendor: ['react', 'react-dom'],
            i18n: ['i18next', 'react-i18next'], // ← ELIMINADO i18next-browser-languagedetector
          },
        },
      },
      assetsDir: 'assets',
      copyPublicDir: true,
    },
    
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'i18next',
        'react-i18next',
        // ← ELIMINADO i18next-browser-languagedetector de aquí también
      ],
    },
  };
});
