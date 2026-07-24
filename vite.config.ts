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
        '@components': path.resolve(__dirname, './src/components'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@types': path.resolve(__dirname, './src/types'),
        '@assets': path.resolve(__dirname, './src/assets'),
      },
    },
    
    build: {
      outDir: 'dist',
      sourcemap: true,
      chunkSizeWarningLimit: 1000,
      
      rollupOptions: {
        output: {
          // ✅ CHUNKING CORREGIDO - Sin dependencias circulares
          manualChunks: (id) => {
            // Primero, los chunks de vendor (sin circularidad)
            if (id.includes('node_modules/')) {
              // React y sus dependencias principales
              if (id.includes('node_modules/react') || 
                  id.includes('node_modules/react-dom') || 
                  id.includes('node_modules/scheduler')) {
                return 'vendor-react';
              }
              
              // i18n
              if (id.includes('node_modules/i18next') || 
                  id.includes('node_modules/react-i18next')) {
                return 'vendor-i18n';
              }
              
              // UI y animaciones
              if (id.includes('node_modules/framer-motion') || 
                  id.includes('node_modules/motion') ||
                  id.includes('node_modules/lucide-react')) {
                return 'vendor-ui';
              }
              
              // Router
              if (id.includes('node_modules/react-router-dom') || 
                  id.includes('node_modules/react-router')) {
                return 'vendor-router';
              }
              
              // Todo lo demás de node_modules
              return 'vendor-other';
            }
            
            // Componentes principales (solo si existen)
            if (id.includes('/src/components/AdminPanel')) {
              return 'admin-panel';
            }
            
            if (id.includes('/src/components/SGCProcessMap')) {
              return 'sgc-map';
            }
            
            if (id.includes('/src/components/ManualSIG')) {
              return 'manual-sig';
            }
            
            if (id.includes('/src/components/CurriculumShowcaseModal')) {
              return 'curriculum-modal';
            }
            
            if (id.includes('/src/components/CoachingPillarsPanel')) {
              return 'coaching-panel';
            }
            
            if (id.includes('/src/components/ChatWidget')) {
              return 'chat-widget';
            }
            
            // Páginas
            if (id.includes('/src/pages/') || id.includes('/src/views/')) {
              return 'pages';
            }
            
            // Si no coincide con nada, va al chunk principal
            return null;
          },
          
          // Nombres de archivos
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
      },
      
      assetsDir: 'assets',
      copyPublicDir: true,
      
      // ✅ ELIMINAR TERSER - Usar esbuild por defecto (más rápido)
      // minify: 'esbuild' es el valor por defecto, no hace falta especificarlo
      
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
        'framer-motion',
        'lucide-react',
      ],
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
