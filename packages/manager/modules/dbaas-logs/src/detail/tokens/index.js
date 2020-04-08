import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';
import 'ovh-api-services';

import component from './logs-tokens.component';
import routing from './logs-tokens.routing';
import service from './logs-tokens.service';
import logsTokensAdd from './add';

const moduleName = 'ovhManagerDbaasLogsDetailTokens';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
    logsTokensAdd,
  ])
  .config(routing)
  .service('LogsTokensService', service)
  .component('dbaasLogsDetailTokens', component);

export default moduleName;
