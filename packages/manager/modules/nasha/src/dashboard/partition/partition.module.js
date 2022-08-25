import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';

import component from './partition.component';
import routing from './partition.routing';

import spaceMeterComponentModule from '../../components/space-meter';
import taskTrackerComponentModule from '../../components/task-tracker';
import editDescriptionModule from './edit-description';
import editSizeModule from './edit-size';
import snapshotsModule from './snapshots';
import accessesModule from './accesses';

const moduleName = 'ovhManagerNashaPartition';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'ui.router',
    spaceMeterComponentModule,
    taskTrackerComponentModule,
    editDescriptionModule,
    editSizeModule,
    snapshotsModule,
    accessesModule,
  ])
  .component('nashaDashboardPartition', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
