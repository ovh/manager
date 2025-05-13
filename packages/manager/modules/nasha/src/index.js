import angular from 'angular';

import '@uirouter/angularjs';
import '@ovh-ux/ng-ui-router-breadcrumb';
import '@ovh-ux/ng-at-internet';

import routing from './nasha.routing';

import directoryModule from './directory';
import orderModule from './order';
import onboardingModule from './onboarding';
import dashboardModule from './dashboard';

const moduleName = 'ovhManagerNasha';

angular
  .module(moduleName, [
    'ui.router',
    'ngUiRouterBreadcrumb',
    'ngAtInternet',
    directoryModule,
    orderModule,
    onboardingModule,
    dashboardModule,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
