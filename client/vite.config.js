import { defineConfig } from 'vite';

export default defineConfig({
  root: './src/index.js', 
  build: {
    outDir: 'dist', // Directorio de salida
    rollupOptions: {
      external: ['electron'], // Evita que Electron se incluya en el bundle
    },
  },
  resolve: {
    alias: {
      // Aliases opcionales, por ejemplo, para simplificar rutas
    },
  },
  optimizeDeps: {
    exclude: ['electron'], // Excluye Electron de las dependencias optimizadas
  },
});
