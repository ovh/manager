import angular from 'angular';
import '@uirouter/angularjs';

import routing from './snapshot-download.routing';
import component from './snapshot-download.component';

const moduleName = 'snapshotDownloadModule';
angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('vpsSnapshotDownload', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
