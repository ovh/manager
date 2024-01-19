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
    modelName: '@?',
    automaticSelect: '<?',
    automaticDefault: '<?',
    paymentMethodTypesOrder: '<?',
    paymentMethodTypesPerLine: '<?',
    registeredPaymentMethods: '<?',
    unregisteredPaymentMethods: '<?',
    excludedPaymentMethods: '<?',
    showSetAsDefaultChoice: '<?',
    forceSetAsDefaultChoice: '<?',
    onInitializationError: '&?',
    onInitialized: '&?',
    showDefaultExplanationTexts: '<?',
    defaultExplanationTextsOptions: '<?',
    required: '<?',
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
