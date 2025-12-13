import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

/**
 * Get the Vite configuration fragment for logs-to-customer module
 * This should be merged with getBaseConfig() in consumer apps
 * 
 * @returns {Object} Configuration object with staticCopyTargets and dedupe list
 */
export function getLogsToCustomerConfig() {
  // Get the directory of this config file (logs-to-customer package root)
  const packageRoot = dirname(fileURLToPath(import.meta.url));
  const translationsSourcePath = resolve(packageRoot, 'dist/@ovh-ux/logs-to-customer/translations');

  return {
    staticCopyTargets: [
      {
        src: `${translationsSourcePath}/*`,
        dest: 'translations/logs-to-customer',
      },
    ],
    dedupe: [
      '@tanstack/react-virtual',
      '@ovh-ux/muk',
    ],
  };
}

