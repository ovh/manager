import controller from './controller';
import template from './index.html';

export default {
  name: 'ovhPaymentMethodIntegrationRedirect',
  controller,
  template,
  require: {
    integrationCtrl: '^ovhPaymentMethodIntegration',
  },
};
