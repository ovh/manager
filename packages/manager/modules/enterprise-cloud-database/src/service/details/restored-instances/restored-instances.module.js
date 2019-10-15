import angular from 'angular';

import enterpriseCloudDatabaseServiceDetailsRestoredInstancesComponent from './restored-instances.component';
import routing from './restored-instances.routing';
import deleteBackup from './delete';

const moduleName = 'enterpriseCloudDatabaseServiceDetailsRestoredInstances';

angular
  .module(moduleName, [deleteBackup])
  .config(routing)
  .component('enterpriseCloudDatabaseServiceDetailsRestoredInstancesComponent', enterpriseCloudDatabaseServiceDetailsRestoredInstancesComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
