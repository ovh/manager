import angular from 'angular';
import '@uirouter/angularjs';

import routing from './snapshot-restore.routing';
import component from './snapshot-restore.component';

const moduleName = 'vpsDashboardSnapshotRestoreModule';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('vpsDashboardSnapshotRestore', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
