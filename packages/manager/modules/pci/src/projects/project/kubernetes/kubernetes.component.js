import controller from './kubernetes.controller';
import template from './kubernetes.html';

export default {
  bindings: {
    addCluster: '<',
    guideUrl: '<',
    kubernetes: '<',
    projectId: '<',
    privateNetworks: '<',
    clusterId: '<',
    onListParamChange: '<',
  },
  controller,
  template,
};
