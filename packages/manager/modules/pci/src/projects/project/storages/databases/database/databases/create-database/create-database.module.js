import angular from 'angular';

import component from './create-database.component';
import routing from './create-database.routing';

const moduleName = 'ovhManagerPciStoragesDatabasesDatabasesCreateDatabase';

angular
  .module(moduleName, [])
  .config(routing)
  .component(
    'ovhManagerPciStoragesDatabaseDatabasesCreateDatabaseComponent',
    component,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
