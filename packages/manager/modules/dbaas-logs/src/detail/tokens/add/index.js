import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';
import 'ovh-api-services';

import component from './logs-tokens-add.component';
import routing from './logs-tokens-add.routing';
import logsTokenAddCtrl from './logs-token-add.controller';

const moduleName = 'ovhManagerDbaasLogsDetailTokensAdd';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .controller('LogsTokenAddCtrl', logsTokenAddCtrl)
  .component('dbaasLogsDetailTokensAdd', component);

export default moduleName;
