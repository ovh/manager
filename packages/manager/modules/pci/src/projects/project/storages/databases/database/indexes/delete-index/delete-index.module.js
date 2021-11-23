import angular from 'angular';

import component from './delete-index.component';
import routing from './delete-index.routing';

const moduleName = 'ovhManagerPciStoragesDatabaseIndexesDeleteIndex';

angular
  .module(moduleName, [])
  .config(routing)
  .component(
    'ovhManagerPciStoragesDatabaseIndexesDeleteIndexComponent',
    component,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
