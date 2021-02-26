import ovhManagerOrder from '@ovh-ux/manager-order';

import privateSqlActivation from './private-sql-activation.component';
import privateSqlActivationRouting from './private-sql-activation.routing';

const moduleName = 'ovhManagerHostingDatabasePrivateSqlActivation';

angular
  .module(moduleName, [ovhManagerOrder])
  .component('hostingDatabasePrivateSqlActivation', privateSqlActivation)
  .config(privateSqlActivationRouting)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
