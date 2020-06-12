import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';

import component from './vrack.component';
import routing from './vrack.routing';

import add from './add';

const moduleName = 'ovhManagerPciPrivateNetworksVrack';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
    'ovh-api-services',
    'ui.router',
    add,
  ])
  .config(routing)
  .component('pciProjectPrivateNetworksVrack', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
