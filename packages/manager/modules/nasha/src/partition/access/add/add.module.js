import angular from 'angular';

import routing from './add.routing';
import addComponent from './add.component';

const moduleName = 'nashaPartitionAccessAddModule';

angular
  .module(moduleName, [])
  .config(routing)
  .component('nashaPartitionAccessAddComponent', addComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
