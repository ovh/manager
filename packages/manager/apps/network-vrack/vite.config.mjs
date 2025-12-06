import { resolve } from 'node:path';
import { defineConfig } from 'vite';

import { getBaseConfig } from '@ovh-ux/manager-vite-config';

export default defineConfig({
  ...getBaseConfig(),
  root: resolve(process.cwd()),
});
