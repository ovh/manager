import react from '@vitejs/plugin-react-swc';
import { defineConfig, UserConfigExport } from 'vitest/config';
import tailwindcss from 'tailwindcss';

const app = async (): Promise<UserConfigExport> => {
  return defineConfig({
    plugins: [react()],
    assetsInclude: ['*.md'],
    css: {
      postcss: {
        plugins: [tailwindcss],
      },
    },
  });
};
// https://vitejs.dev/config/
export default app;
