import angular from 'angular';
import '@ovh-ux/ui-kit';

import component from './connector-preview.component';

const moduleName = 'ovhManagerPciStoragesDatabasesConnectorPreview';

angular
  .module(moduleName, ['oui'])
  .component('connectorPreview', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
