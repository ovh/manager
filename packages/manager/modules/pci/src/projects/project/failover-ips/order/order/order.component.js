import controller from './order.controller';
import template from './order.html';

export default {
  controller,
  template,
  bindings: {
    availableRegionsForOrder: '<',
    instances: '<',
    products: '<',
    projectId: '<',
    goBack: '<',
  },
};
