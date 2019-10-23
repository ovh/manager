import controller from './order-payment-means.controller';
import template from './order-payment-means.html';

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
