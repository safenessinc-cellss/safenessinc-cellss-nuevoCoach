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
      chunkSizeWarningLimit: 1000, // Aumenta el límite de advertencia a 1MB
      
      rollupOptions: {
        output: {
          // Estrategia de chunking optimizada
          manualChunks: (id) => {
            // Core de React y sus dependencias
            if (id.includes('node_modules/react') || 
                id.includes('node_modules/react-dom') || 
                id.includes('node_modules/react-router-dom') ||
                id.includes('node_modules/scheduler')) {
              return 'vendor-react';
            }
            
            // i18n y sus dependencias
            if (id.includes('node_modules/i18next') || 
                id.includes('node_modules/react-i18next')) {
              return 'vendor-i18n';
            }
            
            // Animaciones y UI
            if (id.includes('node_modules/framer-motion') || 
                id.includes('node_modules/motion') ||
                id.includes('node_modules/lucide-react')) {
              return 'vendor-ui';
            }
            
            // Utilidades y otras dependencias
            if (id.includes('node_modules/') && 
                !id.includes('node_modules/.vite') &&
                !id.includes('node_modules/@vitejs')) {
              return 'vendor-other';
            }
            
            // Componentes específicos (code-splitting por módulos)
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
            
            // Páginas principales
            if (id.includes('/src/pages/') || id.includes('/src/views/')) {
              return 'pages';
            }
          },
          
          // Nombres de archivos más descriptivos
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
      },
      
      assetsDir: 'assets',
      copyPublicDir: true,
      
      // Minificación avanzada
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: process.env.NODE_ENV === 'production',
          drop_debugger: process.env.NODE_ENV === 'production',
        },
      },
      
      // Separación de CSS
      cssCodeSplit: true,
      
      // Target de navegadores
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
      exclude: [
        // Excluye paquetes que no necesitan optimización
      ],
    },
    
    // Configuración de CSS
    css: {
      modules: {
        localsConvention: 'camelCase',
      },
    },
    
    // Preview (para ver el build localmente)
    preview: {
      port: 4173,
      open: true,
    },
  };
});
