import { defineConfig } from 'vite';
import { getBaseConfig } from '@ovh-ux/manager-vite-config';
import { resolve } from 'path';
import federation from '@originjs/vite-plugin-federation';

const getWillPaymentEntryUrl = () => {
  if (process.env.LABEU || process.env.NODE_ENV === 'development') {
    return 'https://www.build-ovh.com/order/payment/assets/remoteEntry.js'; 
  }
  
  return '/order/payment/assets/remoteEntry.js';
};

export default defineConfig({
  ...getBaseConfig(),
  root: resolve(process.cwd()),
  plugins: [
    ...getBaseConfig().plugins,
    federation({
      name: 'host-app',
      remotes: {
        willPayment: getWillPaymentEntryUrl(),
      },
    }),
  ],
});


