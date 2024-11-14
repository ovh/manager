import '@ovh-ux/manager-log-to-customer';
import routing from './private-database-logs.routing';
import service from './private-database-logs.service';
import component from './private-database-logs.component';
import dataStreams from './data-streams';

const moduleName = 'ovhManagerPrivateDatabaseLogs';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    'ui.router',
    'ovhManagerLogToCustomer',
    dataStreams,
  ])
  .config(routing)
  .component('privateDatabaseLogs', component)
  .service('logsService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
