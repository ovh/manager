import { init } from '@module-federation/runtime';

import { isLabeuEnvironment, isProdEnvironment } from './environment';

export { isProdEnvironment };

const getWillPaymentUrl = (): string => {
  const preprodEnvironment =
    'aHR0cHM6Ly9vdmhjbG91ZGNvbWRldi5zdGF0aWMub3ZoLm5ldC9vcmRlci9wYXltZW50L2Fzc2V0cy9yZW1vdGVFbnRyeS5qcw==';
  return (
    (isLabeuEnvironment() && import.meta.env.VITE_WP_LABEU_ENTRY_POINT) || atob(preprodEnvironment)
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
