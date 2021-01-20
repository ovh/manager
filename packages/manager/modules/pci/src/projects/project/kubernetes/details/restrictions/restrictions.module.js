import angular from 'angular';

import component from './component';
import routing from './routing';

const moduleName = 'ovhManagerPciProjectKubernetesRestrictions';

angular
  .module(moduleName, [])
  .config(routing)
  .component('pciProjectKubernetesRestrictions', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
