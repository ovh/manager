import angular from 'angular';
import 'angular-translate';
import '@uirouter/angularjs';
import '@ovh-ux/manager-core';

import routing from './order.routing';
import component from './order.component';

const moduleName = 'ovhManagerPciProjectFailoverIpsOrder';

angular
  .module(moduleName, ['ui.router', 'pascalprecht.translate', 'ovhManagerCore'])
  .component('pciProjectFailoverIpsOrder', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
