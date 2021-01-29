import template from './index.html';

export default {
  template,
  require: {
    integrationCtrl: '^ovhPaymentMethodIntegration',
  },
  transclude: true,
};
