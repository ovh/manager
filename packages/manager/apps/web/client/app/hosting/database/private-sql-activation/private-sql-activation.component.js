import controller from './private-sql-activation.controller';
import template from './private-sql-activation.html';

export default {
  controller,
  template,
  bindings: {
    catalog: '<',
    goToHosting: '<',
    me: '<',
    hosting: '<',
    privateSqlOptions: '<',
    versions: '<',
    datacenter: '<?',
    onError: '<',
    onSuccess: '<',
  },
};
