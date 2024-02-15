import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ui-router-breadcrumb';
import '@uirouter/angularjs';
import 'angular-translate';

import pciUniverseComponents from '@ovh-ux/ng-ovh-pci-universe-components';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import uiKit from '@ovh-ux/ui-kit';

import component from './load-balancers.component';
import routing from './load-balancers.routing';

import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';
import './styles.scss';

const moduleName = 'ovhManagerOctaviaLoadBalancers';

angular
  .module(moduleName, [
    'ngUiRouterBreadcrumb',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    pciUniverseComponents,
    ngOvhUtils,
    uiKit,
    'oui',
  ])
  .config(routing)
  .component('octaviaLoadBalancerListing', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
