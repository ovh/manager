import controller from './dedicatedCloud-datacenter-datastore-orderLegacy.controller';
import template from './dedicatedCloud-datacenter-datastore-orderLegacy.html';

export default {
  bindings: {
    datacenterModel: '<',
    goBack: '<',
    productId: '<',
  },
  controller,
  template,
};
