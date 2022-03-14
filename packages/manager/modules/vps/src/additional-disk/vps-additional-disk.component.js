import controller from './vps-additional-disk.controller';
import template from './vps-additional-disk.html';

export default {
  name: 'ovhManagerVpsAdditionalDisk',
  controller,
  template,
  bindings: {
    serviceName: '<',
    vps: '<',
    isVpsNewRange: '<',
    upgradableDisks: '<',
    tabSummary: '<',
    goToOrderAdditionalDisk: '<',
    goToUpgradeDisk: '<',
    goToTerminateDisk: '<',
  },
};
