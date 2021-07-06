import angular from 'angular';
import '@uirouter/angularjs';

import {
  serverOrderKvm
 } from '@ovh-ux/manager-bm-server-components';

import routing from './routing';
import component from './component';

const moduleName = 'ovhManagerDedicatedServerKvmOrder';

angular
  .module(moduleName, ['ui.router', serverOrderKvm])
  .config(routing)
  .component('dedicatedServerKvmOrder', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
