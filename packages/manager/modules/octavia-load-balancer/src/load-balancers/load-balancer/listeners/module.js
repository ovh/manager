import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ui-router-breadcrumb';
import '@uirouter/angularjs';
import 'angular-translate';

import component from './component';
import routing from './routing';
import service from './service';

const moduleName = 'ovhManagerOctaviaLoadBalancerListeners';

angular
  .module(moduleName, [
    'ngUiRouterBreadcrumb',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .component('octaviaLoadBalancerListeners', component)
  .service('OctaviaLoadBalancerListenersService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
