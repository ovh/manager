import controller from './update.controller';
import template from './update.html';

export default {
  bindings: {
    addPaymentMean: '<',
    autoRenewAgreements: '<',
    defaultPaymentMean: '<',
    goBack: '<',
    service: '<',
    updateRenew: '<',
  },
  controller,
  template,
};
