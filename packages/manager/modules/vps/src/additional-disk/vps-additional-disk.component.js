import controller from './vps-additional-disk.controller';
import template from './vps-additional-disk.html';

export default {
  name: 'ovhManagerVpsAdditionalDisk',
  controller,
  template,
  bindings: {
    serviceName: '<',
    serviceInfo: '<',
    vps: '<',
    isVpsNewRange: '<',
    catalog: '<',
    vpsLinkedDisk: '<',
    upgradableDisks: '<',
    tabSummary: '<',
    goToOrderAdditionalDisk: '<',
    goToUpgradeDisk: '<',
    goToTerminateDisk: '<',
  },
};
