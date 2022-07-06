import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';

import component from './partition.component';
import routing from './partition.routing';

import partitionEditNameComponentModule from '../../components/partition/edit-name';
import spaceMeterComponentModule from '../../components/space-meter';
import editDescriptionModule from './edit-description';
import editNameModule from './edit-name';
import editSizeModule from './edit-size';
import snapshotsModule from './snapshots';

const moduleName = 'ovhManagerNashaPartition';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'ui.router',
    partitionEditNameComponentModule,
    spaceMeterComponentModule,
    editDescriptionModule,
    editNameModule,
    editSizeModule,
    snapshotsModule,
  ])
  .component('nashaDashboardPartition', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
