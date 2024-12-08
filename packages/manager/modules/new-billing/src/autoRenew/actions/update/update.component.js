import controller from './update.controller';
import template from './update.html';

export default {
  bindings: {
    addPaymentMean: '<',
    autorenewAgreements: '<',
    defaultPaymentMean: '<',
    goBack: '<',
    service: '<',
    updateRenew: '<',
  },
  controller,
  template,
};
