import { defineConfig } from 'vite';
import { getBaseConfig } from '@ovh-ux/manager-vite-config';

const baseConfig = getBaseConfig({});
baseConfig.server.fs = { strict: false };
export default defineConfig({
  ...baseConfig,
});
