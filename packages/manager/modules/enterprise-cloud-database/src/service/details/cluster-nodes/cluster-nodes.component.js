import template from './cluster-nodes.html';
import controller from './cluster-nodes.controller';

export default {
  bindings: {
    addReplicas: '<',
    clusterId: '<',
    deleteReplicas: '<',
    hosts: '<',
    planCatalog: '<',
    refreshNodes: '<',
  },
  controller,
  template,
};
