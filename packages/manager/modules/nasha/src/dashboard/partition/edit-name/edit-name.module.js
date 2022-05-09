import angular from 'angular';

import '@uirouter/angularjs';

import partitionEditNameComponentModule from '../../../components/partition/edit-name';

import routing from './edit-name.routing';

const moduleName = 'ovhManagerNashaDashboardPartitionEditName';

angular
  .module(moduleName, ['ui.router', partitionEditNameComponentModule])
  .config(routing);

export default moduleName;
