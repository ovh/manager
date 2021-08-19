import angular from 'angular';

import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import routing from './order-host.routing';
import component from './order-host.component';

const moduleName = 'ovhManagerAnthosDashboardOrderHost';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('anthosDashboardOrderHost', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
