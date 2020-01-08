import angular from 'angular';

import component from './reset.component';
import routing from './reset.routing';

const moduleName = 'ovhManagerPciProjectKubernetesServiceReset';

angular
  .module(moduleName, [])
  .config(routing)
  .component('pciProjectKubernetesServiceReset', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
