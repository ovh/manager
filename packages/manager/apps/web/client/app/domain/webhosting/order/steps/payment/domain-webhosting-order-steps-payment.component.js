import controller from './domain-webhosting-order-steps-payment.controller';
import template from './domain-webhosting-order-steps-payment.html';

export default {
  bindings: {
    cartId: '<',
    deleteCartItems: '<',
    domainName: '<',
    goBackToDashboard: '<',
    prepareCheckout: '<',

    displayErrorMessage: '<',
    stepperPosition: '@',
  },
  controller,
  name: 'ovhManagerWebDomainWebhostingOrderStepsPayment',
  require: {
    stepper: '^ovhManagerWebDomainWebhostingOrderSteps',
  },
  template,
};
