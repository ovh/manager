import angular from 'angular';

import component from './update.component';
import routing from './update.routing';

const moduleName = 'ovhManagerPciProjectKubernetesServiceUpdate';

angular
  .module(moduleName, [])
  .config(routing)
  .component('pciProjectKubernetesServiceUpdate', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
