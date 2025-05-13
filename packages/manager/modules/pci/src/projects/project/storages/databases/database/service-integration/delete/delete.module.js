import angular from 'angular';

import component from './delete.component';
import routing from './delete.routing';

const moduleName = 'ovhManagerPciStoragesDatabaseServiceIntegrationDelete';

angular
  .module(moduleName, [])
  .config(routing)
  .component(
    'ovhManagerPciStoragesDatabaseServiceIntegrationDeleteComponent',
    component,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
