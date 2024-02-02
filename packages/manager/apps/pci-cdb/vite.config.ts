import { defineConfig } from 'vite';
import { getBaseConfig } from '@ovh-ux/manager-vite-config';
import generouted from '@generouted/react-router/plugin';

const baseConfig = getBaseConfig();
const configWithPlugin = { ...baseConfig };
configWithPlugin.plugins.push(generouted());
export default defineConfig({
  ...configWithPlugin,
  root: '',
});
