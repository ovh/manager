import angular from 'angular';
import '@uirouter/angularjs';

import routing from './add-backup-storage.routing';
import addComponent from './add-backup-storage.component';

const moduleName = 'vpsBackupStorageAddModule';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('vpsBackupStorageAdd', addComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
