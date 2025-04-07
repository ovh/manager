import controller from './dedicatedCloud-datacenter-virtualMachine.delete-license.controller';
import template from './dedicatedCloud-datacenter-virtualMachine.delete-license.html';

export default {
  bindings: {
    datacenterId: '<',
    vmId: '<',
    goBack: '<',
    serviceName: '<',
  },
  controller,
  template,
};
