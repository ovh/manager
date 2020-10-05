import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import component from './dashboards.component';
import crud from './crud/crud.module';
import routing from './dashboards.routing';
import service from './logs-dashboards.service';

const moduleName = 'ovhManagerDbaasLogsDetailDashboards';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
    crud,
  ])
  .config(routing)
  .service('LogsDashboardsService', service)
  .component('dbaasLogsDetailDashboards', component);

export default moduleName;
