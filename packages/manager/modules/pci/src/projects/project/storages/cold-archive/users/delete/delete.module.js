import angular from 'angular';

import component from './delete.component';
import routing from './delete.routing';

const moduleName = 'ovhManagerPciStoragesColdArchiveUsersDelete';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('pciProjectStoragesColdArchiveUsersDeleteComponent', component);

export default moduleName;
