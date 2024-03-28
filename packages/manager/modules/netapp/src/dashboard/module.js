import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/manager-filters';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-ovh-utils';
import '@ovh-ux/ng-ovh-feature-flipping';
import '@ovh-ux/ng-at-internet';

import '@ovh-ux/manager-advices';
import '@ovh-ux/manager-billing-components';
import { ApiV2ListHelper } from '@ovh-ux/manager-ng-apiv2-helper';

import component from './component';
import routing from './routing';

import index from './index/module';
import snapshotPolicies from './snapshot-policies';
import volumes from './volumes';
import networkConfiguration from './network-configuration';

const moduleName = 'ovhManagerNetAppDashboard';

angular
  .module(moduleName, [
    'ngOvhFeatureFlipping',
    'ovhManagerBilling',
    'ovhManagerCore',
    'ovhManagerFilters',
    'ovhManagerAdvices',
    'ngAtInternet',
    'pascalprecht.translate',
    'ui.router',
    'ngOvhUtils',
    ApiV2ListHelper.moduleName,
    snapshotPolicies,
    volumes,
    networkConfiguration,
    index,
  ])
  .config(routing)
  .component('ovhManagerNetAppDashboard', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
