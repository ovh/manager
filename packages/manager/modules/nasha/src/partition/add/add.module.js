import angular from 'angular';

import routing from './add.routing';
import addComponent from './add.component';

const moduleName = 'nashaPartitionAddModule';

angular
  .module(moduleName, [])
  .config(routing)
  .component('nashaPartitionAddComponent', addComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
