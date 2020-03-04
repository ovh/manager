import controller from './controller';
import template from './products.html';

export default {
  bindings: {
    products: '<',
    onProductSelect: '&',
  },
  controller,
  template,
};
