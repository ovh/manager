import angular from 'angular';

import component from './delete-database.component';
import routing from './delete-database.routing';

const moduleName = 'ovhManagerPciStoragesDatabaseDatabasesDeleteDatabase';

angular
  .module(moduleName, [])
  .config(routing)
  .component(
    'ovhManagerPciStoragesDatabaseDatabasesDeleteDatabaseComponent',
    component,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
