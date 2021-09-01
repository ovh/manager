import controller from './general-information.controller';
import template from './general-information.html';

export default {
  bindings: {
    serviceName: '<',
    serviceInfo: '<',
    tenant: '<',
    hosts: '<',
    netappStorage: '<',
    publicIPs: '<',
    privateIPs: '<',
    displayAlerterMessage: '<',
    goBack: '<',
    goToTenant: '<',
    goToOrderHost: '<',
    goToAssignPrivateIp: '<',
    goToOrderPublicIp: '<',
    goToRenameService: '<',
  },
  controller,
  template,
};
