import angular from 'angular';

import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import routing from './assign-private-ip.routing';
import component from './assign-private-ip.component';

const moduleName = 'ovhManagerAnthosDashboardIPsAssignPrivateIp';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('anthosDashboardIpsAssignPrivateIp', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
