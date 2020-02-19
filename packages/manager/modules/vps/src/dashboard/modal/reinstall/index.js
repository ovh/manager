import angular from 'angular';
import '@uirouter/angularjs';

import routing from './vps-reinstall.routing';
import component from './vps-reinstall.component';

import VpsReinstallService from './vps-reinstall.service';
import './vps-reinstall.less';

const moduleName = 'vpsDashboardReinstallModule';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('vpsDashboardReinstall', component)
  .service('VpsReinstallService', VpsReinstallService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
