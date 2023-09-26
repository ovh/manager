import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ui-router-breadcrumb';
import '@uirouter/angularjs';
import 'angular-translate';

import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import uiKit from '@ovh-ux/ui-kit';

import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

import dashboard from './dashboard';
import onboarding from './onboarding';
import routing from './octavia-load-balancer.routing';
import create from './create';

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
    onboarding,
    dashboard,
    create,
    ListLayoutHelper.moduleName,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
