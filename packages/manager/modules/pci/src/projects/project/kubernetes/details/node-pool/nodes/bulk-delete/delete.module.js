import angular from 'angular';

import component from './delete.component';
import routing from './delete.routing';

const moduleName = 'ovhManagerPciProjectKubernetesNodesDelete';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('pciProjectKubernetesNodesBulkDeleteComponent', component);

export default moduleName;
