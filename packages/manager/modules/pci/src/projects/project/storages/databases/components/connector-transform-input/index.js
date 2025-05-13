import angular from 'angular';
import '@ovh-ux/ui-kit';

import component from './connector-transform-input.component';

const moduleName = 'ovhManagerPciStoragesDatabasesConnectorTransformInput';

angular
  .module(moduleName, ['oui'])
  .component('connectorTransformInput', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
