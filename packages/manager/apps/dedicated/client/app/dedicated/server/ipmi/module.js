import angular from 'angular';
import '@uirouter/angularjs';

import {
  serverIpmi
 } from '@ovh-ux/manager-bm-server-components';

import routing from './routing';
import component from './component';

const moduleName = 'ovhManagerDedicatedServerIpmi';

angular
  .module(moduleName, ['ui.router', serverIpmi])
  .config(routing)
  .component('dedicatedServerIpmi', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
