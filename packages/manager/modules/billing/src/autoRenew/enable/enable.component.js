import controller from './enable.controller';
import template from './enable.html';

export default {
  bindings: {
    defaultPaymentMean: '<',
    goToAutorenew: '<',
    servicesList: '<',
    updateRenew: '<',
  },
  controller,
  template,
};
