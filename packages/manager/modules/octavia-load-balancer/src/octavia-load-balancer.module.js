import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ui-router-breadcrumb';
import '@uirouter/angularjs';
import 'angular-translate';

import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

import dashboard from './dashboard';
import onboarding from './onboarding';
import routing from './octavia-load-balancer.routing';

const moduleName = 'ovhManagerOctaviaLoadBalancer';

angular
  .module(moduleName, [
    'ngUiRouterBreadcrumb',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    onboarding,
    dashboard,
    ListLayoutHelper.moduleName,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
