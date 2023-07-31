import { Config } from '@stencil/core';
import { getStencilConfig as getOdsStencilConfig } from '@ovhcloud/ods-stencil/libraries/stencil-core';

const excludeComponents = [
  'osds-icon',
  'osds-tile',
  'osds-accordion',
  'osds-accordion-group',
  'osds-button',
  'osds-breadcrumb',
  'osds-cart',
  'osds-cart-footer',
  'osds-cart-footer-item',
  'osds-cart-header',
  'osds-cart-item',
  'osds-cart-item-option',
  'osds-cart-manager',
  'osds-cart-section',
  'osds-cart-total',
  'osds-checkbox',
  'osds-checkbox-button',
  'osds-chip',
  'osds-code',
  'osds-collapsible',
  'osds-content-addon',
  'osds-divider',
  'osds-flag',
  'osds-input',
  'osds-link',
  'osds-location-tile',
  'osds-message',
  'osds-pagination',
  'osds-progress-bar',
  'osds-quantity',
  'osds-radio',
  'osds-radio-button',
  'osds-radio-group',
  'osds-range',
  'osds-select',
  'osds-select-group',
  'osds-select-option',
  'osds-skeleton',
  'osds-spinner',
  'osds-tab-bar',
  'osds-tab-bar-item',
  'osds-tab-panel',
  'osds-tabs',
  'osds-text',
  'osds-textarea',
  'osds-toggle',
];

const args = process.argv.slice(2);

export const getStencilConfig = ({
  namespace,
  componentCorePackage,
}: {
  namespace: string;
  componentCorePackage: string;
}): Config =>
  getOdsStencilConfig({
    namespace,
    args,
    distCustomElements: {
      type: 'dist-custom-elements',
      copy: [
        {
          src: '../../../_common/custom-elements',
          dest: 'custom-elements',
          warn: true,
        },
      ],
    },
    distCustomElementsBundle: {
      type: 'dist-custom-elements-bundle',
      copy: [
        {
          src: '../../../_common/custom-elements-bundle',
          dest: 'custom-elements-bundle',
          warn: true,
        },
      ],
    },
    jestConfig: {
      testRegex: '/(tests|src)/.*\\.(test|spec|screenshot|e2e)?\\.(ts|tsx)$',
      testPathIgnorePatterns: ['global.test.ts'],
      transform: {
        '^.+\\.ts?$': 'ts-jest',
      },
    },
    reactOutput: {
      componentCorePackage,
      excludeComponents,
    },
    vueOutput: {
      componentCorePackage,
      excludeComponents,
    },
    dev: {
      globalScript: 'src/global.dev.ts',
    },
    prod: {
      globalScript: 'src/global.prod.ts',
    },
    test: {
      globalScript: 'src/global.test.ts',
    },
  }) as Config;

export default getStencilConfig;
