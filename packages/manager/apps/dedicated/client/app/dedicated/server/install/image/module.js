import angular from 'angular';
import '@uirouter/angularjs';

import {
  serverOsInstallImage
 } from '@ovh-ux/manager-bm-server-components';

import routing from './routing';
import component from './component';

const moduleName = 'ovhManagerDedicatedServerInstallImage';

angular
  .module(moduleName, ['ui.router', serverOsInstallImage])
  .config(routing)
  .component('dedicatedServerInstallImage', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
