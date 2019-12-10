import angular from 'angular';
import '@uirouter/angularjs';

import zfsOptionsModule from './zfs-options.module';

const moduleName = 'nashaPartitionZfsOptions';

angular.module(moduleName, [
  'ui.router',
  zfsOptionsModule,
]);

export default moduleName;
