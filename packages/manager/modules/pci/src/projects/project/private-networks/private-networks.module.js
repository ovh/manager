import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/manager-core';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import 'ovh-api-services';

import component from './private-networks.component';
import routing from './private-networks.routing';
import service from './private-networks.service';

import add from './add';
import vrack from './vrack';

import empty from './empty';

const moduleName = 'ovhManagerPciPrivateNetworks';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
    empty,
    add,
    vrack,
  ])
  .config(routing)
  .component('pciProjectPrivateNetworks', component)
  .service('PciPrivateNetworks', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
