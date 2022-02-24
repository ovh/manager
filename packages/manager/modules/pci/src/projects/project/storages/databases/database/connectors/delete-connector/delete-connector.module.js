import angular from 'angular';

import component from './delete-connector.component';
import routing from './delete-connector.routing';

const moduleName = 'ovhManagerPciStoragesDatabaseDeleteConnector';

angular
  .module(moduleName, [])
  .config(routing)
  .component('ovhManagerPciStoragesDatabaseDeleteConnectorComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
