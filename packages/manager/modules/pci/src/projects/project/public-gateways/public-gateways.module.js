import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/manager-core';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import 'ovh-api-services';

import onboarding from './onboarding';
import component from './public-gateways.component';
import routing from './public-gateways.routing';
import service from './public-gateways.service';

const moduleName = 'ovhManagerPciPublicGateways';
angular
  .module(moduleName, [
    'ovhManagerCore',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
    onboarding,
  ])
  .config(routing)
  .component('pciProjectPublicGateways', component)
  .service('PciPublicGatewaysService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
