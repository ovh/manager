import { init } from '@module-federation/runtime';

import { isLabeuEnvironment, isProdEnvironment } from './environment';

export { isProdEnvironment };

const getWillPaymentUrl = (): string => {
  /** In preprod and prod environments, use a relative path to mitigate potential DDOS attacks */
  if (isProdEnvironment()) {
    return '/order/payment/assets/remoteEntry.js';
  }

  return (
    (isLabeuEnvironment() && import.meta.env.VITE_WP_LABEU_ENTRY_POINT) ||
    'https://www.ovhcloud.com/order/payment/assets/remoteEntry.js'
  );
};

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
