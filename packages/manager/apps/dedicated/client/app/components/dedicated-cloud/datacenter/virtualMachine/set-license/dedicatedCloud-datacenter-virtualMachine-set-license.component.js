import controller from './dedicatedCloud-datacenter-virtualMachine-set-license.controller';
import template from './dedicatedCloud-datacenter-virtualMachine-set-license.html';

export default {
  bindings: {
    datacenterId: '<',
    vmId: '<',
    guestOsFamily: '<',
    goBack: '<',
    serviceName: '<',
    trackClick: '<',
    trackPage: '<',
  },
  controller,
  template,
};
