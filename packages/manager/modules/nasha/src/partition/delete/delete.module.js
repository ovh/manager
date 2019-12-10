import angular from 'angular';

import routing from './delete.routing';
import deleteComponent from './delete.component';

const moduleName = 'nashaPartitionDeleteModule';

angular
  .module(moduleName, [])
  .config(routing)
  .component('nashaPartitionDeleteComponent', deleteComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
