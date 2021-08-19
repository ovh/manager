import angular from 'angular';

import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import routing from './order-public-ips.routing';
import component from './order-public-ips.component';

const moduleName = 'ovhManagerAnthosDashboardOrderPublicIPs';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('anthosDashboardOrderPublicIPs', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
