import controller from './enable.controller';
import template from './enable.html';

export default {
  bindings: {
    defaultPaymentMean: '<',
    goBack: '<',
    servicesList: '<',
    updateRenew: '<',
  },
  controller,
  template,
};
