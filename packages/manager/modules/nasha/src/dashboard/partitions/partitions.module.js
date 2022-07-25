import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';

import component from './partitions.component';
import routing from './partitions.routing';

import metricsComponentModule from '../../components/metrics';
import taskTrackerComponentModule from '../../components/task-tracker';
import createModule from './create';
import deleteModule from './delete';
import editSizeModule from './edit-size';
import zfsOptionsModule from './zfs-options';

const moduleName = 'ovhManagerNashaDashboardPartitions';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'ui.router',
    metricsComponentModule,
    taskTrackerComponentModule,
    createModule,
    deleteModule,
    editSizeModule,
    zfsOptionsModule,
  ])
  .component('nashaDashboardPartitions', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
