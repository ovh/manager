import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ui-kit';

import routing from './password-backup-storage.routing';
import passwordComponent from './password-backup-storage.component';

const moduleName = 'vpsBackupStoragePasswordModule';

angular
  .module(moduleName, ['ui.router', 'oui'])
  .config(routing)
  .component('vpsBackupStoragePassword', passwordComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
