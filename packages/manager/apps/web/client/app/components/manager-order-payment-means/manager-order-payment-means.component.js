import controller from './manager-order-payment-means.controller';
import template from './manager-order-payment-means.html';

const component = {
  bindings: {
    name: '@',
    label: '@?',
    block: '<?',
    defaultPaymentMean: '<',
    model: '=',
  },
  controller,
  template,
};

export default component;
