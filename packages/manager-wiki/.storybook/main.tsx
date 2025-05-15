import { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    '../../manager-react-components/**/*.stories.tsx',
    '../../manager-react-components/**/*.mdx',
    '../../manager/modules/common-api/**/*.mdx',
    '../../manager/modules/common-translations/**/*.mdx',
    '../../manager/modules/manager-pci-common/**/*.mdx',
    '../../manager/modules/vcd-api/**/*.mdx',
    '../../manager/core/api/**/*.mdx',
    '../../manager/core/generator/**/*.mdx',
    '../../manager/core/request-tagger/**/*.mdx',
    '../../manager/core/shell-client/**/*.mdx',
    '../../manager/core/sso/**/*.mdx',
    '../../manager/core/tailwind-config/**/*.mdx',
    '../../manager/core/utils/**/*.mdx',
    '../../manager/core/vite-config/**/*.mdx',
    '../../components/ovh-at-internet/**/*.mdx',
    '../../components/ovh-shell/**/*.mdx',
    '../introduction.mdx',
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
