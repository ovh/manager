import angular from 'angular';
import '@ovh-ux/ui-kit';
import 'angular-translate';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';

import componentDiff from './dns-zone-diff-tool-viewer/history.component';
import componentDashboard from './dashboard/dashboard.component';

import routing from './history.routing';
import ZoneService from '../zone.service';

const moduleName = 'ovhManagerWebDomainZoneHistoryModule';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', ngOvhUtils])
  .component('domainZoneDashboardHistory', componentDashboard)
  .component('domainZoneDiffToolViewerHistory', componentDiff)
  .service('ZoneService', ZoneService)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
