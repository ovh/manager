import angular from 'angular';

import deleteNode from './delete';
import nodeComponents from './component';
import routing from './nodes.routing';
import switchBillingType from './billing-type';

const moduleName = 'ovhManagerPciProjectKubernetesNodePoolNodes';

angular
  .module(moduleName, [deleteNode, switchBillingType])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(
    'ovhManagerPciProjectKubernetesNodePoolNodesComponent',
    nodeComponents,
  );

export default moduleName;
