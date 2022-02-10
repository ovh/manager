import angular from 'angular';
import '@ovh-ux/ui-kit';

import component from './connector-input.component';

const moduleName = 'ovhManagerPciStoragesDatabasesConnectorInput';

angular
  .module(moduleName, ['oui'])
  .component('connectorInput', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
