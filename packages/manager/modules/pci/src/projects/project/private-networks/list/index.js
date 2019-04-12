import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/manager-core';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import 'ovh-ui-angular';
import 'ovh-api-services';

import component from './list.component';
import routing from './list.routing';

const moduleName = 'ovhManagerPciPrivateNetworksList';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
    'ovh-api-services',
    'ui.router',
  ])
  .config(routing)
  .component('pciProjectPrivateNetworksList', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
