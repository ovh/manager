import angular from 'angular';

import component from './onboarding.component';

const moduleName = 'ovhManagerIAMComponentsOnboarding';

angular
  .module(moduleName, [])
  .component('iamOnboarding', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
