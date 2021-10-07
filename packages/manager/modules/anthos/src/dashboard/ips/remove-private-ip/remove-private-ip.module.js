import angular from 'angular';

import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import routing from './remove-private-ip.routing';
import component from './remove-private-ip.component';

const moduleName = 'ovhManagerAnthosDashboardIPsRemovePrivateIp';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('anthosDashboardIpsRemovePrivateIp', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
