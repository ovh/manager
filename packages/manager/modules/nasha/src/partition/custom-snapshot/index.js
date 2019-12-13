import angular from 'angular';
import '@uirouter/angularjs';

import customSnapshotModule from './custom-snapshot.module';

const moduleName = 'nashaPartitionCustomSnapshot';

angular.module(moduleName, [
  'ui.router',
  customSnapshotModule,
]);

export default moduleName;
