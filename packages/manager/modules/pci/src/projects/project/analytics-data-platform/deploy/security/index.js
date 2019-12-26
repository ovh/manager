import angular from 'angular';
import '@uirouter/angularjs';
import securityComponent from './security.component';

const moduleName = 'ovhManagerAnalyticsDataPlatformDeploySecurityComponent';

angular
  .module(moduleName, ['ui.router'])
  .component('analyticsDataPlatformDeploySecurityComponent', securityComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
