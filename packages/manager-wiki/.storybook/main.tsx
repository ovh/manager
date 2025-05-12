import { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.stories.tsx',
    '../stories/**/*.mdx',
    // '../../manager-react-components/src/**/*.stories.tsx',
    // '../../manager-react-components/src/**/*.mdx',
    // '../../manager/modules/common-api/docs/**/*.mdx',
    // '../../manager/modules/common-translations/docs/**/*.mdx',
    // '../../manager/modules/manager-pci-common/docs/**/*.mdx',
    // '../../manager/modules/vcd-api/docs/**/*.mdx',
    // '../../manager/core/api/docs/**/*.mdx',
    // '../../manager/core/generator/docs/**/*.mdx',
    // '../../manager/core/request-tagger/docs/**/*.mdx',
    // '../../manager/core/shell-client/docs/**/*.mdx',
    // '../../manager/core/sso/docs/**/*.mdx',
    // '../../manager/core/tailwind-config/docs/***/*.mdx',
    // '../../manager/core/utils/docs/**/*.mdx',
    // '../../manager/core/vite-config/docs/***/*.mdx',
    // '../../components/ovh-at-internet/docs/***/*.mdx',
    // '../../components/ovh-shell/docs**/*.mdx',
    // '../introduction.mdx',
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
  staticDirs: ['./public/assets'],
  docs: {
    autodocs: true,
    defaultName: 'Technical information',
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    check: false,
  },
  core: {
    disableTelemetry: true,
  },
  managerHead: (head) => `
    ${head}
    <link rel="stylesheet" type="text/css" href="css/storybook.css" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="description" content="A collection of assets, guidelines and UI components for building consistent user experiences across OVHcloud products."/>
  `,
  previewHead: (head) => `
    ${head}
    <link rel="stylesheet" type="text/css" href="css/preview.css" />
  `,
};
export default config;
