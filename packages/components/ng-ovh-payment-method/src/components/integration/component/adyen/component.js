import controller from './controller';
import template from './index.html';

export default {
  bindings: {
    callback: '<?',
    cancelHref: '<?',
    initialParams: '<?',
  },
  controller,
  template,
  require: {
    componentCtrl: '^ovhPaymentMethodIntegrationComponent',
  },
  transclude: true,
};
