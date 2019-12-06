import angular from 'angular';

import routing from './custom-snapshot.routing';
import customSnapshotComponent from './custom-snapshot.component';

const moduleName = 'nashaPartitionCustomSnapshotModule';

angular
  .module(moduleName, [])
  .config(routing)
  .component('nashaPartitionCustomSnapshotComponent', customSnapshotComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
