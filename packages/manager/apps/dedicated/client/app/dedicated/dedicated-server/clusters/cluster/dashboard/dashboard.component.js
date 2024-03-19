import controller from './dashboard.controller';
import template from './dashboard.html';

export default {
  bindings: {
    statePrefix: '<',
    cluster: '<',
    isCommitmentAvailable: '<',
    serviceInfos: '<',
    user: '<',
    trackingPrefix: '<',
    displayName: '<',
    commercialName: '<',
  },
  controller,
  template,
  require: {
    dedicatedCluster: '^clusterMainPage',
  },
};
