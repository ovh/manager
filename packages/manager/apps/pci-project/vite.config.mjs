import { defineConfig } from 'vite';
import { getBaseConfig } from '@ovh-ux/manager-vite-config';
import { resolve } from 'path';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  ...getBaseConfig(),
  root: resolve(process.cwd()),
  plugins: [
    ...getBaseConfig().plugins,
    federation({
      name: 'host-app',
      remotes: {
        willPayment: 'https://www.ovhcloud.com/order/payment/assets/remoteEntry.js',
      },
    }),
  ],
});


