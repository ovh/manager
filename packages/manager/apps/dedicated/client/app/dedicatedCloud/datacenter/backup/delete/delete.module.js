import angular from 'angular';

import component from './delete.component';
import routing from './delete.routing';

const moduleName = 'ovhManagerDedicatedCloudBackupDeleteModule';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('ovhManagerDedicatedCloudBackupDelete', component);

export default moduleName;
