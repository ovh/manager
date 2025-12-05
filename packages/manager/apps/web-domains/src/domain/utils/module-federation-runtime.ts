import { init } from '@module-federation/runtime';

const isStagingEnvironment = /\.dtci\./.test(window.location.hostname);
const isLocal = /localhost|127\.0\.0\.1/.test(window.location.hostname);

const getWillOrderUrl = () => {
  if (isStagingEnvironment) {
    return 'https://ovhcloudcomdev.static.ovh.net/order/builder/assets/remoteEntry.js';
  }
  // Run module federation in local mode `yarn dev:mf`
  if (isLocal) {
    return 'http://localhost:5001/assets/remoteEntry.js';
  }
  return '/order/builder/assets/remoteEntry.js';
};

/**
 * Initialize Module Federation runtime
 * Called once at application startup (see index.tsx)
 */
export const initModuleFederation = (): void => {
  init({
    name: 'webhosting',
    remotes: [
      {
        name: 'react-order',
        entry: getWillOrderUrl(),
        type: 'module',
      },
    ],
  });
};
