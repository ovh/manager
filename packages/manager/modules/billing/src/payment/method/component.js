import controller from './controller';
import template from './index.html';

export default {
  name: 'billingPaymentMethod',
  controller,
  template,
  bindings: {
    getActionHref: '<',
    goToSplitPaymentAction: '<',
    paymentMethods: '<',
    currentUser: '<',
    isSplitPaymentAvailable: '<',
    splitPayment: '<',
    splitPaymentInformationHref: '@?',
    tagStatusEnum: '<',
  },
};
