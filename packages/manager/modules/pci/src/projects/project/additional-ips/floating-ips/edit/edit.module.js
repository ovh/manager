import angular from 'angular';
import 'angular-translate';
import '@uirouter/angularjs';

import component from './edit.component';

import routing from './edit.routing';

const moduleName = 'ovhManagerPciProjectAdditionalIpsFloatingIpsEdit';

angular
  .module(moduleName, ['ui.router', 'pascalprecht.translate'])
  .component('pciAdditionalIpsFloatingIpEdit', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
