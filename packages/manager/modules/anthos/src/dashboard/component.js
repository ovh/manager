import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    serviceName: '<',
    serviceInfo: '<',
    alertId: '<',
    tenant: '<',
    hosts: '<',
    netappStorage: '<',
    publicIPs: '<',
    privateIPs: '<',
    displayAlerterMessage: '<',
    currentActiveLink: '<',
    dashboardLink: '<',
    generalInformationLink: '<',
    hostLink: '<',
    storageLink: '<',
    ipsLink: '<',
    goToTenant: '<',
    goToOrderHost: '<',
    goToOrderPublicIPs: '<',
    goToAssignPrivateIp: '<',
    goToRemovePrivateIp: '<',
    reloadState: '<',
  },
  controller,
  template,
};
