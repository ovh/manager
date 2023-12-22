import { defineConfig } from 'vite';
import { getBaseConfig } from '@ovh-ux/manager-vite-config';
import generouted from '@generouted/react-router/plugin';

const baseConfig = getBaseConfig();
baseConfig.plugins.push(generouted());
export default defineConfig({
  ...baseConfig,
  root: '',
});
