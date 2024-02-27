import angular from 'angular';
import '@ovh-ux/ng-ui-router-breadcrumb';
import '@uirouter/angularjs';
import 'angular-translate';
import ngAtInternet from '@ovh-ux/ng-at-internet';

import ovhManagerCatalogPrice from '@ovh-ux/manager-catalog-price';
import pciUniverseComponents from '@ovh-ux/ng-ovh-pci-universe-components';
import octaviaComponents from '../components';

import component from './component';
import routing from './routing';
import service from './service';

const moduleName = 'ovhManagerOctaviaLoadBalancerCreate';

angular
  .module(moduleName, [
    'ngUiRouterBreadcrumb',
    'pascalprecht.translate',
    'ui.router',
    ovhManagerCatalogPrice,
    pciUniverseComponents,
    octaviaComponents,
    ngAtInternet,
  ])
  .config(routing)
  .component('octaviaLoadBalancerCreate', component)
  .service('OctaviaLoadBalancerCreateService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
