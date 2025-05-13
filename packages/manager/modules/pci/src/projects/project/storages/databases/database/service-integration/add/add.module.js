import angular from 'angular';

import component from './add.component';
import routing from './add.routing';

const moduleName = 'ovhManagerPciStoragesDatabasesServiceIntegrationAdd';

angular
  .module(moduleName, [])
  .config(routing)
  .component(
    'ovhManagerPciStoragesDatabaseServiceIntegrationAddComponent',
    component,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
