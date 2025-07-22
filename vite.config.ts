import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  build: {
    cssCodeSplit: false,
    minify: true,
    outDir: 'dist',
    emptyOutDir: true,
    assetsInlineLimit: 100000000,
  },
})
