import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ui-router-breadcrumb';
import '@uirouter/angularjs';
import 'angular-translate';

import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import uiKit from '@ovh-ux/ui-kit';

import onboarding from './onboarding';
import loadbalancer from './load-balancers/load-balancer';
import routing from './octavia-load-balancer.routing';
import create from './create';

import deleteComponent from './delete';
import loadBalancers from './load-balancers';
import service from './octavia-load-balancer.service';

import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';

const moduleName = 'ovhManagerOctaviaLoadBalancer';

angular
  .module(moduleName, [
    'ngUiRouterBreadcrumb',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    ngOvhUtils,
    uiKit,
    'oui',
    onboarding,
    loadbalancer,
    create,
    deleteComponent,
    loadBalancers,
  ])
  .config(routing)
  .service('OctaviaLoadBalanderService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
