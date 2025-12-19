import { defineConfig } from 'vite';
import { getBaseConfig } from '@ovh-ux/manager-vite-config';
import { getMetricsToCustomerConfig } from '@ovh-ux/metrics-to-customer/vite-config';
import tailwindcss from 'tailwindcss';

const metricsToCustomerConfig = getMetricsToCustomerConfig();
const baseConfig = getBaseConfig(metricsToCustomerConfig);

export default defineConfig({
  ...baseConfig,
  root: '',
  css: {
    ...baseConfig.css,
    postcss: {
      plugins: [tailwindcss],
    },
  },
  resolve: {
    ...baseConfig.resolve,
  },
});
