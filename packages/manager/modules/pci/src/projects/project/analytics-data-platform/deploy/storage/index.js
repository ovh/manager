import angular from 'angular';
import '@uirouter/angularjs';
import storageComponent from './storage.component';

const moduleName = 'ovhManagerAnalyticsDataPlatformDeployStorageComponent';

angular
  .module(moduleName, ['ui.router'])
  .component('analyticsDataPlatformDeployStorageComponent', storageComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
