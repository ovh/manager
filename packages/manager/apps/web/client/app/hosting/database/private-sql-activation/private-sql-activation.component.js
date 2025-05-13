import controller from './private-sql-activation.controller';
import template from './private-sql-activation.html';

export default {
  controller,
  template,
  bindings: {
    goToHosting: '<',
    me: '<',
    dbCategories: '<',
    privateSqlCatalog: '<',
    hosting: '<',
    onError: '<',
    onSuccess: '<',
  },
};
