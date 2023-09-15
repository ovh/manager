import angular from 'angular';
import '@ovh-ux/ng-ui-router-breadcrumb';
import '@uirouter/angularjs';
import 'angular-translate';
import ngAtInternet from '@ovh-ux/ng-at-internet';

import ovhManagerCatalogPrice from '@ovh-ux/manager-catalog-price';

import component from './component';
import routing from './routing';

const moduleName = 'ovhManagerOctaviaLoadBalancerCreate';

angular
  .module(moduleName, [
    'ngUiRouterBreadcrumb',
    'pascalprecht.translate',
    'ui.router',
    ovhManagerCatalogPrice,
    ngAtInternet,
  ])
  .config(routing)
  .component('octaviaLoadBalancerCreate', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
