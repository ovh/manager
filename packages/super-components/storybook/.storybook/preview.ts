import { Preview } from '@storybook/html';
import { defineCustomElements as defineOdsCustomElements } from '@ovhcloud/ods-stencil/components/custom-elements-bundle';
import { defineCustomElements as defineMscTile } from '../../components/msc-tile/loader';
import '@ovhcloud/ods-theme-blue-jeans/index.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

defineOdsCustomElements();
defineMscTile();

export default preview;
