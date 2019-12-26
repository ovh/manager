import angular from 'angular';
import '@uirouter/angularjs';

import routing from './vps-restore.routing';
import component from './vps-restore.component';

const moduleName = 'vpsVeeamRestoreModule';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('vpsVeeamRestore', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
