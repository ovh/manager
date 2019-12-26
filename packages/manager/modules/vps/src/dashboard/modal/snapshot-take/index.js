import angular from 'angular';
import '@uirouter/angularjs';

import routing from './snapshot-take.routing';
import component from './snapshot-take.component';

const moduleName = 'vpsDashboardSnapshotTakeModule';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('vpsDashboardSnapshotTake', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
