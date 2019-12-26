import angular from 'angular';
import '@uirouter/angularjs';
import routing from './activity-log.routing';

import activityLogComponent from './activity-log.component';

const moduleName = 'ovhManagerAnalyticsDataPlatformActivityLogComponent';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component(
    'analyticsDataPlatformDetailsActivityLogComponent',
    activityLogComponent,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
