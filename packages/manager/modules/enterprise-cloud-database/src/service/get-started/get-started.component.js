import template from './get-started.html';
import controller from './get-started.controller';

export default {
  bindings: {
    addReplicas: '<',
    clusterDetails: '<',
    clusterType: '<',
    endPoints: '<',
    gotoClusterDetails: '<',
    hostList: '<',
    maintenanceWindow: '<',
    maxHostCount: '<',
    regionInfo: '<',
    securityGroups: '<',
  },
  controller,
  template,
};
