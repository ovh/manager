import controller from './dedicatedCloud-datacenter-convert-to-global.controller';
import template from './dedicatedCloud-datacenter-convert-to-global.html';

export default {
  bindings: {
    datacenterId: '<',
    goBack: '<',
    productId: '<',
    datastoreId: '<',
    isGlobal: '<',
  },
  controller,
  template,
};
