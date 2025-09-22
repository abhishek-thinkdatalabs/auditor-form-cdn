import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: mode === 'cdn' ? {
    lib: {
      entry: 'src/cdn.tsx',
      name: 'AuditorForm',
      fileName: 'auditor-form',
      formats: ['umd']
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {}
      }
    },
    cssCodeSplit: false
  } : undefined,
  define: {
    global: 'globalThis',
    'process.env': {}  
  },
}));