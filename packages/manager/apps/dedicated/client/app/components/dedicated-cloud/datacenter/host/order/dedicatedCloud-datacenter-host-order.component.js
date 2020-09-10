import controller from './dedicatedCloud-datacenter-host-order.controller';
import template from './dedicatedCloud-datacenter-host-order.html';

export default {
  bindings: {
    datacenterId: '<',
    goBack: '<',
    serviceName: '<',
  },
  controller,
  template,
};
