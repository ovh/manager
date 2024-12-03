import { StorybookConfig } from '@storybook/react-vite';

const config = {
  stories: [
    '../src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../src/docs/*.mdx',
    '../src/**/*.mdx',
    '../src/docs/whatsnew/migration-guide/*.mdx',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-styling',
    '@storybook/addon-docs',
    '@etchteam/storybook-addon-status',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {
      builder: {
        viteConfigPath: '.storybook/vite.config.ts',
      },
    },
  },
  docs: {
    autodocs: true,
    defaultName: 'Technical information',
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript', // Necessary for extracting TypeScript types
  },
  webpackFinal: async (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      path: require.resolve('path-browserify'),
    };
    return config;
  },
};
export default config;
