import angular from 'angular';

import '@uirouter/angularjs';

import partitionEditDescriptionComponentModule from '../../../components/partition/edit-description';

import routing from './edit-description.routing';

const moduleName = 'ovhManagerNashaDashboardPartitionEditDescription';

angular
  .module(moduleName, ['ui.router', partitionEditDescriptionComponentModule])
  .config(routing);

export default moduleName;
