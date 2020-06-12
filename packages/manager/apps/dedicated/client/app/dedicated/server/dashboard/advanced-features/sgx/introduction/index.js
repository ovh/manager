import angular from 'angular';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngAtInternetUiRouterPlugin from '@ovh-ux/ng-at-internet-ui-router-plugin';

import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './introduction.component';
import routing from './introduction.routing';

const moduleName = 'ovhManagerDedicatedServerDashboardSgxIntroduction';

angular
  .module(moduleName, [
    ngAtInternet,
    ngAtInternetUiRouterPlugin,
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('dedicatedServerDashboardSgxIntroduction', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
