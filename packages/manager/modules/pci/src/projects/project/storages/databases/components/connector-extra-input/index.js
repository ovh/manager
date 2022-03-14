import angular from 'angular';
import '@ovh-ux/ui-kit';

import component from './connector-extra-input.component';

const moduleName = 'ovhManagerPciStoragesDatabasesConnectorExtraInput';

angular
  .module(moduleName, ['oui'])
  .component('connectorExtraInput', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
