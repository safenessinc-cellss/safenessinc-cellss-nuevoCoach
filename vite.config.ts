
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
          // ✅ CONFIGURACIÓN SIMPLIFICADA - Sin manualChunks complejos
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'i18n-vendor': ['i18next', 'react-i18next'],
            // 👇 LUCIDE-REACT va SOLO en este chunk
            'icons-vendor': ['lucide-react'],
          },
        },
      },
      
      assetsDir: 'assets',
      copyPublicDir: true,
      minify: 'esbuild',
      cssCodeSplit: true,
      target: 'es2020',
    },
    
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      port: 5173,
      open: true,
    },
    
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'i18next',
        'react-i18next',
        'lucide-react',
      ],
      // ✅ EXCLUYE todo lo demás para evitar conflictos
      exclude: [],
      // ✅ FORZA el rebuild de lucide-react
      force: true,
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
