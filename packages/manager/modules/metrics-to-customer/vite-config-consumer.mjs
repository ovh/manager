import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

/**
 * Get the Vite configuration fragment for metrics-to-customer module
 * This should be merged with getBaseConfig() in consumer apps
 * 
 * @returns {Object} Configuration object with staticCopyTargets
 */
export function getMetricsToCustomerConfig() {
  // Get the directory of this config file (logs-to-customer package root)
  const packageRoot = dirname(fileURLToPath(import.meta.url));
  const translationsSourcePath = resolve(packageRoot, 'dist/metrics-to-customer/translations');

  return {
    staticCopyTargets: [
      {
        src: `${translationsSourcePath}/*`,
        dest: 'translations/metrics-to-customer',
      },
    ],    
  };
}
