import angular from 'angular';
import '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-ui-router-breadcrumb';
import '@ovh-ux/ui-kit';

import { ListLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import { ApiV2ListHelper } from '../../../../../modules/ng-apiv2-helper';

import component from './network-security.component';
import routing from './network-security.routing';

import scrubbing from './scrubbing-center';

const moduleName = 'ovhNetworkSecurity';

angular
  .module(moduleName, [
    ListLayoutHelper.moduleName,
    'ngAtInternet',
    'ngUiRouterBreadcrumb',
    'oui',
    scrubbing,
    ApiV2ListHelper.moduleName,
  ])
  .config(routing)
  .component('networkSecurity', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
