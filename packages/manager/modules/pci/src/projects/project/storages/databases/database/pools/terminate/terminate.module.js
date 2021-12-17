import angular from 'angular';

import component from './terminate.component';
import routing from './terminate.routing';

const moduleName = 'ovhManagerPciStoragesDatabasePoolsTerminate';

angular
  .module(moduleName, [])
  .config(routing)
  .component('ovhManagerPciStoragesDatabasePoolsAddEditComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
