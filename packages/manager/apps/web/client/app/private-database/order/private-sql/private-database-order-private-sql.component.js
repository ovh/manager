import controller from './private-database-order-private-sql.controller';
import template from './private-database-order-private-sql.html';

export default {
  controller,
  template,
  bindings: {
    autoPayWithPreferredPaymentMethod: '<',
    user: '<',
  },
};
