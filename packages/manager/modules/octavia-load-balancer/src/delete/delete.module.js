import angular from 'angular';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import '@ovh-ux/manager-core';
import 'angular-translate';
import '@ovh-ux/ng-ui-router-breadcrumb';
import '@uirouter/angularjs';
import '@ovh-ux/ng-ui-router-layout';

import component from './delete.component';
import routing from './delete.routing';

const moduleName = 'ovhManagerOctaviaLoadBalancerDeleteModule';

angular
  .module(moduleName, [
    'ngUiRouterBreadcrumb',
    'ngTranslateAsyncLoader',
    'oui',
    'ovhManagerCore',
    'ui.router',
    'ngUiRouterLayout',
    ngAtInternet,
  ])
  .config(routing)
  .component('octaviaLoadBalancerDelete', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
