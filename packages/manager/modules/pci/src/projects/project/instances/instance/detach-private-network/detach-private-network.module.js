import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';

import component from './detach-private-network.component';
import routing from './detach-private-network.routing';

const moduleName = 'ovhManagerPciInstancesInstanceDetachPrivateNetwork';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ovh-api-services',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('pciInstancesInstanceDetachPrivateNetwork', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
