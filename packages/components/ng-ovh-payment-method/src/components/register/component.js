import controller from './controller';
import template from './index.html';

export default {
  name: 'ovhPaymentMethodRegister',
  controller,
  template,
  bindings: {
    defaultPaymentMethodType: '@?',
    model: '<',
    paymentMethodTypesOrder: '<?',
    paymentMethodTypesPerLine: '<?',
    registeredPaymentMethods: '<?',
    showSetAsDefaultChoice: '<?',
    onInitializationError: '&?',
    onInitialized: '&?',
  },
  transclude: {
    introductionText: '?ovhPaymentMethodRegisterIntroductionText',
    explanationText: '?ovhPaymentMethodRegisterExplanationText',
  },
};
