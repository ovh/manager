import angular from 'angular';

import component from './delete.component';
import routing from './delete.routing';

const moduleName = 'ovhManagerPciStoragesObjectStorageUsersDelete';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('pciProjectStoragesObjectStorageUsersDeleteComponent', component);

export default moduleName;
