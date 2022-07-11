import angular from 'angular';

import '@uirouter/angularjs';

import partitionAccessDeleteComponentModule from '../../../../components/partition/access/delete';

import routing from './delete.routing';

const moduleName = 'ovhManagerNashaDashboardPartitionAccessesDelete';

angular
  .module(moduleName, ['ui.router', partitionAccessDeleteComponentModule])
  .config(routing);

export default moduleName;
