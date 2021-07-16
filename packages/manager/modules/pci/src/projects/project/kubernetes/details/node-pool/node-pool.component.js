import controller from './node-pool.controller';
import template from './node-pool.html';

const component = {
  bindings: {
    addNodePool: '<',
    scaleNodePool: '<',
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
