import angular from 'angular';
import 'angular-translate';

import componentDiff from './diff/history.component';
import componentDashboard from './dashboard/dashboard.component';
import routing from './history.routing';

const moduleName = 'ovhManagerWebDomainZoneHistoryModule';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .config(routing)
  .component('domainZoneDiffHistory', componentDiff)
  .component('domainZoneDashboardHistory', componentDashboard)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
