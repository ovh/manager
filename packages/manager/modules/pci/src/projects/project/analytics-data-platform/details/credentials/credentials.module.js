import angular from 'angular';
import '@uirouter/angularjs';
import routing from './credentials.routing';
import credentialsComponent from './credentials.component';

const moduleName = 'ovhManagerAnalyticsDataPlatformCredentialsComponent';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component(
    'analyticsDataPlatformDetailsCredentialsComponent',
    credentialsComponent,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
