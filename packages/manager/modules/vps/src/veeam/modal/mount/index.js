import angular from 'angular';
import '@uirouter/angularjs';

import routing from './vps-mount.routing';
import component from './vps-mount.component';

const moduleName = 'vpsVeeamMountModule';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('vpsVeeamMount', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
