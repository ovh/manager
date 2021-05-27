import controller from './controller';
import template from './index.html';

export default {
  bindings: {
    goToSplitPaymentAction: '&',
    splitPaymentInformationHref: '@',
    tagInfo: '<',
    tagStatusEnum: '<',
  },
  controller,
  name: 'ovhManagerBillingSplitPayment',
  template,
};
