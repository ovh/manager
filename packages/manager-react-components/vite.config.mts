import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import dts from 'vite-plugin-dts';
import tailwindcss from 'tailwindcss';
import { UserConfigExport } from 'vite';
import { getBaseConfig } from '@ovh-ux/manager-vite-config';

const app = async (): Promise<UserConfigExport> => {
  return defineConfig({
    ...getBaseConfig,
    plugins: [
      react(),
      dts({
        insertTypesEntry: true,
      }),
    ],
    css: {
      postcss: {
        plugins: [tailwindcss],
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
    },
  });
};

export default app;
