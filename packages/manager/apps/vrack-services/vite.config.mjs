import { defineConfig } from 'vite';
import { getBaseConfig } from '@ovh-ux/manager-vite-config';

export default defineConfig(({ command }) => ({
  ...getBaseConfig(),
  base: command === 'serve' ? '/app/' : '/#/dedicated/vrack-services/',
}));
