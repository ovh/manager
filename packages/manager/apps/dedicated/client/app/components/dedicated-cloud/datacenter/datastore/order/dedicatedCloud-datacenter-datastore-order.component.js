import controller from './dedicatedCloud-datacenter-datastore-order.controller';
import template from './dedicatedCloud-datacenter-datastore-order.html';

export default {
  bindings: {
    datacenterId: '<',
    goBack: '<',
    pccType: '<',
    serviceName: '<',
  },
  controller,
  template,
};
