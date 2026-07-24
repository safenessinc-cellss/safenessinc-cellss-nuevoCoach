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
      chunkSizeWarningLimit: 1000,
      
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // ⭐ SIMPLIFICADO: Sin chunks complejos para evitar errores
            if (id.includes('node_modules/')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'vendor-react';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons'; // ← SEPARADO para evitar conflictos
              }
              if (id.includes('i18next') || id.includes('react-i18next')) {
                return 'vendor-i18n';
              }
              return 'vendor-other';
            }
            return null;
          },
        },
      },
      
      assetsDir: 'assets',
      copyPublicDir: true,
      
      // ⭐ MINIFICACIÓN CON ESBUILD (más rápido y estable)
      minify: 'esbuild',
      
      cssCodeSplit: true,
      target: 'es2020',
    },
    
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      port: 5173,
      open: true,
    },
    
    // ⭐ OPTIMIZACIÓN DE DEPENDENCIAS
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'i18next',
        'react-i18next',
        'lucide-react', // ← AÑADIDO explícitamente
      ],
      // ⭐ EXCLUYE paquetes que causan problemas
      exclude: [],
    },
    
    css: {
      modules: {
        localsConvention: 'camelCase',
      },
    },
    
    preview: {
      port: 4173,
      open: true,
    },
  };
});
