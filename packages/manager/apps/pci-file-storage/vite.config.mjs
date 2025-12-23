import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import tailwindcss from 'tailwindcss';

import { getBaseConfig } from '@ovh-ux/manager-vite-config';

export default defineConfig({
  ...getBaseConfig(),
  root: resolve(process.cwd()),
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
});
