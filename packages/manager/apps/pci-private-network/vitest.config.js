import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function relativeImgPathImport() {
  return {
    name: 'relative-img-path-import',
    transform(_code, id) {
      if (/(jpg|jpeg|png|webp|gif|svg)$/.test(id)) {
        const imgSrc = path.relative(process.cwd(), id);
        return {
          code: `export default '${imgSrc}'`,
        };
      }
      return undefined;
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), relativeImgPathImport()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    coverage: {
      include: ['src'],
      exclude: [
        'src/interface',
        'src/__tests__',
        'src/**/*constants.ts',
        'src/vite-*.ts',
        'src/App.tsx',
        'src/core/ShellRoutingSync.tsx',
        'src/core/HidePreloader.tsx',
        'src/i18n.ts',
        'src/main.tsx',
        'src/routes.tsx',
        'src/queryClient.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    mainFields: ['module'],
  },
});
