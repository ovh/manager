import angular from 'angular';

import '@uirouter/angularjs';

import partitionSnapshotDeleteComponentModule from '../../../../components/partition/snapshot/delete';

import routing from './delete.routing';

const moduleName = 'ovhManagerNashaDashboardPartitionSnapshotsDelete';

angular
  .module(moduleName, ['ui.router', partitionSnapshotDeleteComponentModule])
  .config(routing);

export default moduleName;
