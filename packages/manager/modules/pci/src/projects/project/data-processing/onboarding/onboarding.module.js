import angular from 'angular';
import angularTranslate from 'angular-translate';
import '@uirouter/angularjs';
import onboardingComponent from './onboarding.component';
import routing from './onboarding.routing';

const moduleName = 'ovhManagerPciProjectDataProcessingOnboarding';

angular
  .module(moduleName, ['ui.router', angularTranslate])
  .config(routing)
  .component('pciProjectDataProcessingOnboarding', onboardingComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
