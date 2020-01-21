import privateSqlActivation from './private-sql-activation.component';
import privateSqlActivationRouting from './private-sql-activation.routing';

const moduleName = 'ovhManagerHostingDatabasePrivateSqlActivation';

angular
  .module(moduleName, [])
  .component('hostingDatabasePrivateSqlActivation', privateSqlActivation)
  .config(privateSqlActivationRouting)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
