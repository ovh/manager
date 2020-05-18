import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    addNode: '<',
    cluster: '<',
    bulkDelete: '<',
    deleteNode: '<',
    flavors: '<',
    kubeId: '<',
    nodes: '<',
    nodePool: '<',
    nodePoolName: '<',
    nodePoolFlavor: '<',
    projectId: '<',
    project: '<',
    refreshNodes: '<',
    switchBillingType: '<',
  },
  controller,
  template,
};

export default component;
