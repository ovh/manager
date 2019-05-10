import angular from 'angular';

import routing from './nodes.routing';

import nodeComponents from './component';
import add from './add';
import deleteNode from './delete';

const moduleName = 'ovhManagerPciProjectKubernetesNodes';

angular.module(moduleName, [
  add,
  deleteNode,
])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('ovhManagerPciProjectKubernetesNodesComponent', nodeComponents);

export default moduleName;
