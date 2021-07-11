import angular from 'angular';
import '@uirouter/angularjs';

import {
  serverNetboot
 } from '@ovh-ux/manager-bm-server-components';

import routing from './routing';
import component from './component';

const moduleName = 'ovhManagerDedicatedServerNetboot';

angular
  .module(moduleName, ['ui.router', serverNetboot])
  .config(routing)
  .component('dedicatedServerNetboot', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
