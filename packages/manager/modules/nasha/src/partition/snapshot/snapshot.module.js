import angular from 'angular';

import routing from './snapshot.routing';
import snapshotComponent from './snapshot.component';

const moduleName = 'nashaPartitionSnapshotModule';

angular
  .module(moduleName, [])
  .config(routing)
  .component('nashaPartitionSnapshotComponent', snapshotComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
