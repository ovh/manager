import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'angular-ui-bootstrap';
import 'ovh-api-services';
import 'ovh-ui-angular';

import component from './logs-home-capped.component';
import logsHomeCappedCtrl from './logs-home-capped.controller';
import routing from './logs-home-capped.routing';

const moduleName = 'ovhManagerDbaasLogsDetailHomeCapped';

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
  .controller('LogsHomeCappedCtrl', logsHomeCappedCtrl)
  .component('dbaasLogsDetailHomeCapped', component);

export default moduleName;
