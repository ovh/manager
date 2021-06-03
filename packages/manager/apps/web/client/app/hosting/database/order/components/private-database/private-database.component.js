import controller from './private-database.controller';
import template from './private-database.html';

export default {
  controller,
  template,
  bindings: {
    user: '<',
    serviceName: '<',
    autoPayWithPreferredPaymentMethod: '<?',
    datacenter: '<?',
    onSuccess: '&?',
    onError: '&?',
    onCancel: '&?',
  },
};
