import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ui-router-breadcrumb';
import '@uirouter/angularjs';
import 'angular-translate';

import component from './component';
import routing from './routing';

import listeners from './listeners';

const moduleName = 'ovhManagerOctaviaLoadBalancerDashboard';

angular
  .module(moduleName, [
    'ngUiRouterBreadcrumb',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    listeners,
  ])
  .config(routing)
  .component('octaviaLoadBalancer', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
