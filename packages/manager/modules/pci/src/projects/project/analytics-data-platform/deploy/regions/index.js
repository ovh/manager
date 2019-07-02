import angular from 'angular';
import '@uirouter/angularjs';
import regionsComponent from './regions.component';

const moduleName = 'ovhManagerAnalyticsDataPlatformDeployRegionsComponent';

angular
  .module(moduleName, [
    'ui.router',
  ])
  .component('regionsComponent', regionsComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
