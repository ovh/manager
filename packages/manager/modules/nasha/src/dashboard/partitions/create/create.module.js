import angular from 'angular';

import '@uirouter/angularjs';

import createComponentModule from '../../../components/partition/create';

import routing from './create.routing';

const moduleName = 'ovhManagerNashaDashboardPartitionsCreate';

angular
  .module(moduleName, ['ui.router', createComponentModule])
  .config(routing);

export default moduleName;
