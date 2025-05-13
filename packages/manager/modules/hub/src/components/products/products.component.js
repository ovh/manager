import controller from './controller';
import template from './products.html';

export default {
  bindings: {
    products: '<',
    productsPromise: '<',
    onProductSelect: '&',
    trackingPrefix: '@',
  },
  controller,
  template,
};
