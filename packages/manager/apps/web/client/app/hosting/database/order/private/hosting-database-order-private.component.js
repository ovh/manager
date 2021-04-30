import controller from './hosting-database-order-private.controller';
import template from './hosting-database-order-private.html';

export default {
  controller,
  template,
  bindings: {
    goBack: '<',
    autoPayWithPreferredPaymentMethod: '<',
    datacenter: '<?',
    user: '<',
    serviceName: '<?',
  },
};
