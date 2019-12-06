import angular from 'angular';

import routing from './zfs-options.routing';
import zfsOptionsComponent from './zfs-options.component';

const moduleName = 'nashaPartitionZfsOptionsModule';

angular
  .module(moduleName, [])
  .config(routing)
  .component('nashaPartitionZfsOptionsComponent', zfsOptionsComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
