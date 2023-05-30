import configurationOnly from '../../../../../components/dedicated-cloud/service-pack/upgrade/types/configuration-only';

import { registerState } from './configuration-only.routing';

const moduleName = 'managedBaremetalServicePackUpgradeConfigurationOnly';

angular
  .module(moduleName, [configurationOnly])
  .config(registerState)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
