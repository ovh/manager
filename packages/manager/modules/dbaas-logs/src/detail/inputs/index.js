import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import 'ovh-ui-angular';

import 'ovh-ui-kit/dist/oui.css';

import add from './add';
import component from './logs-inputs.component';
import inputConsole from './console';
import home from './home';
import routing from './logs-inputs.routing';
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
