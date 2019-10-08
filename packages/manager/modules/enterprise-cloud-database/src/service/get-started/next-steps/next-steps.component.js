import controller from './next-steps.controller';
import template from './next-steps.html';

export default {
  template,
  controller,
  bindings: {
    addReplicas: '&',
    clusterDetails: '<',
    clusterType: '<',
    disabled: '<',
    endPoints: '<',
    hostList: '<',
    maintenanceWindow: '<',
    onDataChange: '&',
    regionInfo: '<',
    replicaConfig: '<',
  },
};
