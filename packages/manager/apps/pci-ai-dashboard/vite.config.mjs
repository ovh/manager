import { defineConfig } from 'vite';
import { getBaseConfig } from '@ovh-ux/manager-vite-config';

const baseConfig = getBaseConfig({});

export default defineConfig({
  ...baseConfig,
});
