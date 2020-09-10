import controller from './dedicatedCloud-datacenter-datastore.controller';
import template from './dedicatedCloud-datacenter-datastore.html';

export default {
  bindings: {
    datacenter: '<',
    datacenterId: '<',
    orderDatastore: '<',
    productId: '<',
    resourceUpgrade: '<',
    serviceId: '<',
    usesLegacyOrder: '<',
  },
  controller,
  template,
};
