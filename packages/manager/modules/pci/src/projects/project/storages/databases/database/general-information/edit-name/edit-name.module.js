import angular from 'angular';

import component from './edit-name.component';
import routing from './edit-name.routing';

const moduleName = 'ovhManagerPciStoragesDatabaseGeneralInformationName';

angular
  .module(moduleName, [])
  .config(routing)
  .component('ovhManagerPciProjectDatabaseGeneralInformationName', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
