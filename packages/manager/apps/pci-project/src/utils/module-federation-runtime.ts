import { init } from '@module-federation/runtime';

const isLabeuEnvironment = /\.labeu\./.test(window.location.hostname);

const isStagingEnvironment = /\.dtci\./.test(window.location.hostname);

const getWillPaymentUrl = () => {
  if (isLabeuEnvironment) {
    return 'https://www.build-ovh.com/order/payment/assets/remoteEntry.js';
  }
  if (isStagingEnvironment) {
    return 'https://ovhcloudcomdev.static.ovh.net/order/payment/assets/remoteEntry.js';
  }
  return 'https://www.ovhcloud.com/order/payment/assets/remoteEntry.js';
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
