import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-tail-logs';
import '@uirouter/angularjs';
import '@ovh-ux/ng-ovh-utils';

import routing from './logs.routing';
import service from './private-database-logs.service';

const moduleName = 'ovhManagerPrivateDatabaseLogs';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ngTailLogs',
    'ui.router',
    'ngOvhUtils',
  ])
  .config(routing)
  .service('PrivateDatabaseLogsService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
