import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import add from './add/add.module';
import component from './inputs.component';
import inputConsole from './console/console.module';
import home from './home/home.module';
import routing from './inputs.routing';
import service from './logs-inputs.service';

const moduleName = 'ovhManagerDbaasLogsDetailInputs';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
    add,
    inputConsole,
    home,
  ])
  .config(routing)
  .service('LogsInputsService', service)
  .component('dbaasLogsDetailInputs', component);

export default moduleName;
