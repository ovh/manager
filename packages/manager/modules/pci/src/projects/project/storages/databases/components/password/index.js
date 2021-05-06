import angular from 'angular';
import '@ovh-ux/ui-kit';

import component from './password.component';

const moduleName = 'ovhManagerPciStoragesDatabasesPassword';

angular
  .module(moduleName, ['oui'])
  .component('databasePassword', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
