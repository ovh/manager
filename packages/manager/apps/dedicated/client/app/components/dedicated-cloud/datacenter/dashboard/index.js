import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';

import component from './dedicatedCloud-datacenter-dashboard.component';
import zerto from '../zerto';
import zertoAlerts from '../zerto/alerts';
import dedicatedcloudDatacenterZertoSiteStateBadgeComponent from '../zerto/siteStateBadge';

const moduleName = 'ovhManagerDedicatedCloudDatacenterDashboardComponent';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    zerto,
    zertoAlerts,
    dedicatedcloudDatacenterZertoSiteStateBadgeComponent,
  ])
  .component('ovhManagerDedicatedCloudDatacenterDashboard', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
