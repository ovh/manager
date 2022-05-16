import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';

import component from './partitions.component';
import routing from './partitions.routing';

import metricsComponentModule from '../../components/metrics';
import tasksPollerComponentModule from '../../components/tasks-poller';
import createModule from './create';
import deleteModule from './delete';
import editSizeModule from './edit-size';
import zfsOptionsModule from './zfs-options';

import { INSTANCE_STATE_RESOLVE } from './partitions.constants';

const moduleName = 'ovhManagerNashaDashboardPartitions';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'ui.router',
    metricsComponentModule,
    tasksPollerComponentModule,
    createModule,
    deleteModule,
    editSizeModule,
    zfsOptionsModule,
  ])
  .component('nashaDashboardPartitions', component)
  .constant('PartitionsInstanceStateResolve', INSTANCE_STATE_RESOLVE)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
