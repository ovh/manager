import angular from 'angular';

import component from './create-pattern.component';
import routing from './create-pattern.routing';

const moduleName = 'ovhManagerPciStoragesDatabasesIndexesCreatePattern';

angular
  .module(moduleName, [])
  .config(routing)
  .component(
    'ovhManagerPciStoragesDatabaseIndexesCreatePatternComponent',
    component,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
