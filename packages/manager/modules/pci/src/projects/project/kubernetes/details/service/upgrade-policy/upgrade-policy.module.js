import angular from 'angular';

import component from './upgrade-policy.component';
import routing from './upgrade-policy.routing';

const moduleName = 'ovhManagerPciProjectKubernetesServiceUpgradePolicy';

angular
  .module(moduleName, [])
  .config(routing)
  .component('pciProjectKubernetesServiceUpgradePolicy', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
