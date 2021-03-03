import basicOptionsModule from '../../../../../components/dedicated-cloud/service-pack/upgrade/types/basicOptions';

import { registerState } from './basicOptions.routing';

const moduleName = 'managedBaremetalServicePackUpgradeBasicOptions';

angular
  .module(moduleName, [basicOptionsModule])
  .config(registerState)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
