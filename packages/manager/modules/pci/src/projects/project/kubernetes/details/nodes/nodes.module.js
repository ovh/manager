import angular from 'angular';

import add from './add';
import deleteNode from './delete';
import nodeComponents from './component';
import routing from './nodes.routing';
import switchBillingType from './billing-type';

const moduleName = 'ovhManagerPciProjectKubernetesNodes';

angular
  .module(moduleName, [add, deleteNode, switchBillingType])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('ovhManagerPciProjectKubernetesNodesComponent', nodeComponents);

export default moduleName;
