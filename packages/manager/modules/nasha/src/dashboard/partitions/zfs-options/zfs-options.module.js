import angular from 'angular';

import '@uirouter/angularjs';

import zfsOptionsComponentModule from '../../../components/partition/zfs-options';

import routing from './zfs-options.routing';

const moduleName = 'ovhManagerNashaDashboardPartitionsZfsOptions';

angular
  .module(moduleName, ['ui.router', zfsOptionsComponentModule])
  .config(routing);

export default moduleName;
