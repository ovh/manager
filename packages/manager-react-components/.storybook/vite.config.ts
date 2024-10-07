import react from '@vitejs/plugin-react';
import { defineConfig, UserConfigExport } from 'vitest/config';
import tailwindcss from 'tailwindcss';
import path from 'path';

const app = async (): Promise<UserConfigExport> => {
  return defineConfig({
    plugins: [react()],
    css: {
      postcss: {
        plugins: [tailwindcss],
      },
    },
  });
};
// https://vitejs.dev/config/
export default app;
