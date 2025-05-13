import angular from 'angular';
import 'angular-translate';
import componentDiff from './dns-zone-diff-tool-viewer/history.component';
import componentDashboard from './dashboard/dashboard.component';
import zoneHistoryView from './dashboard/view/view.component';
import zoneHistoryRestore from './dashboard/restore/restore.component';
import routing from './history.routing';

const moduleName = 'ovhManagerWebDomainZoneHistoryModule';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('domainZoneDashboardHistory', componentDashboard)
  .component('domainZoneDiffToolViewerHistory', componentDiff)
  .component('zoneHistoryView', zoneHistoryView)
  .component('zoneHistoryRestore', zoneHistoryRestore)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
