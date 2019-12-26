import angular from 'angular';
import '@uirouter/angularjs';

import routing from './snapshot-delete.routing';
import component from './snapshot-delete.component';

const moduleName = 'vpsDashboardSnapshotDeleteModule';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('vpsDashboardSnapshotDelete', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
