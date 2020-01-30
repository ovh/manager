import angular from 'angular';
import '@uirouter/angularjs';
import onboardingComponent from './onboarding.component';
import routing from './onboarding.routing';

const moduleName = 'ovhManagerAnalyticsDataPlatformOnboardingComponent';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('analyticsDataPlatformOnboardingComponent', onboardingComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
