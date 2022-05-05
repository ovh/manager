import angular from 'angular';

import '@uirouter/angularjs';

import editSizeComponentModule from '../../../components/partition/edit-size';

import routing from './edit-size.routing';

const moduleName = 'ovhManagerNashaDashboardPartitionsEditSize';

angular
  .module(moduleName, ['ui.router', editSizeComponentModule])
  .config(routing);

export default moduleName;
