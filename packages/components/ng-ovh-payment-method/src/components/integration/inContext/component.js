import template from './index.html';

export default {
  name: 'ovhPaymentMethodIntegrationInContext',
  template,
  require: {
    integrationCtrl: '^ovhPaymentMethodIntegration',
  },
};
