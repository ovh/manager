import angular from 'angular';
import '@uirouter/angularjs';

import activityLog from './activity-log';
import cluster from './cluster';
import credentials from './credentials';
import serviceInformation from './service';
import detailsComponent from './details.component';
import progressComponent from './progress';
import routing from './details.routing';

const moduleName = 'ovhManagerAnalyticsDataPlatformServiceComponent';

angular
  .module(moduleName, [
    'ui.router',
    activityLog,
    cluster,
    credentials,
    progressComponent,
    serviceInformation,
  ])
  .config(routing)
  .component('analyticsDataPlatformDetailsComponent', detailsComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
