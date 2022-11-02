import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './create-private-network-warning.component';
import routing from './create-private-network-warning.routing';

const moduleName = 'ovhManagerPciInstancesCreatePrivateNetworkWarning';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('pciInstancesInstancesCreatePrivateNetworkWarning', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
