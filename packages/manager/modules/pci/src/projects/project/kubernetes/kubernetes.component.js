import controller from './kubernetes.controller';
import template from './kubernetes.html';

export default {
  bindings: {
    pciFeatureRedirect: '<',
    projects: '<',
    addCluster: '<',
    guideUrl: '<',
    kubernetes: '<',
    projectId: '<',
    privateNetworks: '<',
    clusterId: '<',
    isTrustedZone: '<',
    onListParamChange: '<',
  },
  controller,
  template,
};
