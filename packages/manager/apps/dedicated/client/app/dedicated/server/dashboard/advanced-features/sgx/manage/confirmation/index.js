import angular from 'angular';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngAtInternetUiRouterPlugin from '@ovh-ux/ng-at-internet-ui-router-plugin';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './confirmation.component';
import routing from './confirmation.routing';

const moduleName = 'ovhManagerDedicatedServerDashboardSgxManageConfirmation';

angular
  .module(moduleName, [
    ngAtInternet,
    ngAtInternetUiRouterPlugin,
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('dedicatedServerDashboardSgxManageConfirmation', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
