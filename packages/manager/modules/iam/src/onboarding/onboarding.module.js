import angular from 'angular';

import advancedModeSwitch from '../components/advancedModeSwitch';

import component from './onboarding.component';
import routing from './onboarding.routing';

const moduleName = 'ovhManagerIAMOnboarding';

angular
  .module(moduleName, [advancedModeSwitch])
  .component('iamOnboarding', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
