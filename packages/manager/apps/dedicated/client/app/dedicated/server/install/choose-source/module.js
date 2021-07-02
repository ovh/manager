import angular from 'angular';
import '@uirouter/angularjs';

import {
  serverOsInstallFrom
 } from '@ovh-ux/manager-bm-server-components';

import routing from './routing';
import component from './component';

const moduleName = 'ovhManagerDedicatedServerInstallChooseSource';

angular
  .module(moduleName, ['ui.router', serverOsInstallFrom])
  .config(routing)
  .component('dedicatedServerInstallChooseSource', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
