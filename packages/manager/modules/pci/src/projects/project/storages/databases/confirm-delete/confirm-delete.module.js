import angular from 'angular';

import component from './confirm-delete.component';
import routing from './confirm-delete.routing';

const moduleName = 'ovhManagerPciStoragesDatabaseConfirmDelete';

angular
  .module(moduleName, [])
  .config(routing)
  .component('ovhManagerPciProjectDatabaseConfirmDelete', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
