import template from './availableTypes.html';
import controller from './availableTypes.controller';

export default {
  name: 'ovhPaymentMethodAvailableTypes',
  template,
  controller,
  bindings: {
    defaultPaymentType: '@',
    paymentTypesOrder: '<',
    paymentTypesPerLine: '<',
    selectedPaymentType: '=',
    onLoaded: '&',
    onLoadError: '&',
    onSelectedPaymentTypeChange: '&',
  },
};
