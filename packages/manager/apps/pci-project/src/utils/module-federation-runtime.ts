import { init } from '@module-federation/runtime';

const isLabeuEnvironment = /\.labeu\./.test(window.location.hostname);

const getWillPaymentUrl = () =>
  (isLabeuEnvironment && import.meta.env.VITE_WP_LABEU_ENTRY_POINT) ||
  'https://www.ovhcloud.com/order/payment/assets/remoteEntry.js';

/**
 * Initialize Module Federation runtime
 * Called once at application startup (see index.tsx)
 */
export const initModuleFederation = (): void => {
  init({
    name: 'pci-project',
    remotes: [
      {
        name: 'willPayment',
        entry: getWillPaymentUrl(),
        type: 'module',
      },
    ],
  });
};
