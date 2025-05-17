import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    port: 3000,
    host: true
  },
  resolve: {
    alias: {
      'react-map-gl': 'react-map-gl/dist/esm'
    }
  }
});
