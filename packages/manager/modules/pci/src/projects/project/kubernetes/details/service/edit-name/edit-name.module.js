import angular from 'angular';

import component from './edit-name.component';
import routing from './edit-name.routing';

const moduleName = 'ovhManagerPciProjectKubernetesServiceName';

angular
  .module(moduleName, [])
  .config(routing)
  .component('pciProjectKubernetesServiceName', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
