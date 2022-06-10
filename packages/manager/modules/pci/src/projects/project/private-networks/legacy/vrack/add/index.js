import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ui-router-layout';
import '@ovh-ux/ng-ovh-swimming-poll';

import component from './add.component';
import routing from './add.routing';
import service from './add.service';

const moduleName = 'ovhManagerPciPrivateNetworksVrackAdd';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
    'ngOvhSwimmingPoll',
    'ngUiRouterLayout',
  ])
  .config(routing)
  .component('pciProjectPrivateNetworksVrackCreate', component)
  .service('PciPrivateNetworksVrackAdd', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
