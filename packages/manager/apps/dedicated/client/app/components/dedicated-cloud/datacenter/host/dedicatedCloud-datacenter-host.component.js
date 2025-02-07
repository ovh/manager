import controller from './dedicatedCloud-datacenter-host.controller';
import template from './dedicatedCloud-datacenter-host.html';

export default {
  bindings: {
    datacenterId: '<',
    datacenter: '<',
    commercialRangeName: '<',
    orderHost: '<',
    productId: '<',
    resourceUpgrade: '<',
    serviceId: '<',
    usesLegacyOrder: '<',
  },
  controller,
  template,
};
