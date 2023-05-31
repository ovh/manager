import angular from 'angular';

import component from './onboarding.component';
import routing from './onboarding.routing';

const moduleName = 'ovhManagerIAMOnboarding';

angular
  .module(moduleName, [])
  .component('iamOnboarding', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
