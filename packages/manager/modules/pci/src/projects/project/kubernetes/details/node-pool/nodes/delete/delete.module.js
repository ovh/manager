import angular from 'angular';

import routing from './delete.routing';

import component from './delete.component';

const moduleName = 'ovhManagerPciProjectKubernetesNodesDelete';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('pciProjectKubernetesNodesDeleteComponent', component);

export default moduleName;
