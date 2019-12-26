import angular from 'angular';
import '@uirouter/angularjs';

import maintenanceWindowComponent from './maintenance-window.component';

const moduleName = 'enterpriseCloudDatabaseServiceMaintenanceWindowComponent';

angular
  .module(moduleName, ['ui.router'])
  .component(
    'enterpriseCloudDatabaseServiceMaintenanceWindowComponent',
    maintenanceWindowComponent,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
