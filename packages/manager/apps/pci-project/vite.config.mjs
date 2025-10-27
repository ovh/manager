import { defineConfig } from 'vite';
import { getBaseConfig } from '@ovh-ux/manager-vite-config';
import { resolve } from 'path';

export default defineConfig(() => {
  return {
    ...getBaseConfig(),
    root: resolve(process.cwd()),
    plugins: [...getBaseConfig().plugins],
  };
});
