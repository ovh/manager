import angular from 'angular';

import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';

import component from './shares.component';
import routing from './shares.routing';

const moduleName = 'ovhManagerNetappShare';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('netappShare', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
