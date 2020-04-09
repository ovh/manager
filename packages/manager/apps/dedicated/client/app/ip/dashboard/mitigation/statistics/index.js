import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';

import component from './statistics.component';
import routing from './statistics.routing';

const moduleName = 'ovhManagerDedicatedIpDashboardMitigationStatistics';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .component('ipDashboardMitigationStatistics', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ../../../translations */);

export default moduleName;
