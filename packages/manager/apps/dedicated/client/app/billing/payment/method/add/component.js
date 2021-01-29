import controller from './controller';
import template from './index.html';

export default {
  name: 'billingPaymentMethodAdd',
  controller,
  template,
  bindings: {
    addSteps: '<',
    currentUser: '<',
    defaultPaymentMethodIntegration: '<',
    isLastStep: '<',
    isStepVisible: '<',
    getBackButtonHref: '<',
    model: '<',
    onPaymentMethodAdded: '<',
    paymentMethods: '<',
  },
};
