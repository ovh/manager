import angular from 'angular';
import '@uirouter/angularjs';

import snapshotModule from './snapshot.module';

const moduleName = 'nashaPartitionSnapshot';

angular.module(moduleName, [
  'ui.router',
  snapshotModule,
]);

export default moduleName;
