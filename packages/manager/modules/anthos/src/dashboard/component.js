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
    goToRemovePrivateIp: '<',
    reloadState: '<',
    trackingPrefix: '<',
    trackClick: '<',
    trackPage: '<',
  },
  controller,
  template,
};
