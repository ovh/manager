import angular from 'angular';

import component from './delete-pattern.component';
import routing from './delete-pattern.routing';

const moduleName = 'ovhManagerPciStoragesDatabaseIndexesDeletePattern';

angular
  .module(moduleName, [])
  .config(routing)
  .component(
    'ovhManagerPciStoragesDatabaseIndexesDeletePatternComponent',
    component,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
