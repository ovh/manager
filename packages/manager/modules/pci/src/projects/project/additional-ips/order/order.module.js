import angular from 'angular';
import 'angular-translate';
import '@uirouter/angularjs';
import '@ovh-ux/manager-core';

import gatewayServiceModule from '../../gateways/service';

import routing from './order.routing';
import component from './order.component';

const moduleName = 'ovhManagerPciProjectAdditionalIpsOrder';

angular
  .module(moduleName, [
    'ui.router',
    'pascalprecht.translate',
    'ovhManagerCore',
    gatewayServiceModule,
  ])
  .component('pciProjectAdditionalIpsOrder', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
