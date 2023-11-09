import controller from './controller';
import template from './index.html';

export default {
  name: 'ovhPaymentMethodRegister',
  controller,
  template,
  bindings: {
    defaultPaymentMethodType: '@?',
    defaultPaymentMethodIntegration: '@?',
    model: '<',
    automaticDefault: '<?',
    paymentMethodTypesOrder: '<?',
    paymentMethodTypesPerLine: '<?',
    registeredPaymentMethods: '<?',
    showSetAsDefaultChoice: '<?',
    forceSetAsDefaultChoice: '<?',
    onInitializationError: '&?',
    onInitialized: '&?',
    showDefaultExplanationTexts: '<?',
  },
  transclude: {
    introductionText: '?ovhPaymentMethodRegisterIntroductionText',
    explanationText: '?ovhPaymentMethodRegisterExplanationText',
    creditCardExplanationText:
      '?ovhPaymentMethodRegisterCreditCardExplanationText',
    sepaExplanationText: '?ovhPaymentMethodRegisterSepaExplanationText',
    paypalExplanationText: '?ovhPaymentMethodRegisterPaypalExplanationText',
    rupayExplanationText: '?ovhPaymentMethodRegisterRupayExplanationText',
  },
};
