import angular from 'angular';
import 'angular-translate';
import componentDiff from './dns-zone-diff-tool-viewer/history.component';
import componentDashboard from './dashboard/dashboard.component';
import routing from './history.routing';

const moduleName = 'ovhManagerWebDomainZoneHistoryModule';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('domainZoneDashboardHistory', componentDashboard)
  .component('domainZoneDiffToolViewerHistory', componentDiff)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
