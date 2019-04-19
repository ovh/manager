import template from './availableTypes.html';
import controller from './availableTypes.controller';

export default {
  template,
  controller,
  bindings: {
    defaultPaymentType: '@',
    paymentTypesOrder: '<',
    paymentTypesPerLine: '<',
    onLoaded: '&',
    onLoadError: '&',
    onSelectedPaymentTypeChange: '&',
  },
};
