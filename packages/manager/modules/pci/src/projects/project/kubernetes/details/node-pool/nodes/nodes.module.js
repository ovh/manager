import angular from 'angular';

import add from './add';
import bulkDelete from './bulk-delete';
import deleteNode from './delete';
import nodeComponents from './component';
import routing from './nodes.routing';
import switchBillingType from './billing-type';

const moduleName = 'ovhManagerPciProjectKubernetesNodePoolNodes';

angular
  .module(moduleName, [add, bulkDelete, deleteNode, switchBillingType])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('ovhManagerPciProjectKubernetesNodePoolNodesComponent', nodeComponents);

export default moduleName;
