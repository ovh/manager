import controller from './hosting-sql-database-order.controller';
import template from './hosting-sql-database-order.html';

export default {
  controller,
  template,
  bindings: {
    goBack: '<',
    user: '<',
  },
};
