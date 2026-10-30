import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // The 3D cube (Three.js) is loaded on demand in its own chunk.
  build: { chunkSizeWarningLimit: 1000 },
});
