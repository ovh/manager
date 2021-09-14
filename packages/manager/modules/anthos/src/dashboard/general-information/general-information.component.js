import controller from './general-information.controller';
import template from './general-information.html';

export default {
  bindings: {
    serviceName: '<',
    serviceInfo: '<',
    user: '<',
    isCommitmentAvailable: '<',
    tenant: '<',
    hosts: '<',
    netappStorage: '<',
    publicIPs: '<',
    privateIPs: '<',
    displayAlerterMessage: '<',
    goBack: '<',
    goToTenant: '<',
    goToOrderHost: '<',
    goToOrderStorage: '<',
    goToAssignPrivateIp: '<',
    goToOrderPublicIp: '<',
    goToRenameService: '<',
    generalInfoHitTracking: '<',
    trackPage: '<',
    trackClick: '<',
  },
  controller,
  template,
};
