import angular from 'angular';
import 'angular-translate';
import '@uirouter/angularjs';

import edit from './edit';
import terminate from './terminate';

import routing from './floating-ips.routing';
import component from './floating-ips.component';

const moduleName = 'ovhManagerPciProjectAdditionalIpsFloatingIps';

angular
  .module(moduleName, ['ui.router', 'pascalprecht.translate', edit, terminate])
  .config(routing)
  .component('pciProjectAdditionalIpsFloatingIps', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
