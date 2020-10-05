import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-tail-logs';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import component from './console.component';
import routing from './console.routing';

const moduleName = 'ovhManagerDbaasLogsDetailInputsConsole';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
    'ngTailLogs',
  ])
  .config(routing)
  .component('dbaasLogsDetailInputsConsole', component);

export default moduleName;
