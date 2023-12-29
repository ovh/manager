import angular from 'angular';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';
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
    ngUiRouterBreadcrumb,
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('dedicatedServerDashboardSgxIntroduction', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
