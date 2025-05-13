import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import component from './crud.component';
import crudController from './logs-dashboards-crud.controller';
import routing from './crud.routing';

const moduleName = 'ovhManagerDbaasLogsDetailDashboardsCrud';

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
  .controller('LogsDashboardsCrudCtrl', crudController)
  .component('dbaasLogsDetailDashboardsCrud', component);

export default moduleName;
