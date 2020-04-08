import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import ngTailLogs from '@ovh-ux/ng-tail-logs';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import 'ovh-ui-angular';

import component from './logs-inputs-console.component';
import routing from './logs-inputs-console.routing';

const moduleName = 'ovhManagerDbaasLogsDetailInputsConsole';

angular
  .module(moduleName, [
    'angularMoment',
    'ngOvhCloudUniverseComponents',
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
    ngTailLogs,
  ])
  .config(routing)
  .component('dbaasLogsDetailInputsConsole', component);

export default moduleName;
