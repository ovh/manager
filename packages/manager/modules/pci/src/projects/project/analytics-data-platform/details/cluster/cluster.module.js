import angular from 'angular';
import '@uirouter/angularjs';
import routing from './cluster.routing';

import clusterComponent from './cluster.component';

const moduleName = 'ovhManagerAnalyticsDataPlatformClusterComponent';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('analyticsDataPlatformDetailsClusterComponent', clusterComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
