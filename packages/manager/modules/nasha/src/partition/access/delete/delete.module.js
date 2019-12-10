import angular from 'angular';

import routing from './delete.routing';
import deleteComponent from './delete.component';

const moduleName = 'nashaPartitionAccessDeleteModule';

angular
  .module(moduleName, [])
  .config(routing)
  .component('nashaPartitionAccessDeleteComponent', deleteComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
