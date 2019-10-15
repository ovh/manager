import template from './settings.html';
import controller from './settings.controller';

export default {
  bindings: {
    addRule: '<',
    clusterDetails: '<',
    createSecurityGroup: '<',
    deleteRule: '<',
    deleteSecurityGroup: '<',
    editSecurityGroup: '<',
    maintenanceWindow: '<',
    regionInfo: '<',
    reload: '<',
    securityGroupId: '<',
    securityGroups: '<',
  },
  controller,
  template,
};
