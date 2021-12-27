import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    alertId: '<',
    dashboardLink: '<',
    displayAlerterMessage: '<',
    generalInformationLink: '<',
    goToRemovePrivateIp: '<',
    goToTenant: '<',
    hostLink: '<',
    hosts: '<',
    ipsLink: '<',
    isGeneralInformationTabActive: '<',
    isHostTabActive: '<',
    isIpsTabActive: '<',
    isStorageTabActive: '<',
    privateIPs: '<',
    publicIPs: '<',
    reloadState: '<',
    serviceInfo: '<',
    serviceName: '<',
    storageLink: '<',
    storageUsage: '<',
    tenant: '<',
    trackClick: '<',
    trackingPrefix: '<',
    trackPage: '<',
  },
  controller,
  template,
};
