import angular from 'angular';

import component from './component';

const moduleName = 'ovhManagerPrivateRegistryPlanUpgrade';

angular
  .module(moduleName, [])
  .component('pciPrivateRegistryUpgradePlan', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
