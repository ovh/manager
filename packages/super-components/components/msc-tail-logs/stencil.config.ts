import { getStencilConfig } from '../../_common/stencil-config';
import { name as componentCorePackage } from './package.json';

export const config = getStencilConfig({
  namespace: 'msc-tail-logs',
  componentCorePackage,
});

export default config;
