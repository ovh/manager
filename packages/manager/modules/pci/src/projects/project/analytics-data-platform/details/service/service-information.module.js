import angular from 'angular';
import '@uirouter/angularjs';

import serviceInformationComponent from './service-information.component';
import routing from './service-information.routing';
import terminate from './terminate';

const moduleName = 'ovhManagerAnalyticsDataPlatformServiceInformationComponent';

angular
  .module(moduleName, ['ui.router', terminate])
  .config(routing)
  .component(
    'analyticsDataPlatformDetailsServiceInformationComponent',
    serviceInformationComponent,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
