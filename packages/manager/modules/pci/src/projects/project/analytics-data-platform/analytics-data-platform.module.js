import angular from 'angular';
import 'font-awesome/css/font-awesome.css';
import '@ovh-ux/ng-ovh-swimming-poll';

import analyticsDataPlatformComponent from './analytics-data-platform.component';
import analyticsDataPlatformService from './analytics-data-platform.service';
import routing from './analytics-data-platform.routing';
import deploy from './deploy';
import details from './details';
import onboarding from './onboarding';

const moduleName = 'ovhManagerAnalyticsDataPlatformComponent';

angular
  .module(moduleName, [deploy, details, 'ngOvhSwimmingPoll', onboarding])
  .config(routing)
  .component('analyticsDataPlatformComponent', analyticsDataPlatformComponent)
  .service('analyticsDataPlatformService', analyticsDataPlatformService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
