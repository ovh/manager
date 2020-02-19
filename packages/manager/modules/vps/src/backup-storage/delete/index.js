import angular from 'angular';
import '@uirouter/angularjs';

import routing from './delete-backup-storage.routing';
import deleteComponent from './delete-backup-storage.component';

const moduleName = 'vpsBackupStoragedeleteModule';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('vpsBackupStorageDelete', deleteComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
