import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import 'ovh-ui-angular';

import 'ovh-ui-kit/dist/oui.css';

import add from './add';
import component from './streams-alerts.component';
import home from './home';
import routing from './streams-alerts.routing';
import service from './streams-alerts.service';

const moduleName = 'ovhManagerDbaasLogsDetailStreamsAlerts';

angular
  .module(moduleName, [
    'angularMoment',
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
