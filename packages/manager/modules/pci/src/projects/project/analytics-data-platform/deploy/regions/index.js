import angular from 'angular';
import '@uirouter/angularjs';
import regionsComponent from './regions.component';
import regionsList from '../../../../../components/project/regions-list';

const moduleName = 'ovhManagerAnalyticsDataPlatformDeployRegionsComponent';

angular
  .module(moduleName, ['ui.router', regionsList])
  .component('analyticsDataPlatformDeployRegionsComponent', regionsComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
