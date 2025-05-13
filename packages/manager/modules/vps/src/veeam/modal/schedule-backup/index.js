import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';

import routing from './vps-schedule-backup.routing';
import component from './vps-schedule-backup.component';

const moduleName = 'vpsVeeamScheduleBackupModule';

angular
  .module(moduleName, ['pascalprecht.translate', 'ui.router'])
  .config(routing)
  .component('vpsVeeamScheduleBackup', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
