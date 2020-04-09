import controller from './controller';
import template from './products.html';

export default {
  bindings: {
    products: '<',
    onProductSelect: '&',
    trackingPrefix: '@',
    onExpand: '&?',
    expand: '<?',
  },
  controller,
  template,
};
