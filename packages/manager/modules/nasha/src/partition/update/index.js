import angular from 'angular';
import '@uirouter/angularjs';

import updateModule from './update.module';

const moduleName = 'nashaPartitionUpdate';

angular.module(moduleName, [
  'ui.router',
  updateModule,
]);

export default moduleName;
