import angular from 'angular';

import component from './edit-name.component';
import routing from './edit-name.routing';

const moduleName = 'ovhManagerPciStoragesDatabaseName';

angular
  .module(moduleName, [])
  .config(routing)
  .component('ovhManagerPciProjectDatabaseName', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
