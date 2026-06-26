import { init } from '@module-federation/runtime';

import { isLabeuEnvironment, isProdEnvironment } from './environment';

export { isProdEnvironment };

const getWillPaymentUrl = (): string => {
  // ISO date prefix truncated to the minute: "2026-06-26T14:30"
  // Used as CDN cache-busting query parameter (duplicated from Manager/billing pattern)
  const minute = new Date().toISOString().slice(0, 16);

  /** In preprod and prod environments, use a relative path to mitigate potential DDOS attacks */
  if (isProdEnvironment()) {
    return `/payment/assets/remoteEntry.js?v=${minute}`;
  }

  if (isLabeuEnvironment() && import.meta.env.VITE_WP_LABEU_ENTRY_POINT) {
    return `${import.meta.env.VITE_WP_LABEU_ENTRY_POINT}v=${minute}`;
  }

  return `https://www.ovhcloud.com/payment/assets/remoteEntry.js?v=${minute}`;
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
