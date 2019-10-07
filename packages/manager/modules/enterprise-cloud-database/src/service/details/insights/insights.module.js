import angular from 'angular';

import enterpriseCloudDatabaseServiceDetailsInsightsComponent from './insights.component';
import routing from './insights.routing';

const moduleName = 'enterpriseCloudDatabaseServiceDetailsInsights';

angular
  .module(moduleName, [])
  .config(routing)
  .component('enterpriseCloudDatabaseServiceDetailsInsightsComponent', enterpriseCloudDatabaseServiceDetailsInsightsComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
