import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';

import component from './header.component';

const moduleName = 'ovhManagerDbaasLogsHeaderDashboard';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('dbaasLogsDashboardHeader', component);

export default moduleName;
