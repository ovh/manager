import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';
import '@ovh-ux/ng-ovh-swimming-poll';

import component from './add.component';
import routing from './add.routing';
import service from './add.service';

import gatewayServiceModule from '../../gateways/service';

const moduleName = 'ovhManagerPciPrivateNetworksAdd';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ngOvhSwimmingPoll',
    'oui',
    'ovh-api-services',
    'ui.router',
    gatewayServiceModule,
  ])
  .config(routing)
  .component('pciProjectPrivateNetworksAdd', component)
  .service('PciPrivateNetworksAdd', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
