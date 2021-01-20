import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';
import ovhManagerAdvices from '@ovh-ux/manager-advices';

import component from './dedicatedCloud-datacenter-dashboard.component';
import drp from '../drp';
import drpAlerts from '../drp/alerts';

const moduleName = 'ovhManagerDedicatedCloudDatacenterDashboardComponent';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    drp,
    drpAlerts,
    ovhManagerAdvices,
  ])
  .component('ovhManagerDedicatedCloudDatacenterDashboard', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
