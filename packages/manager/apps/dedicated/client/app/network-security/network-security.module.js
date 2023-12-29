import angular from 'angular';
import '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-ui-router-breadcrumb';
import '@ovh-ux/ui-kit';
import ovhManagerCore from '@ovh-ux/manager-core';

import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { ApiV2ListHelper } from '@ovh-ux/manager-ng-apiv2-helper';

import component from './network-security.component';
import routing from './network-security.routing';

import scrubbingCenter from './scrubbing-center';
import traffic from './traffic';

const moduleName = 'ovhNetworkSecurity';

angular
  .module(moduleName, [
    ListLayoutHelper.moduleName,
    'ngAtInternet',
    'ngUiRouterBreadcrumb',
    'oui',
    scrubbingCenter,
    traffic,
    ApiV2ListHelper.moduleName,
    ovhManagerCore,
  ])
  .config(routing)
  .component('networkSecurity', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
