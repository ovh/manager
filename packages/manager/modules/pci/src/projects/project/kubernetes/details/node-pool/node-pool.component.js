import controller from './node-pool.controller';
import template from './node-pool.html';

const component = {
  bindings: {
    addNodePool: '<',
    cluster: '<',
    deleteNodePool: '<',
    editNodePool: '<',
    getNodesStateHref: '<',
    kubeId: '<',
    nodePools: '<',
    projectId: '<',
    project: '<',
    refreshNodePools: '<',
  },
  controller,
  template,
};

export default component;
