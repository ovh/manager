import angular from 'angular';

import '@uirouter/angularjs';

import deleteComponentModule from '../../../components/partition/delete';

import routing from './delete.routing';

const moduleName = 'ovhManagerNashaDashboardPartitionsDelete';

angular
  .module(moduleName, ['ui.router', deleteComponentModule])
  .config(routing);

export default moduleName;
