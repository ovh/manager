import { defineConfig } from 'vite';
import { getBaseConfig } from '@ovh-ux/manager-vite-config';
import { resolve } from 'path';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig(() => {
  const isLABEU = process.env.LABEU === 'true';
  const WILL_PAYMENT_REMOTE_ENTRY_URL = '/order/payment/assets/remoteEntry.js';
  const willPaymentUrl = isLABEU ? `https://www.build-ovh.com${WILL_PAYMENT_REMOTE_ENTRY_URL}`: `https://www.ovhcloud.com${WILL_PAYMENT_REMOTE_ENTRY_URL}`;

  return {
  ...getBaseConfig(),
  root: resolve(process.cwd()),
  plugins: [
    ...getBaseConfig().plugins,
    federation({
      name: 'host-app',
      remotes: {
        willPayment: willPaymentUrl,
      },
      }),
    ],
  };
});


