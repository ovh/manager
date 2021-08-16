import controller from './controller';
import template from './template.html';

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
    currentActiveLink: '<',
    dashboardLink: '<',
    generalInformationLink: '<',
    hostLink: '<',
    storageLink: '<',
    goToTenant: '<',
    goToOrderHost: '<',
    goToOrderPublicIPs: '<',
    reloadState: '<',
  },
  controller,
  template,
};
