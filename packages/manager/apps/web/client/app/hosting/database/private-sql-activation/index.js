import privateSqlActivation from './private-sql-activation.component';
import privateSqlActivationRouting from './private-sql-activation.routing';
import service from './private-sql-activation.service';

const moduleName = 'ovhManagerHostingDatabasePrivateSqlActivation';

angular
  .module(moduleName, [])
  .component('hostingDatabasePrivateSqlActivation', privateSqlActivation)
  .config(privateSqlActivationRouting)
  .service('PrivateSql', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
