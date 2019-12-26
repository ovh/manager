import angular from 'angular';

import component from './terminate.component';
import routing from './terminate.routing';

const moduleName = 'ovhManagerPciProjectKubernetesServiceTerminate';

angular
  .module(moduleName, [])
  .config(routing)
  .component('pciProjectKubernetesServiceTerminate', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
