import angular from 'angular';
import '@uirouter/angularjs';
import generalComponent from './general.component';

const moduleName = 'ovhManagerAnalyticsDataPlatformDeployGeneralComponent';

angular
  .module(moduleName, ['ui.router'])
  .component('analyticsDataPlatformDeployGeneralComponent', generalComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
