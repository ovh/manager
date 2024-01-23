import { defineConfig } from 'vite';
import { getBaseConfig } from '@ovh-ux/manager-vite-config';

export default defineConfig(({ command }) => {
  if (command === 'serve') {
    return {
      ...getBaseConfig(),
      base: '/app/',
    };
  }
  return {
    ...getBaseConfig(),
    base: '/#/dedicated/vrack-services/',
  };
});
