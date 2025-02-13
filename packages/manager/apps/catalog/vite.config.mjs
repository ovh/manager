import { mergeConfig, defineConfig } from 'vite';
import path from 'path';
import federation from '@originjs/vite-plugin-federation';
import { getBaseConfig } from '@ovh-ux/manager-vite-config';

export default defineConfig(
  mergeConfig(getBaseConfig(), {
    plugins: [
      federation({
        name: '@order/federated-modules',
        remotes: {
          order_fm:
            'https://www.ovhcloud.com/order/configos/assets/remoteEntry.js',
        },
      }),
    ],
    resolve: {
      alias: {
        'order_fm/ConfigoNasHa': path.resolve(
          __dirname,
          './src/types/orderConfigos.d.ts',
        ),
      },
    },
  }),
);
