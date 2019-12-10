import angular from 'angular';

import routing from './update.routing';
import updateComponent from './update.component';

const moduleName = 'nashaPartitionUpdateModule';

angular
  .module(moduleName, [])
  .config(routing)
  .component('nashaPartitionUpdateComponent', updateComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
