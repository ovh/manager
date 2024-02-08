import controller from './private-sql-activation.controller';
import template from './private-sql-activation.html';

export default {
  controller,
  template,
  bindings: {
    catalog: '<',
    goToHosting: '<',
    me: '<',
    dbCategories: '<',
    privateSqlCatalog: '<',
    // privateSqlOptions: '<',
    hosting: '<',
    versions: '<',
    datacenter: '<?',
    onError: '<',
    onSuccess: '<',
  },
};
