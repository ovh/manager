import angular from 'angular';

import component from './delete.component';
import routing from './delete.routing';

const moduleName = 'ovhManagerPciStoragesDatabaseUserAclDelete';

angular
  .module(moduleName, [])
  .config(routing)
  .component('ovhManagerPciStoragesDatabaseUserAclDeleteComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
