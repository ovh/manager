import controller from './dedicatedCloud-datacenter-virtualMachine.controller';
import template from './dedicatedCloud-datacenter-virtualMachine.html';

export default {
  bindings: {
    datacenterId: '<',
    datacenter: '<',
    dedicatedCloud: '<',
    setMessage: '<',
    goToDeleteLicense: '<',
    goToSetLicense: '<',
  },
  controller,
  template,
};
