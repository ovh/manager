import template from './payment-info.html';

const component = {
  bindings: {
    defaultPaymentMethod: '<',
    paymentDescription: '@?',
    paymentInfo: '@?',
  },
  template,
};

export default component;
