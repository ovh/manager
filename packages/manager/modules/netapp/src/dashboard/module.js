import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-ovh-utils';
import '@ovh-ux/ng-ovh-feature-flipping';
import '@ovh-ux/ng-at-internet';

import '@ovh-ux/manager-advices';
import '@ovh-ux/manager-billing-components';
import component from './component';
import routing from './routing';

import snapshotPolicies from './snapshot-policies';
import volumes from './volumes';

const moduleName = 'ovhManagerNetAppDashboard';

angular
  .module(moduleName, [
    'ngOvhFeatureFlipping',
    'ovhManagerBilling',
    'ovhManagerCore',
    'ovhManagerAdvices',
    'ngAtInternet',
    'pascalprecht.translate',
    'ui.router',
    'ngOvhUtils',
    snapshotPolicies,
    volumes,
  ])
  .config(routing)
  .component('ovhManagerNetAppDashboard', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
