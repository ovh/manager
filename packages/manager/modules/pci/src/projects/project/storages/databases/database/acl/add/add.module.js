import angular from 'angular';

import component from './add.component';
import routing from './add.routing';

const moduleName = 'ovhManagerPciStoragesDatabasesAclAdd';

angular
  .module(moduleName, [])
  .config(routing)
  .component('ovhManagerPciStoragesDatabaseAclAddComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
