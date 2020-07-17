import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';

import component from './attach-private-network.component';
import routing from './attach-private-network.routing';

const moduleName = 'ovhManagerPciInstancesInstanceAttachPrivateNetwork';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ovh-api-services',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('pciInstancesInstanceAttachPrivateNetwork', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
