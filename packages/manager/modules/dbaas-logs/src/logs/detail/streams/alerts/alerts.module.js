import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import add from './add/add.module';
import component from './alerts.component';
import home from './home/home.module';
import routing from './alerts.routing';
import service from './streams-alerts.service';

const moduleName = 'ovhManagerDbaasLogsDetailStreamsAlerts';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
    add,
    home,
  ])
  .config(routing)
  .service('LogsStreamsAlertsService', service)
  .component('dbaasLogsDetailStreamsAlerts', component);

export default moduleName;
