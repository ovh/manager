import controller from './node-pool.controller';
import template from './template.html';

const component = {
  bindings: {
    addNode: '<',
    cluster: '<',
    deleteNode: '<',
    kubeId: '<',
    nodes: '<',
    projectId: '<',
    project: '<',
    refreshNodes: '<',
    switchBillingType: '<',
  },
  controller,
  template,
};

export default component;
