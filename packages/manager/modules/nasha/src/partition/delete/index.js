import angular from 'angular';
import '@uirouter/angularjs';

import deleteModule from './delete.module';

const moduleName = 'nashaPartitionDelete';

angular.module(moduleName, [
  'ui.router',
  deleteModule,
]);

export default moduleName;
