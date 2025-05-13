import controller from './dedicatedCloud-datacenter-delete.controller';
import template from './dedicatedCloud-datacenter-delete.html';

export default {
  bindings: {
    datacenterId: '<',
    goBack: '<',
    productId: '<',
  },
  controller,
  template,
};
