import { getStencilConfig } from '../../_common/stencil-config';
import { name as componentCorePackage } from './package.json';

export const config = getStencilConfig({
  namespace: 'msc-billing-tile',
  componentCorePackage,
});

// Add a new output target to copy the translation files
config.outputTargets = [
  {
    type: 'www',
    copy: [{ src: 'translations', dest: 'translations' }],
  },
];

export default config;
