import { defineConfig } from 'vite';
import { getBaseConfig } from '@ovh-ux/manager-vite-config';

export default defineConfig(({ command, mode, ssrBuild }) => {
    if (command === 'serve') {
      return {
        ...getBaseConfig(),
        base: '/app/'
      }
    } else {
      return {
        ...getBaseConfig(),
        base: './'
      }
    }
})