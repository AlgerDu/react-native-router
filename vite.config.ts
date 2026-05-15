import react from '@vitejs/plugin-react-swc';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      rollupTypes: true,
      tsconfigPath: './tsconfig.app.json',
      insertTypesEntry: true
    })
  ],
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'lib/main.ts'),
      name: 'MyLib',
      fileName: 'my-lib',
      formats: ['es'],
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        }
      }
    }
  }
})
