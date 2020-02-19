import angular from 'angular';
import '@uirouter/angularjs';

import routing from './edit-backup-storage.routing';
import editComponent from './edit-backup-storage.component';

const moduleName = 'vpsBackupStorageEditModule';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('vpsBackupStorageEdit', editComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
