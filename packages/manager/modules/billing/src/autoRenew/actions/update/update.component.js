import controller from './update.controller';
import template from './update.html';

export default {
  bindings: {
    addPaymentMean: '<',
    autoRenewAgreements: '<',
    defaultPaymentMean: '<',
    goToAutorenew: '<',
    service: '<',
    updateRenew: '<',
  },
  controller,
  template,
};
