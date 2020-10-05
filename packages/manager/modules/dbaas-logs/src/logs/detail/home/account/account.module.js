import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'angular-ui-bootstrap';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import component from './account.component';
import controller from './logs-home-account.controller';
import routing from './account.routing';

const moduleName = 'ovhManagerDbaasLogsDetailHomeAccount';

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
  .controller('LogsHomeAccountCtrl', controller)
  .component('dbaasLogsDetailHomeAccount', component);

export default moduleName;
