import controller from './dedicatedCloud-datacenter-host-orderLegacy.controller';
import template from './dedicatedCloud-datacenter-host-orderLegacy.html';

export default {
  bindings: {
    datacenterModel: '<',
    goBack: '<',
    productId: '<',
  },
  controller,
  template,
};
